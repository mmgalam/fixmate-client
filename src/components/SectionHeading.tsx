type Props = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "mb-10",
}: Props) {
  return (
    <div
      className={`max-w-2xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      <h2
        style={{ fontFamily: "var(--font-display)" }}
        className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
