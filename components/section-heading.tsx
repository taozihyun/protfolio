import { VisualBlock } from "@/components/visual-editor";

type SectionHeadingProps = {
  visualId: string;
  index: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  align?: "left" | "right";
};

export function SectionHeading({
  visualId,
  index,
  title,
  titleEn,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <VisualBlock
      as="div"
      visualId={visualId}
      mode="text"
      className={`grid gap-5 border-t border-[var(--line)] pt-4 md:grid-cols-12 ${
        align === "right" ? "text-left md:text-right" : ""
      }`}
    >
      <p className="label md:col-span-2">{index}</p>
      <div className="md:col-span-7">
        <h2 className="display text-[clamp(2.75rem,6vw,6rem)] leading-[0.88]">
          {title}
        </h2>
        {titleEn && (
          <p className="label mt-4 text-[var(--muted)]">{titleEn}</p>
        )}
      </div>
      {subtitle && (
        <p className="label max-w-sm self-end text-[var(--muted)] md:col-span-3">
          {subtitle}
        </p>
      )}
    </VisualBlock>
  );
}
