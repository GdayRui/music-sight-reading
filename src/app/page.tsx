"use client"

import { useState, useEffect, useRef } from 'react';
import Staff from '../components/Staff';
import NoteInput from '../components/NoteInput';
import Result from '../components/Result';
import styles from './page.module.scss';

export default function Home() {
  const [currentNote, setCurrentNote] = useState('');
  const [mode, setMode] = useState<'treble' | 'bass' | 'mixed'>('treble');
  const [currentClef, setCurrentClef] = useState<'treble' | 'bass'>('treble');
  const [result, setResult] = useState<{
    isCorrect: boolean;
    userGuess: string;
    correctNote: string;
  } | null>(null);
  
  const nextButtonRef = useRef<HTMLButtonElement>(null);

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
    setCurrentNote(generateRandomNote());
  }, []);

  // Regenerate note when mode changes
  useEffect(() => {
    setResult(null);
    setCurrentNote(generateRandomNote());
  }, [mode]);

  // Auto-focus the "Next Note" button only when answer is correct
  useEffect(() => {
    if (result && result.isCorrect && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [result]);

  const handleNoteSubmit = (guess: string) => {
    // Extract just the note letter from currentNote (e.g., "C4" becomes "C")
    const correctNoteLetter = currentNote.charAt(0);
    const isCorrect = guess.toUpperCase() === correctNoteLetter.toUpperCase();
    
    setResult({
      isCorrect,
      userGuess: guess,
      correctNote: currentNote
    });
  };

  const handleNextNote = () => {
    setResult(null);
    setCurrentNote(generateRandomNote());
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
            </div>

            <div className={styles.interactionSection}>
              {result ? (
                <div className={styles.resultSection}>
                  <Result 
                    isCorrect={result.isCorrect}
                    userGuess={result.userGuess}
                    correctNote={result.correctNote}
                  />
                  <button 
                    ref={nextButtonRef}
                    onClick={handleNextNote}
                    className={styles.nextButton}
                  >
                    Next Note
                  </button>
                </div>
              ) : (
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