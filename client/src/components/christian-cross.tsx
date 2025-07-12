interface ChristianCrossProps {
  className?: string;
  size?: number;
}

export default function ChristianCross({ className = "", size = 48 }: ChristianCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 36"
      className={className}
    >
      {/* Traditional Christian cross shape as one continuous path with taller top */}
      <path
        d="M 10 1 L 14 1 L 14 10 L 20 10 L 20 14 L 14 14 L 14 34 L 10 34 L 10 14 L 4 14 L 4 10 L 10 10 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}