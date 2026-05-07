export function GridIcon({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1" y="1" width="6" height="6" rx="1" fill={color} opacity=".9"/>
      <rect x="9" y="1" width="6" height="6" rx="1" fill={color} opacity=".9"/>
      <rect x="1" y="9" width="6" height="6" rx="1" fill={color} opacity=".9"/>
      <rect x="9" y="9" width="6" height="6" rx="1" fill={color} opacity=".9"/>
    </svg>
  );
}

export function FlaskIcon({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6 1v5L2 13h12L10 6V1" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 1h6" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function CalIcon({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke={color} strokeWidth="1.4"/>
      <path d="M5 1v3M11 1v3M1.5 6.5h13" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function LightIcon({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="7" r="4" stroke={color} strokeWidth="1.4"/>
      <path d="M6 13h4M7 11v2M9 11v2" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function UserIcon({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="5" r="3" stroke={color} strokeWidth="1.4"/>
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function FileIcon({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 1.5h7l3 3v10H3V1.5z" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 1.5V4.5H13M5.5 7h5M5.5 10h5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function LinkIcon({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M7 9a4 4 0 005.657-5.657L10.95 1.636A4 4 0 005.293 7.293" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M9 7a4 4 0 00-5.657 5.657l1.707 1.707A4 4 0 0010.707 8.707" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function ChevronIcon({ size = 16, color = "currentColor", dir = "right", className = "" }: { size?: number, color?: string, dir?: "left" | "right", className?: string }) {
  const r = dir === "left" ? "rotate(180 8 8)" : "";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" transform={r} className={className}>
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
