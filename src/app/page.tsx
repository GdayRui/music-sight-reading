"use client"

import { useState, useEffect, useRef } from 'react';
import Staff from '../components/Staff';
import NoteInput from '../components/NoteInput';
import Result from '../components/Result';
import AudioInput from '../components/AudioInput';
import styles from './page.module.scss';

export default function Home() {
  const [currentNote, setCurrentNote] = useState('');
  const [mode, setMode] = useState<'treble' | 'bass' | 'mixed'>('treble');
  const [currentClef, setCurrentClef] = useState<'treble' | 'bass'>('treble');
  const [audioInputEnabled, setAudioInputEnabled] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    userGuess: string;
    correctNote: string;
  } | null>(null);
  
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const currentNoteRef = useRef<string>(''); // Add ref to always have latest note

  const trebleNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
  const bassNotes = ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'];

  const generateRandomNote = () => {
    let notes: string[];
    let clef: 'treble' | 'bass';
    
    if (mode === 'mixed') {
      // Randomly choose a clef
      clef = Math.random() < 0.5 ? 'treble' : 'bass';
      notes = clef === 'treble' ? trebleNotes : bassNotes;
      setCurrentClef(clef);
    } else {
      clef = mode;
      notes = mode === 'treble' ? trebleNotes : bassNotes;
      setCurrentClef(clef);
    }
    
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  };

  useEffect(() => {
    const newNote = generateRandomNote();
    setCurrentNote(newNote);
    currentNoteRef.current = newNote; // Keep ref in sync
  }, []);

  // Regenerate note when mode changes
  useEffect(() => {
    setResult(null);
    const newNote = generateRandomNote();
    setCurrentNote(newNote);
    currentNoteRef.current = newNote; // Keep ref in sync
  }, [mode]);

  // Auto-focus the "Next Note" button only when answer is correct
  useEffect(() => {
    if (result && result.isCorrect && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [result]);

  // Auto-advance to next note after 500ms if answer is correct
  useEffect(() => {
    if (result && result.isCorrect) {
      const timer = setTimeout(() => {
        setResult(null);
        const newNote = generateRandomNote();
        setCurrentNote(newNote);
        currentNoteRef.current = newNote; // Keep ref in sync
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleNoteSubmit = (guess: string, confidence?: number) => {
    // Extract just the note letter from currentNote (e.g., "C4" becomes "C")
    // Use ref to get the latest value, avoiding stale closure
    const correctNoteLetter = currentNoteRef.current.charAt(0);
    const isCorrect = guess.toUpperCase() === correctNoteLetter.toUpperCase();
    
    setResult({
      isCorrect,
      userGuess: guess,
      correctNote: currentNoteRef.current
    });
  };

  const handleNextNote = () => {
    setResult(null);
    const newNote = generateRandomNote();
    setCurrentNote(newNote);
    currentNoteRef.current = newNote; // Keep ref in sync
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Piano Sight Reading Practice</h1>
          <p className={styles.subtitle}>
            Identify the note displayed on the staff
          </p>
          
          {/* Clef selector */}
          <div className={styles.clefSelector}>
            <button 
              className={`${styles.clefButton} ${mode === 'treble' ? styles.active : ''}`}
              onClick={() => setMode('treble')}
            >
              Treble Clef
            </button>
            <button 
              className={`${styles.clefButton} ${mode === 'bass' ? styles.active : ''}`}
              onClick={() => setMode('bass')}
            >
              Bass Clef
            </button>
            <button 
              className={`${styles.clefButton} ${mode === 'mixed' ? styles.active : ''}`}
              onClick={() => setMode('mixed')}
            >
              Mixed
            </button>
          </div>
        </header>

        {currentNote && (
          <div className={styles.gameArea}>
            <div className={styles.staffSection}>
              <Staff note={currentNote} clef={currentClef} />
              {result && result.isCorrect && (
                <div className={styles.successIndicator}>✓</div>
              )}
              {result && !result.isCorrect && (
                <div className={styles.failureIndicator}>
                  <div className={styles.wrongMark}>✗</div>
                  <div className={styles.correctAnswer}>Correct: {result.correctNote}</div>
                </div>
              )}
            </div>

            <div className={styles.interactionSection}>
              {/* Input mode toggle */}
              <div className={styles.inputModeToggle}>
                <button 
                  className={`${styles.modeButton} ${!audioInputEnabled ? styles.active : ''}`}
                  onClick={() => setAudioInputEnabled(false)}
                >
                  Keyboard
                </button>
                <button 
                  className={`${styles.modeButton} ${audioInputEnabled ? styles.active : ''}`}
                  onClick={() => setAudioInputEnabled(true)}
                >
                  Microphone
                </button>
              </div>

              {/* Keep AudioInput mounted to maintain listening state */}
              {audioInputEnabled && (
                <AudioInput 
                  correctNote={currentNote}
                  onSubmit={handleNoteSubmit}
                  isEnabled={true}
                />
              )}

              {/* Only show result section for wrong answers or keyboard mode */}
              {result && !result.isCorrect && (
                <div className={styles.resultSection}>
                  <button 
                    ref={nextButtonRef}
                    onClick={handleNextNote}
                    className={styles.nextButton}
                  >
                    Next Note
                  </button>
                </div>
              )}
              
              {!audioInputEnabled && !result && (
                <div className={styles.inputSection}>
                  <NoteInput 
                    correctNote={currentNote}
                    onSubmit={handleNoteSubmit}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>

  );
}