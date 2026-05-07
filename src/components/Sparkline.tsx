import { C } from '@/lib/theme';

export function Sparkline({ data, trend }: any) {
  const vals = data.map((d: any) => d.raw);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 60, H = 24, pad = 3;
  const pts = vals.map((v: any, i: number) => {
    const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const color = trend === "up-bad" ? C.red : trend === "down" ? C.orange : C.primary;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
