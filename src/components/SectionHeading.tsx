type Props = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
}: Props) {
  return (
    <div
      className={`mb-10 max-w-2xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      <h2
        style={{ fontFamily: "var(--font-display)" }}
        className="text-3xl font-black tracking-tight text-slate-950 dark:text-white"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
