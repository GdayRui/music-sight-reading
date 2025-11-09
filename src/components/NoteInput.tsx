import { useState, useEffect, useRef } from 'react';
import styles from './NoteInput.module.scss';

interface NoteInputProps {
  correctNote: string;
  onSubmit: (guess: string) => void;
}

export default function NoteInput({ correctNote, onSubmit }: NoteInputProps) {
  const [guess, setGuess] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when component mounts or resets
  useEffect(() => {
    if (inputRef.current && !isSubmitted) {
      inputRef.current.focus();
    }
  }, [isSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onSubmit(guess.toUpperCase());
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setGuess('');
    setIsSubmitted(false);
    // Focus will be handled by useEffect when isSubmitted changes
  };

  const validNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="note-input" className={styles.label}>
            What note is this?
          </label>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              id="note-input"
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className={styles.input}
              maxLength={1}
              disabled={isSubmitted}
              pattern="[CDEFGABcdefgab]"
              autoFocus
            />
            {!isSubmitted && (
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={!guess.trim() || !validNotes.includes(guess.toUpperCase())}
              >
                Submit
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.buttons}>
          {isSubmitted && (
            <button 
              type="button" 
              onClick={handleReset}
              className={styles.resetButton}
            >
              Try Another Note
            </button>
          )}
        </div>
      </form>
      
      {/* Quick note buttons */}
      {!isSubmitted && (
        <div className={styles.noteButtons}>
          {validNotes.map(note => (
            <button
              key={note}
              type="button"
              onClick={() => setGuess(note)}
              className={`${styles.noteButton} ${guess === note ? styles.selected : ''}`}
            >
              {note}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}