interface ChristianCrossProps {
  className?: string;
  size?: number;
}

export default function ChristianCross({ className = "", size = 40 }: ChristianCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 32"
      className={className}
    >
      {/* Traditional Christian cross shape as one continuous path */}
      <path
        d="M 10 2 L 14 2 L 14 8 L 20 8 L 20 12 L 14 12 L 14 30 L 10 30 L 10 12 L 4 12 L 4 8 L 10 8 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}