"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { EditableText } from "@/components/editable-text";
import { ZoomableImage } from "@/components/image-lightbox";
import { Reveal } from "@/components/reveal";
import { useResumeData } from "@/components/resume-editor";
import { SectionHeading } from "@/components/section-heading";
import { VisualBlock } from "@/components/visual-editor";

export function EducationSection() {
  const [open, setOpen] = useState(false);
  const { data } = useResumeData();
  const { education } = data;

  return (
    <VisualBlock
      as="section"
      id="education"
      visualId="section-education"
      mode="section"
      className="section-pad bg-[var(--paper)]"
    >
      <div className="shell">
        <SectionHeading
          visualId="education-heading"
          index="02 / 教育背景"
          title="教育背景"
          titleEn="EDUCATION"
        />

        <Reveal className="mt-14">
          <div className="grid border-y border-[var(--line)] lg:grid-cols-12">
            <VisualBlock
              as="div"
              visualId="education-portrait-panel"
              mode="image"
              className="border-b border-[var(--line)] py-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:py-16 lg:pr-10"
            >
              <ZoomableImage
                src={education.portrait}
                alt={education.portraitAlt}
                caption="郭耀薇 / Aria"
                className="aspect-[4/5] w-full"
                sizes="(max-width: 1024px) 100vw, 38vw"
                path={["education", "portrait"]}
                visualId="education-portrait"
              />
            </VisualBlock>

            <VisualBlock
              as="div"
              visualId="education-content"
              mode="text"
              className="py-10 lg:col-span-7 lg:pl-10 lg:py-16"
            >
              <p className="label text-[var(--muted)]">
                <EditableText path={["education", "graduation"]} /> / 毕业
              </p>
              <h3 className="display mt-5 text-[clamp(2.75rem,5vw,5rem)] leading-[0.9]">
                <EditableText path={["education", "school"]} />
              </h3>
              <div className="mt-8 space-y-2 text-base leading-relaxed">
                <EditableText
                  as="p"
                  path={["education", "degree"]}
                  placeholder="学历"
                />
                <EditableText
                  as="p"
                  className="text-[var(--muted)]"
                  path={["education", "direction"]}
                  placeholder="专业方向"
                />
              </div>
              <div className="grid grid-cols-2 border-b border-[var(--line)]">
                <div className="border-r border-[var(--line)] py-7 lg:py-10 lg:pr-8">
                  <p className="display text-5xl leading-none lg:text-7xl">
                    <EditableText
                      path={["education", "gpa"]}
                      placeholder="GPA"
                    />
                  </p>
                  <p className="label mt-4 text-[var(--muted)]">
                    学业 GPA
                  </p>
                </div>
                <div className="py-7 pl-6 lg:py-10 lg:pl-8">
                  <p className="display text-5xl leading-none lg:text-7xl">
                    <EditableText
                      path={["education", "ranking"]}
                      placeholder="排名"
                    />
                  </p>
                  <p className="label mt-4 text-[var(--muted)]">
                    专业排名
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="focus-ring group flex w-full items-center justify-between gap-6 border-b border-[var(--line)] py-6 text-left"
                aria-expanded={open}
                aria-controls="academic-highlights"
                onClick={() => setOpen((value) => !value)}
              >
                <span className="text-sm tracking-[0.08em]">
                  展开学业经历
                </span>
                <span className="flex items-center gap-3">
                  <span className="label hidden text-[var(--muted)] sm:inline">
                    {open ? "收起" : "ACADEMIC HIGHLIGHTS"}
                  </span>
                  <Plus
                    size={18}
                    strokeWidth={1.4}
                    className={`transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>

              <div
                id="academic-highlights"
                className={`overflow-hidden transition-[max-height,opacity] duration-500 ${
                  open ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid gap-8 border-b border-[var(--line)] py-8 md:grid-cols-3">
                  <div>
                    <p className="label text-[var(--muted)]">专业排名</p>
                    <EditableText
                      as="p"
                      className="mt-3 text-lg"
                      path={["education", "ranking"]}
                    />
                  </div>
                  <div>
                    <p className="label text-[var(--muted)]">奖学金</p>
                    <EditableText
                      as="p"
                      className="mt-3 text-lg"
                      path={["education", "scholarship"]}
                    />
                  </div>
                  <div>
                    <p className="label text-[var(--muted)]">专业方向</p>
                    <p className="mt-3 text-lg">市场营销方向</p>
                  </div>
                </div>

                <div className="border-b border-[var(--line)] py-8">
                  <p className="label mb-5 text-[var(--muted)]">
                    主修课程
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {education.courses.map((course, index) => (
                      <li
                        key={index}
                        className="border border-[var(--line)] px-4 py-2 text-sm"
                      >
                        <EditableText
                          path={["education", "courses", index]}
                          placeholder="课程"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </VisualBlock>
          </div>
        </Reveal>

        <div className="mt-8 flex justify-end">
          <a
            href="#experience"
            className="focus-ring group inline-flex items-center gap-2 text-xs tracking-[0.1em]"
          >
            下一节 / 工作经历
            <ArrowUpRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </VisualBlock>
  );
}
