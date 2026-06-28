export default function Card({ children, className = "", animate = false }) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-[28px] p-xl shadow-[0_12px_40px_rgba(0,103,130,0.15)] border-2 border-surface-variant relative overflow-hidden ${
        animate ? "animate-pop-in" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
