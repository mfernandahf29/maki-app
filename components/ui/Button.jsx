export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "w-full py-4 rounded-xl font-headline-md text-headline-md transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary:
      "bg-secondary-container text-on-secondary-container shadow-[0_4px_0_#d9922e] hover:shadow-[0_2px_0_#d9922e] hover:translate-y-[2px] hover:scale-[1.02] active:scale-95",
    secondary:
      "bg-primary text-on-primary shadow-sm hover:bg-primary-container active:scale-95",
    ghost:
      "bg-transparent text-on-surface-variant hover:bg-surface-variant/50",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
