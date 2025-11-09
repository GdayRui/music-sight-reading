import styles from './Staff.module.scss';

interface StaffProps {
  note: string;
}

export default function Staff({ note }: StaffProps) {
  // Map notes to their position on the treble clef staff
  // Staff lines: y=60 (top), y=80, y=100, y=120, y=140 (bottom) - 20px apart
  // CORRECT treble clef positions:
  // Lines (bottom to top): E4(y=140), G4(y=120), B4(y=100), D5(y=80), F5(y=60)
  // Spaces (bottom to top): F4(y=130), A4(y=110), C5(y=90), E5(y=70)
  // Below staff: D4(y=150), C4(y=160), B3(y=170), A3(y=180)
  const notePositions: Record<string, number> = {
    'C4': 160,  // C4 - 1st ledger line below staff (y=160)
    'D4': 150,  // D4 - space below bottom staff line
    'E4': 140,  // E4 - bottom staff line (y=140)
    'F4': 130,  // F4 - space above bottom line
    'G4': 120,  // G4 - second staff line (y=120)
    'A4': 110,  // A4 - space above second line
    'B4': 100,  // B4 - middle staff line (y=100)
    'C5': 90,   // C5 - space above middle line
    'D5': 80,   // D5 - fourth staff line (y=80)
    'E5': 70,   // E5 - space above fourth line
    'F5': 60,   // F5 - top staff line (y=60)
    'G5': 50,   // G5 - space above top line
    'A5': 40,   // A5 - ledger line above staff (y=40)
    'B5': 30,   // B5 - space above ledger line
    'C6': 20,   // C6 - ledger line above staff (y=20)
  };

  const position = notePositions[note] || 100;

  return (
    <div className={styles.staffContainer}>
      <svg width="300" height="200" viewBox="0 0 300 200">
        {/* Staff lines */}
        {[0, 1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1="50"
            y1={60 + line * 20}
            x2="250"
            y2={60 + line * 20}
            stroke="#000"
            strokeWidth="1"
          />
        ))}
        
        {/* Treble clef */}
        <text
          x="55"
          y="135"
          fontSize="120"
          fontFamily="serif"
          fill="#000"
        >
          𝄞
        </text>
        
        {/* Note */}
        <circle
          cx="200"
          cy={position}
          r="8"
          fill="#000"
        />
        
        {/* Stem */}
        <line
          x1="208"
          y1={position}
          x2="208"
          y2={position - 40}
          stroke="#000"
          strokeWidth="2"
        />
        
        {/* Ledger lines for notes outside staff */}
        {/* Above staff ledger lines - y=40, y=20 */}
        {position <= 50 && (
          <>
            {[40, 20].filter(y => y >= position - 10).map(y => (
              <line
                key={`ledger-above-${y}`}
                x1="190"
                y1={y}
                x2="210"
                y2={y}
                stroke="#000"
                strokeWidth="1"
              />
            ))}
          </>
        )}
        {/* Below staff ledger lines - y=160 (for C4) */}
        {position >= 160 && (
          <>
            {[160].filter(y => y <= position + 10).map(y => (
              <line
                key={`ledger-below-${y}`}
                x1="190"
                y1={y}
                x2="210"
                y2={y}
                stroke="#000"
                strokeWidth="1"
              />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}