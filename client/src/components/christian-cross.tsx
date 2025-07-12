interface ChristianCrossProps {
  className?: string;
  size?: number;
}

export default function ChristianCross({ className = "", size = 24 }: ChristianCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 32"
      className={className}
    >
      {/* Traditional Christian cross shape - vertical beam longer than horizontal */}
      <rect
        x="10"
        y="2"
        width="4"
        height="28"
        rx="1"
        fill="#D4AF37"
        stroke="#3B82F6"
        strokeWidth="1"
      />
      <rect
        x="4"
        y="8"
        width="16"
        height="4"
        rx="1"
        fill="#D4AF37"
        stroke="#3B82F6"
        strokeWidth="1"
      />
    </svg>
  );
}