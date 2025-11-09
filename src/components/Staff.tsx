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
  // Below staff: F2(y=150), E2(y=160-ledger), D2(y=170), C2(y=180-ledger)
  // Above staff: C4(y=40-ledger), D4(y=30), E4(y=20-ledger), F4(y=10), G4(y=0-ledger)
  const bassPositions: Record<string, number> = {
    'C2': 180,  // C2 - ledger line below staff
    'D2': 170,  // D2 - space below ledger
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
    'F4': 10,   // F4 - space above ledger
    'G4': 0,    // G4 - ledger line above staff
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
            y="118"
            fontSize="85"
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
        
        {/* Stem - direction based on position relative to middle line (y=100) */}
        {position <= 100 ? (
          // Stem goes down (to the left of note head)
          <line
            x1="193"
            y1={position}
            x2="193"
            y2={position + 40}
            stroke="#000"
            strokeWidth="2"
          />
        ) : (
          // Stem goes up (to the right of note head)
          <line
            x1="207"
            y1={position}
            x2="207"
            y2={position - 40}
            stroke="#000"
            strokeWidth="2"
          />
        )}
        
        {/* Ledger lines for notes outside staff */}
        {clef === 'treble' ? (
          <>
            {/* Treble: Above staff ledger lines - only show for notes ON lines or spaces above */}
            {/* A5 at y=40 (on line), B5 at y=30 (space above) - both need y=40 ledger */}
            {(position === 40 || position === 30) && (
              <line
                key="ledger-above-40"
                x1="185"
                y1={40}
                x2="215"
                y2={40}
                stroke="#000"
                strokeWidth="1"
              />
            )}
            {/* C6 at y=20 (on line) - needs both y=40 and y=20 ledgers */}
            {position === 20 && (
              <>
                <line
                  key="ledger-above-40"
                  x1="185"
                  y1={40}
                  x2="215"
                  y2={40}
                  stroke="#000"
                  strokeWidth="1"
                />
                <line
                  key="ledger-above-20"
                  x1="185"
                  y1={20}
                  x2="215"
                  y2={20}
                  stroke="#000"
                  strokeWidth="1"
                />
              </>
            )}
            {/* Treble: Below staff ledger line - only for C4 at y=160 or D4 at y=150 */}
            {(position === 160 || position === 150) && (
              <line
                key="ledger-below-160"
                x1="185"
                y1={160}
                x2="215"
                y2={160}
                stroke="#000"
                strokeWidth="1"
              />
            )}
          </>
        ) : (
          <>
            {/* Bass: Above staff ledger lines - only show for notes ON lines or spaces above */}
            {/* C4 at y=40 (on line), D4 at y=30 (space above) - both need y=40 ledger */}
            {(position === 40 || position === 30) && (
              <line
                key="ledger-above-40"
                x1="185"
                y1={40}
                x2="215"
                y2={40}
                stroke="#000"
                strokeWidth="1"
              />
            )}
            {/* E4 at y=20 (on line) - needs both y=40 and y=20 ledgers */}
            {position === 20 && (
              <>
                <line
                  key="ledger-above-40"
                  x1="185"
                  y1={40}
                  x2="215"
                  y2={40}
                  stroke="#000"
                  strokeWidth="1"
                />
                <line
                  key="ledger-above-20"
                  x1="185"
                  y1={20}
                  x2="215"
                  y2={20}
                  stroke="#000"
                  strokeWidth="1"
                />
              </>
            )}
            {/* Bass: Below staff ledger lines - for notes ON lines or spaces below */}
            {/* E2 at y=160 (on line), D2 at y=170 (space below) - both need y=160 ledger */}
            {(position === 160 || position === 170) && (
              <line
                key="ledger-below-160"
                x1="185"
                y1={160}
                x2="215"
                y2={160}
                stroke="#000"
                strokeWidth="1"
              />
            )}
            {/* C2 at y=180 (on line) - needs both y=160 and y=180 ledgers */}
            {position === 180 && (
              <>
                <line
                  key="ledger-below-160"
                  x1="185"
                  y1={160}
                  x2="215"
                  y2={160}
                  stroke="#000"
                  strokeWidth="1"
                />
                <line
                  key="ledger-below-180"
                  x1="185"
                  y1={180}
                  x2="215"
                  y2={180}
                  stroke="#000"
                  strokeWidth="1"
                />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}