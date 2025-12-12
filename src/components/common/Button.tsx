interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export default function Button({ children, onClick, className, type = "button" }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-opacity-90 text-white transition ${className}`}
    >
      {children}
    </button>
  );
}
