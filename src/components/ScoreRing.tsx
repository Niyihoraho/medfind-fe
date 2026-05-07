import { C } from '@/lib/theme';

export function ScoreRing({ score = 75, size = 56 }: any) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.accentLight} strokeWidth="5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.primary} strokeWidth="5"
          strokeDasharray={`${pct} ${circ}`} strokeLinecap="round" />
      </svg>
      <span style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontSize: 16, fontWeight: 600, color: C.text,
      }}>{score}</span>
    </div>
  );
}
