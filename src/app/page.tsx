"use client"

import { useState, useEffect, useRef } from 'react';
import Staff from '../components/Staff';
import NoteInput from '../components/NoteInput';
import Result from '../components/Result';
import styles from './page.module.scss';

export default function Home() {
  const [currentNote, setCurrentNote] = useState('');
  const [result, setResult] = useState<{
    isCorrect: boolean;
    userGuess: string;
    correctNote: string;
  } | null>(null);
  
  const nextButtonRef = useRef<HTMLButtonElement>(null);



  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];

  const generateRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  };

  useEffect(() => {
    setCurrentNote(generateRandomNote());
  }, []);

  // Auto-focus the "Next Note" button when result is shown
  useEffect(() => {
    if (result && nextButtonRef.current) {
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
        </header>

        {currentNote && (
          <div className={styles.gameArea}>
            <div className={styles.staffSection}>
              <Staff note={currentNote} />
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