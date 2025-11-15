import { useState, useEffect, useRef } from 'react';
import styles from './AudioInput.module.scss';

interface AudioInputProps {
  correctNote: string;
  onSubmit: (guess: string, confidence: number) => void;
  isEnabled: boolean;
}

export default function AudioInput({ correctNote, onSubmit, isEnabled }: AudioInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lastDetectedNoteRef = useRef<string>('');
  const consecutiveDetectionsRef = useRef<number>(0);

  // Note frequencies for pitch detection
  const noteFrequencies: Record<string, number> = {
    'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50
  };

  // Get note name from frequency
  const getClosestNote = (frequency: number): { note: string; confidence: number } => {
    let closestNote = '';
    let smallestDifference = Infinity;
    
    for (const [note, freq] of Object.entries(noteFrequencies)) {
      const difference = Math.abs(frequency - freq);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestNote = note;
      }
    }
    
    // Calculate confidence based on how close the frequency is
    // Allow for slightly out-of-tune pianos with more forgiving tolerance
    const expectedFreq = noteFrequencies[closestNote];
    const percentDifference = Math.abs(frequency - expectedFreq) / expectedFreq;
    const confidence = Math.max(0, 1 - (percentDifference * 5)); // 20% tolerance for out-of-tune pianos
    
    return { note: closestNote, confidence };
  };

  // Autocorrelation function for pitch detection
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    const rms = Math.sqrt(buffer.reduce((sum, val) => sum + val * val, 0) / SIZE);
    
    // Increase threshold to ignore ambient noise - only detect actual piano sounds
    if (rms < 0.01) return -1; // Require stronger signal to avoid ambient noise
    
    // Start from a minimum offset to avoid finding harmonics
    // For piano range C2 (65Hz) to C6 (1046Hz), we need offset range
    const minOffset = Math.floor(sampleRate / 1200); // ~40 samples at 48kHz (higher than C6)
    const maxOffset = Math.floor(sampleRate / 60);   // ~800 samples at 48kHz (lower than C2)
    
    let maxCorrelation = 0;
    let bestOffset = -1;
    const correlations = new Float32Array(SIZE);
    
    // Calculate autocorrelation
    for (let offset = minOffset; offset < Math.min(maxOffset, SIZE / 2); offset++) {
      let sum = 0;
      for (let i = 0; i < SIZE - offset; i++) {
        sum += Math.abs(buffer[i] * buffer[i + offset]);
      }
      
      correlations[offset] = sum;
      
      if (sum > maxCorrelation) {
        maxCorrelation = sum;
        bestOffset = offset;
      }
    }
    
    if (bestOffset === -1) return -1;
    
    // Interpolate for better precision using parabolic interpolation
    let shift = 0;
    if (bestOffset > minOffset && bestOffset < SIZE / 2 - 1) {
      const y1 = correlations[bestOffset - 1];
      const y2 = correlations[bestOffset];
      const y3 = correlations[bestOffset + 1];
      const denominator = (2 * y2 - y1 - y3);
      if (denominator !== 0) {
        shift = (y3 - y1) / (2 * denominator);
      }
    }
    
    const finalOffset = bestOffset + shift;
    if (finalOffset <= 0) return -1; // Prevent division by zero
    
    return sampleRate / finalOffset;
  };

  // Analyze audio for pitch
  const analyzeAudio = () => {
    if (!analyserRef.current || !audioContextRef.current) {
      console.log('No analyser or audio context!');
      return;
    }
    
    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    // Only log when we detect a valid frequency
    if (frequency > 0 && frequency !== Infinity && !isNaN(frequency)) {
      console.log('Detected frequency:', frequency);
      const { note, confidence } = getClosestNote(frequency);
      console.log('Closest note:', note, 'Confidence:', confidence);
      
      if (confidence > 0.4) { // Even lower threshold for initial detection
        setDetectedNote(note);
        setConfidence(confidence);
        
        // Track consecutive detections of the same note
        if (note === lastDetectedNoteRef.current) {
          consecutiveDetectionsRef.current++;
        } else {
          lastDetectedNoteRef.current = note;
          consecutiveDetectionsRef.current = 1;
        }
        
        // Auto-submit only if:
        // 1. Confidence is very high (>80%) - raised threshold
        // 2. We've been listening for at least 500ms
        // 3. Same note detected consistently (at least 5 times in a row) - increased requirement
        const timeSinceStart = Date.now() - startTimeRef.current;
        if (confidence > 0.8 && timeSinceStart > 500 && consecutiveDetectionsRef.current >= 5) {
          console.log('Auto-submitting:', note);
          onSubmit(note, confidence); // Submit full note with octave (e.g., "C5")
          
          // Reset counters but keep listening for the next note
          consecutiveDetectionsRef.current = 0;
          lastDetectedNoteRef.current = '';
          setDetectedNote('');
          setConfidence(0);
          startTimeRef.current = Date.now(); // Reset timer for next note
        }
      } else {
        // Reset consecutive count if confidence drops
        consecutiveDetectionsRef.current = 0;
        lastDetectedNoteRef.current = '';
      }
    } else {
      // Reset consecutive count if no valid frequency
      consecutiveDetectionsRef.current = 0;
      lastDetectedNoteRef.current = '';
    }
    
    // Continue analyzing
    animationRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Start audio input
  const startListening = async () => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      });
      
      console.log('Microphone access granted');
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      console.log('AudioContext created, sample rate:', audioContextRef.current.sampleRate);
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 4096; // Increase buffer size for better low-frequency resolution
      analyserRef.current.smoothingTimeConstant = 0.8;
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;
      microphoneRef.current.connect(analyserRef.current);
      
      console.log('Audio nodes connected, starting analysis...');
      setIsListening(true);
      startTimeRef.current = Date.now(); // Record when we started listening
      analyzeAudio();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  // Stop audio input
  const stopListening = () => {
    setIsListening(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setDetectedNote('');
    setConfidence(0);
    consecutiveDetectionsRef.current = 0;
    lastDetectedNoteRef.current = '';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Auto-stop when disabled
  useEffect(() => {
    if (!isEnabled && isListening) {
      stopListening();
    }
  }, [isEnabled, isListening]);

  if (!isEnabled) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Audio Input</h3>
        {isListening && (
          <button onClick={stopListening} className={styles.stopButton} title="Stop Listening">
            ⏹
          </button>
        )}
      </div>
      
      {!isListening ? (
        <div className={styles.controls}>
          <button onClick={startListening} className={styles.startButton}>
            🎤 Start Listening
          </button>
        </div>
      ) : (
        <div className={styles.feedback}>
          <div className={styles.status}>
            <div className={`${styles.indicator} ${styles.listening}`}></div>
            Listening for notes...
          </div>
          
          {detectedNote && (
            <div className={styles.detection}>
              <span className={styles.note}>Detected: {detectedNote}</span>
              <span className={styles.confidence}>
                Confidence: {(confidence * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.instructions}>
        <p>Play a note on your piano or sing/hum the note.</p>
        <p>The app will automatically detect and submit high-confidence matches.</p>
      </div>
    </div>
  );
}
