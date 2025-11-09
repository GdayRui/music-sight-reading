import styles from './Result.module.scss';

interface ResultProps {
  isCorrect: boolean;
  userGuess: string;
  correctNote: string;
}

export default function Result({ isCorrect, userGuess, correctNote }: ResultProps) {
  return (
    <div className={`${styles.container} ${isCorrect ? styles.success : styles.failure}`}>
      <div className={styles.icon}>
        {isCorrect ? '✓' : '✗'}
      </div>
      
      <div className={styles.message}>
        {isCorrect ? (
          <h2 className={styles.title}>Correct!</h2>
        ) : (
          <>
            <h2 className={styles.title}>Incorrect</h2>
            <p className={styles.details}>
              You guessed <strong>{userGuess}</strong>, but the correct answer is <strong>{correctNote}</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
}