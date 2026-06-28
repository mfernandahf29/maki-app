export default function Input({
  label,
  icon,
  className = "",
  containerClassName = "",
  size = "md", // "sm" or "md"
  ...props
}) {
  const isSm = size === "sm";
  return (
    <div className={containerClassName}>
      {label && (
        <label className={`block font-label-lg text-label-lg text-on-background ml-1 ${isSm ? "mb-1" : "mb-2"}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            {icon}
          </span>
        )}
        <input
          className={`w-full rounded-xl border-2 border-outline-variant bg-surface font-body-md text-body-md text-on-background placeholder:text-outline focus:border-primary focus:ring-0 focus:shadow-[0_0_0_3px_rgba(0,103,130,0.2)] transition-all outline-none ${
            isSm 
              ? "py-2" 
              : "py-3"
          } ${
            icon ? "pl-12 pr-4" : "px-4"
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
