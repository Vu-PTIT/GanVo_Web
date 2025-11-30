import './hobby.css';

interface HobbyProps {
  text: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function Hobby({ text, onClick, selected = false, className = '' }: HobbyProps) {
  return (
    <span 
      className={`hobby ${selected ? 'hobby-selected' : ''} ${className}`}
      onClick={onClick}
    >
      {text}
    </span>
  );
}