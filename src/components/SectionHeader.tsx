interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  live?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = false, live = false }: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3 justify-center">
        {live && (
          <span className="w-3 h-3 rounded-full bg-bv-blue animate-pulse-dot" />
        )}
        {title}
      </h2>
      {subtitle && (
        <p className="text-bv-text-secondary text-base md:text-lg mt-3 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
