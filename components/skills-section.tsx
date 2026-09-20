"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { EditableText } from "@/components/editable-text";
import { Reveal } from "@/components/reveal";
import { useResumeData } from "@/components/resume-editor";
import { SectionHeading } from "@/components/section-heading";
import { VisualBlock } from "@/components/visual-editor";

export function SkillsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { data, isEditing } = useResumeData();
  const { skills, tools } = data;

  return (
    <VisualBlock
      as="section"
      id="skills"
      visualId="section-skills"
      mode="section"
      className="section-pad bg-[var(--ink)] text-[var(--paper)]"
    >
      <div className="shell">
        <SectionHeading
          visualId="skills-heading"
          index="05 / 能力结构"
          title="个人技能"
          titleEn="SKILLS"
        />

        <div className="mt-14 border-b border-white/25 lg:mt-20">
          {skills.map((skill, index) => {
            const open = openIndex === index;
            return (
              <Reveal key={skill.index}>
                <VisualBlock
                  as="article"
                  visualId={`skill-${index}`}
                  mode="section"
                  className="border-t border-white/25"
                >
                  <div className="grid w-full gap-4 py-7 text-left md:grid-cols-12 md:items-center md:gap-8 md:py-9">
                    <span className="label text-white/40 md:col-span-1">
                      {skill.index}
                    </span>
                    <span className="md:col-span-9">
                      {isEditing ? (
                        <EditableText
                          as="span"
                          className="display block text-[clamp(2.2rem,4vw,4.5rem)] leading-[0.92]"
                          path={["skills", index, "title"]}
                          placeholder="能力名称"
                        />
                      ) : (
                        <button
                          type="button"
                          className="focus-ring display block text-left text-[clamp(2.2rem,4vw,4.5rem)] leading-[0.92]"
                          onClick={() => setOpenIndex(open ? null : index)}
                        >
                          {skill.title}
                        </button>
                      )}
                      <span className="label mt-3 block text-white/40">
                        {isEditing ? (
                          <EditableText
                            path={["skills", index, "shortTitle"]}
                            placeholder="英文辅助标题"
                          />
                        ) : (
                          skill.shortTitle
                        )}
                      </span>
                    </span>
                    <span className="flex items-center justify-between md:col-span-2 md:justify-end">
                      <button
                        type="button"
                        className="focus-ring grid size-11 place-items-center"
                        aria-label={open ? "收起能力详情" : "展开能力详情"}
                        aria-expanded={open}
                        aria-controls={`skill-detail-${index}`}
                        onClick={() => setOpenIndex(open ? null : index)}
                      >
                      <Plus
                        size={20}
                        strokeWidth={1.4}
                        className={`transition-transform duration-300 ${
                          open ? "rotate-45" : ""
                        }`}
                        aria-hidden="true"
                      />
                      </button>
                    </span>
                  </div>

                  <div
                    id={`skill-detail-${index}`}
                    className={`overflow-hidden transition-[max-height,opacity] duration-500 ${
                      open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="grid gap-10 border-t border-white/15 py-9 md:grid-cols-12 md:gap-8">
                      <div className={skill.how.length > 0 ? "md:col-span-4" : "md:col-span-12"}>
                        <p className="label mb-5 text-white/40">
                          做什么 / WHAT I DO
                        </p>
                        <ul className="space-y-3">
                          {skill.what.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-sm leading-6 text-white/75">
                              <EditableText
                                path={[
                                  "skills",
                                  index,
                                  "what",
                                  itemIndex,
                                ]}
                                multiline
                                placeholder="做什么"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                      {skill.how.length > 0 && (
                        <div className="md:col-span-4">
                          <p className="label mb-5 text-white/40">
                            怎么做 / HOW I WORK
                          </p>
                          <ul className="space-y-3">
                            {skill.how.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="text-sm leading-6 text-white/75"
                              >
                                <EditableText
                                  path={[
                                    "skills",
                                    index,
                                    "how",
                                    itemIndex,
                                  ]}
                                  multiline
                                  placeholder="怎么做"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {skill.evidence.length > 0 && (
                        <div className="md:col-span-4">
                          <p className="label mb-5 text-white/40">
                            结果依据 / EVIDENCE
                          </p>
                          <ul className="space-y-3">
                            {skill.evidence.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="border-b border-white/20 pb-3 text-base text-white"
                              >
                                <EditableText
                                  path={[
                                    "skills",
                                    index,
                                    "evidence",
                                    itemIndex,
                                  ]}
                                  multiline
                                  placeholder="结果依据"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </VisualBlock>
              </Reveal>
            );
          })}

          {tools.length > 0 && (
          <Reveal>
            <div className="grid gap-8 border-t border-white/25 py-12 md:grid-cols-12">
              <div className="md:col-span-2">
                <p className="label text-white/45">
                  工具与资质 / TOOLS & CREDENTIALS
                </p>
              </div>
              <ul className="flex flex-wrap gap-2 md:col-span-10">
                {tools.map((tool, index) => (
                  <li
                    key={index}
                    className="border border-white/25 px-4 py-2 text-xs text-white/70"
                  >
                    <EditableText
                      path={["tools", index]}
                      placeholder="工具与资质"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          )}
        </div>
      </div>
    </VisualBlock>
  );
}
