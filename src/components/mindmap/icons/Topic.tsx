import { LucideProps } from 'lucide-react';

export function Topic(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
