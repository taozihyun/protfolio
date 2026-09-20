"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { EditableText } from "@/components/editable-text";
import { ZoomableImage } from "@/components/image-lightbox";
import { Reveal } from "@/components/reveal";
import {
  EditorItemActions,
  useResumeData,
} from "@/components/resume-editor";
import { SectionHeading } from "@/components/section-heading";
import { VisualBlock } from "@/components/visual-editor";

export function ExperienceSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { data, isEditing, addImage } = useResumeData();
  const { experiences } = data;

  return (
    <VisualBlock
      as="section"
      id="experience"
      visualId="section-experience"
      mode="section"
      className="section-pad bg-[var(--ink)] text-[var(--paper)]"
    >
      <div className="shell">
        <SectionHeading
          visualId="experience-heading"
          index="03 / 工作经历"
          title="我的工作经历"
          titleEn="PROFESSIONAL EXPERIENCE"
          subtitle="从订单履约与销售协同，到大客户开发、项目推进与商业结果。"
        />

        <div className="mt-14 lg:mt-20">
          {experiences.map((experience, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={experience.company}>
                <VisualBlock
                  as="article"
                  visualId={`experience-${index}`}
                  mode="section"
                  className="border-t border-white/25"
                >
                  <div className="grid py-8 lg:grid-cols-12 lg:gap-8 lg:py-11">
                    <div className="lg:col-span-1">
                      <p className="label text-white/50">
                        经历 {experience.index}
                      </p>
                    </div>

                    <VisualBlock
                      as="div"
                      visualId={`experience-${index}-summary`}
                      mode="text"
                      className="mt-6 lg:col-span-7 lg:mt-0"
                    >
                      <h3 className="text-[clamp(1.6rem,3vw,2.75rem)] font-medium leading-tight">
                        <EditableText
                          path={["experiences", index, "company"]}
                          placeholder="公司名称"
                        />
                      </h3>
                      <p className="mt-3 text-base text-white/60">
                        <EditableText
                          path={["experiences", index, "role"]}
                          placeholder="职位名称"
                        />
                      </p>
                      <div className="mt-5">
                        <EditorItemActions
                          section="experiences"
                          index={index}
                          count={experiences.length}
                        />
                      </div>
                    </VisualBlock>

                    <VisualBlock
                      as="div"
                      visualId={`experience-${index}-metrics`}
                      mode="text"
                      className="mt-8 flex flex-col justify-between lg:col-span-4 lg:mt-0"
                    >
                      <EditableText
                        as="p"
                        className="label lg:text-right"
                        path={["experiences", index, "period"]}
                        placeholder="工作时间"
                      />
                      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 lg:mt-0">
                        {experience.metrics.map((metric, metricIndex) => (
                          <div
                            key={metricIndex}
                            className="border-t border-white/25 pt-3"
                          >
                            <p className="display text-[clamp(2rem,3vw,3.25rem)] leading-none">
                              <EditableText
                                path={[
                                  "experiences",
                                  index,
                                  "metrics",
                                  metricIndex,
                                  "value",
                                ]}
                                placeholder="数据"
                              />
                            </p>
                            <p className="label mt-3 text-white/45">
                              <EditableText
                                path={[
                                  "experiences",
                                  index,
                                  "metrics",
                                  metricIndex,
                                  "label",
                                ]}
                                placeholder="数据说明"
                              />
                            </p>
                          </div>
                        ))}
                      </div>
                    </VisualBlock>
                  </div>

                  {experience.images && experience.images.length > 0 ? (
                    <VisualBlock
                      as="div"
                      visualId={`experience-${index}-gallery`}
                      mode="grid"
                      className="grid gap-3 border-t border-white/15 py-6 lg:grid-cols-12"
                    >
                      <ZoomableImage
                        src={experience.images[0].src}
                        alt={experience.images[0].alt}
                        caption={experience.images[0].caption}
                        className="aspect-[16/9] w-full lg:col-span-7"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        path={["experiences", index, "images", 0]}
                        visualId={`experience-${index}-image-0`}
                        defaultObjectFit={index === 0 ? "contain" : "cover"}
                        captionPath={[
                          "experiences",
                          index,
                          "images",
                          0,
                          "caption",
                        ]}
                      />
                      <div className="grid grid-cols-3 gap-3 lg:col-span-5">
                        {experience.images.slice(1).map((image, imageIndex) => (
                          <ZoomableImage
                            key={imageIndex}
                            src={image.src}
                            alt={image.alt}
                            caption={image.caption}
                            className="aspect-[4/5] w-full"
                            sizes="(max-width: 1024px) 32vw, 14vw"
                            path={[
                              "experiences",
                              index,
                              "images",
                              imageIndex + 1,
                            ]}
                            visualId={`experience-${index}-image-${
                              imageIndex + 1
                            }`}
                            defaultObjectFit="cover"
                            captionPath={[
                              "experiences",
                              index,
                              "images",
                              imageIndex + 1,
                              "caption",
                            ]}
                          />
                        ))}
                      </div>
                    </VisualBlock>
                  ) : (
                    <div className="grid min-h-40 place-items-center border-t border-white/15">
                      {isEditing && (
                        <button
                          type="button"
                          className="focus-ring border border-white/40 px-4 py-3 text-xs"
                          onClick={() =>
                            addImage([
                              "experiences",
                              index,
                              "images",
                            ])
                          }
                        >
                          添加工作图片
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-6 border-t border-white/15 py-5 md:flex-row md:items-center md:justify-between">
                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {experience.keywords.map((keyword, keywordIndex) => (
                        <li
                          key={keywordIndex}
                          className="label flex items-center gap-2 text-white/45"
                        >
                          <span className="size-1 bg-white/45" />
                          <EditableText
                            path={[
                              "experiences",
                              index,
                              "keywords",
                              keywordIndex,
                            ]}
                            placeholder="核心能力"
                          />
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="focus-ring group flex shrink-0 items-center gap-4 self-start border-b border-white py-2 text-[11px] tracking-[0.12em] md:self-auto"
                      aria-expanded={isOpen}
                      aria-controls={`experience-details-${index}`}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      {isOpen ? "收起详情" : "查看详情"}
                      <Plus
                        size={16}
                        strokeWidth={1.4}
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div
                    id={`experience-details-${index}`}
                    className={`experience-details ${isOpen ? "is-open" : ""}`}
                  >
                    <div>
                      <div className="border-t border-white/25 pb-8 pt-8 lg:pb-12 lg:pt-12">
                        <div className="grid gap-6 border-b border-white/12 pb-8 md:grid-cols-12 md:gap-8">
                          <p className="label text-white/40 md:col-span-2">
                            经历概览
                          </p>
                          <div className="md:col-span-10">
                            <p className="max-w-3xl text-sm leading-7 text-white/70">
                              <EditableText
                                as="p"
                                path={["experiences", index, "summary"]}
                                multiline
                                placeholder="工作内容摘要"
                              />
                            </p>
                            {experience.clients && (
                              <div className="mt-7">
                                <p className="label mb-3 text-white/40">
                                  核心客户
                                </p>
                                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                                  {experience.clients.map((client, clientIndex) => (
                                    <li
                                      key={clientIndex}
                                      className="border-b border-white/25 pb-1 text-sm"
                                    >
                                      <EditableText
                                        path={[
                                          "experiences",
                                          index,
                                          "clients",
                                          clientIndex,
                                        ]}
                                        placeholder="客户名称"
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        {experience.groups.map((group, groupIndex) => (
                          <div
                            key={groupIndex}
                            className="grid gap-4 border-b border-white/12 py-8 last:border-b-0 md:grid-cols-12 md:gap-8"
                          >
                            <div className="md:col-span-2">
                              <p className="label text-white/40">
                                {group.label} /{" "}
                                {String(groupIndex + 1).padStart(2, "0")}
                              </p>
                            </div>
                            <div className="md:col-span-4">
                              <h4 className="text-xl leading-snug">
                                <EditableText
                                  path={[
                                    "experiences",
                                    index,
                                    "groups",
                                    groupIndex,
                                    "title",
                                  ]}
                                  placeholder="内容标题"
                                />
                              </h4>
                            </div>
                            <ul className="space-y-3 md:col-span-6">
                              {group.points.map((point, pointIndex) => (
                                <li
                                  key={pointIndex}
                                  className="flex gap-3 text-sm leading-7 text-white/70"
                                >
                                  <span className="mt-3 h-px w-4 shrink-0 bg-white/45" />
                                  <EditableText
                                    path={[
                                      "experiences",
                                      index,
                                      "groups",
                                      groupIndex,
                                      "points",
                                      pointIndex,
                                    ]}
                                    multiline
                                    placeholder="具体内容"
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </VisualBlock>
              </Reveal>
            );
          })}
          <div className="border-t border-white/25" />
        </div>
      </div>
    </VisualBlock>
  );
}
