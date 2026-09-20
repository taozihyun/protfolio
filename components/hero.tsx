"use client";

import { ArrowDown, Download } from "lucide-react";
import { EditableText } from "@/components/editable-text";
import { ZoomableImage } from "@/components/image-lightbox";
import { Reveal } from "@/components/reveal";
import { useResumeData } from "@/components/resume-editor";
import { VisualBlock } from "@/components/visual-editor";

export function Hero() {
  const { data } = useResumeData();
  const { heroMetrics, profile } = data;

  return (
    <VisualBlock
      as="section"
      id="home"
      visualId="section-home"
      mode="section"
      className="overflow-hidden bg-[var(--paper)]"
    >
      <div className="shell">
        <div className="grid min-h-[calc(100svh-76px)] grid-cols-1 border-x border-[var(--line)] lg:grid-cols-12">
          <VisualBlock
            as="div"
            visualId="hero-photo"
            mode="image"
            className="relative min-h-[560px] border-b border-[var(--line)] bg-[var(--paper-soft)] p-5 lg:order-1 lg:col-span-5 lg:min-h-0 lg:border-b-0 lg:border-r lg:p-8"
          >
            <ZoomableImage
              src={profile.lifePhoto}
              alt="郭耀薇生活照"
              caption="郭耀薇 / Aria"
              className="aspect-[3/4] w-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
              path={["profile", "lifePhoto"]}
              visualId="hero-life-photo"
            />
          </VisualBlock>

          <VisualBlock
            as="div"
            visualId="hero-profile"
            mode="text"
            className="flex flex-col justify-between px-5 py-7 lg:order-2 lg:col-span-7 lg:px-8 lg:py-10"
          >
            <div className="flex items-start justify-between gap-6">
              <p className="label">
                2026 / 个人简历
                <br />
                <EditableText path={["profile", "roleEn"]} />
              </p>
              <span className="hidden size-2 rounded-full bg-[var(--accent)] md:block" />
            </div>

            <div className="py-14 lg:py-20">
              <Reveal>
                <h1 className="display text-[clamp(3.75rem,8.5vw,9rem)] leading-[0.9]">
                  <EditableText
                    path={["profile", "name"]}
                    className="inline-block"
                  />
                  <span className="mx-4 text-[var(--muted)]">/</span>
                  <EditableText
                    path={["profile", "englishName"]}
                    className="inline-block"
                  />
                </h1>
              </Reveal>

              <Reveal delay={80} className="mt-10 lg:mt-14">
                <div className="border-t border-[var(--line)] pt-5">
                  <p className="text-[clamp(1.4rem,2.4vw,2.25rem)] font-medium leading-tight">
                    应聘方向：
                    <EditableText path={["profile", "role"]} />
                  </p>
                </div>
              </Reveal>
            </div>

            <div>
              <ul
                className="mb-8 flex flex-wrap gap-x-5 gap-y-2"
                aria-label="核心关键词"
              >
                {profile.keywords.map((keyword, index) => (
                  <li
                    key={index}
                    className="label flex items-center gap-2 text-[var(--muted)]"
                  >
                    <span className="size-1 bg-[var(--ink)]" />
                    <EditableText
                      path={["profile", "keywords", index]}
                      placeholder="关键词"
                    />
                  </li>
                ))}
              </ul>

              <div className="mb-10 grid grid-cols-2 gap-x-5 gap-y-7">
                {heroMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="border-t border-[var(--line)] pt-3"
                  >
                    <p className="display text-[clamp(2rem,3.2vw,3.4rem)] leading-none">
                      <EditableText
                        path={["heroMetrics", index, "value"]}
                        placeholder="数据"
                      />
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                      <EditableText
                        path={["heroMetrics", index, "label"]}
                        placeholder="数据说明"
                      />
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <a
                  href={profile.resumeHref}
                  download
                  className="focus-ring inline-flex items-center gap-3 bg-[var(--ink)] px-5 py-4 text-[11px] tracking-[0.12em] text-[var(--paper)] transition-opacity hover:opacity-80"
                >
                  <Download size={14} strokeWidth={1.6} aria-hidden="true" />
                  下载简历
                </a>
                <a
                  href="#experience"
                  className="focus-ring group inline-flex items-center gap-3 border-b border-[var(--ink)] py-2 text-[11px] tracking-[0.12em]"
                >
                  查看工作经历
                  <ArrowDown
                    size={14}
                    strokeWidth={1.6}
                    className="transition-transform group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </VisualBlock>
        </div>
      </div>
    </VisualBlock>
  );
}
