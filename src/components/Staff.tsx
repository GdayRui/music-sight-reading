import styles from './Staff.module.scss';

interface StaffProps {
  note: string;
  clef: 'treble' | 'bass';
}

export default function Staff({ note, clef }: StaffProps) {
  // Staff lines: y=60 (top), y=80, y=100, y=120, y=140 (bottom) - 20px apart
  
  // Treble clef positions:
  // Lines (bottom to top): E4(y=140), G4(y=120), B4(y=100), D5(y=80), F5(y=60)
  // Spaces (bottom to top): F4(y=130), A4(y=110), C5(y=90), E5(y=70)
  const treblePositions: Record<string, number> = {
    'C4': 160,  'D4': 150,  'E4': 140,  'F4': 130,
    'G4': 120,  'A4': 110,  'B4': 100,  'C5': 90,
    'D5': 80,   'E5': 70,   'F5': 60,   'G5': 50,
    'A5': 40,   'B5': 30,   'C6': 20,
  };

  // Bass clef positions:
  // Lines (bottom to top): G2(y=140), B2(y=120), D3(y=100), F3(y=80), A3(y=60)
  // Spaces (bottom to top): A2(y=130), C3(y=110), E3(y=90), G3(y=70), B3(y=50)
  // Below staff: F2(y=150), E2(y=160-ledger)
  // Above staff: C4(y=40-ledger), D4(y=30), E4(y=20-ledger)
  const bassPositions: Record<string, number> = {
    'E2': 160,  // E2 - ledger line below staff
    'F2': 150,  // F2 - space below bottom line
    'G2': 140,  // G2 - bottom staff line
    'A2': 130,  // A2 - space above bottom line
    'B2': 120,  // B2 - second staff line
    'C3': 110,  // C3 - space above second line
    'D3': 100,  // D3 - middle staff line
    'E3': 90,   // E3 - space above middle line
    'F3': 80,   // F3 - fourth staff line
    'G3': 70,   // G3 - space above fourth line
    'A3': 60,   // A3 - top staff line
    'B3': 50,   // B3 - space above top line
    'C4': 40,   // C4 - ledger line above staff
    'D4': 30,   // D4 - space above ledger
    'E4': 20,   // E4 - ledger line above staff
    'F4': 10,   // F4 - space above ledger (too high, adjust if needed)
    'G4': 0,    // G4 - ledger line above staff (too high, adjust if needed)
  };

  const notePositions = clef === 'treble' ? treblePositions : bassPositions;

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
        
        {/* Clef symbol */}
        {clef === 'treble' ? (
          <text
            x="55"
            y="135"
            fontSize="120"
            fontFamily="serif"
            fill="#000"
          >
            𝄞
          </text>
        ) : (
          <text
            x="60"
            y="105"
            fontSize="60"
            fontFamily="serif"
            fill="#000"
          >
            𝄢
          </text>
        )}
        
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
        {clef === 'treble' ? (
          <>
            {/* Treble: Above staff ledger lines - y=40, y=20 */}
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
            {/* Treble: Below staff ledger line - y=160 (for C4) */}
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
          </>
        ) : (
          <>
            {/* Bass: Above staff ledger lines - y=40, y=20 */}
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
            {/* Bass: Below staff ledger lines - y=160, y=180 */}
            {position >= 160 && (
              <>
                {[160, 180].filter(y => y <= position + 10).map(y => (
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
          </>
        )}
      </svg>
    </div>
  );
}