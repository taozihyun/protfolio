"use client";

import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EditableText } from "@/components/editable-text";
import { ZoomableImage } from "@/components/image-lightbox";
import { Reveal } from "@/components/reveal";
import {
  EditorItemActions,
  useResumeData,
  type EditorPath,
} from "@/components/resume-editor";
import { SectionHeading } from "@/components/section-heading";
import { VisualBlock } from "@/components/visual-editor";

export function ProjectShowcase() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(
    null,
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { data, isEditing, addImage } = useResumeData();
  const { otherWorkGroups, projects } = data;
  const selectedProject =
    selectedProjectIndex == null ? null : projects[selectedProjectIndex] ?? null;

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProjectIndex(null);
      if (event.key !== "Tab") return;

      const dialog = document.querySelector("aside[role='dialog']");
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [selectedProject]);

  return (
    <>
      <VisualBlock
        as="section"
        id="projects"
        visualId="section-projects"
        mode="section"
        className="section-pad bg-[var(--paper)]"
      >
        <div className="shell">
          <SectionHeading
            visualId="projects-heading"
            index="04 / 精选项目"
            title="精选项目"
            titleEn="SELECTED CASE STUDIES"
          />

          <div className="mt-14 border-b border-[var(--line)] lg:mt-20">
            {projects.map((project, index) => (
              <Reveal key={index}>
                <VisualBlock
                  as="article"
                  visualId={`project-${index}`}
                  mode="section"
                  className="group relative overflow-hidden border-t border-[var(--line)]"
                >
                  <div className="grid min-h-[520px] lg:grid-cols-12">
                    <VisualBlock
                      as="div"
                      visualId={`project-${index}-content`}
                      mode="text"
                      className="relative z-10 flex flex-col justify-between py-8 lg:col-span-7 lg:py-10 lg:pr-12"
                    >
                      <div className="flex items-start justify-between gap-8">
                        <p className="label text-[var(--muted)]">
                          项目 {project.index}
                        </p>
                        <div className="flex items-center gap-3">
                          <EditorItemActions
                            section="projects"
                            index={index}
                            count={projects.length}
                          />
                          <button
                            type="button"
                            className="focus-ring flex size-12 items-center justify-center rounded-full border border-[var(--line)] transition-colors group-hover:border-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] lg:size-14"
                            aria-label={`查看项目：${project.title}`}
                            onClick={() => setSelectedProjectIndex(index)}
                          >
                            <ArrowUpRight
                              size={19}
                              strokeWidth={1.4}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="py-9">
                        <p className="label mb-5 text-[var(--muted)]">
                          <EditableText
                            path={["projects", index, "eyebrow"]}
                            placeholder="项目分类"
                          />
                        </p>
                        <h3 className="display max-w-4xl text-[clamp(2.3rem,4.5vw,5rem)] leading-[0.96] transition-transform duration-500 ease-out group-hover:translate-x-2">
                          <EditableText
                            path={["projects", index, "title"]}
                            placeholder="项目名称"
                          />
                        </h3>
                        {(project.period || isEditing) && (
                          <p className="label mt-5 text-[var(--muted)]">
                            <EditableText
                              path={["projects", index, "period"]}
                              placeholder="项目时间"
                            />
                          </p>
                        )}
                      </div>

                      <div>
                        {project.images.length > 0 ? (
                          <VisualBlock
                            as="div"
                            visualId={`project-${index}-gallery`}
                            mode="grid"
                            className="grid grid-cols-12 gap-3"
                          >
                            <ZoomableImage
                              src={project.images[0].src}
                              alt={project.images[0].alt}
                              caption={project.images[0].caption}
                              className="aspect-[16/10] w-full col-span-12 md:col-span-7"
                              sizes="(max-width: 1024px) 100vw, 40vw"
                              path={["projects", index, "images", 0]}
                              visualId={`project-${index}-image-0`}
                              defaultObjectFit="contain"
                              captionPath={[
                                "projects",
                                index,
                                "images",
                                0,
                                "caption",
                              ]}
                            />
                            <div className="col-span-12 grid grid-cols-2 gap-3 md:col-span-5 md:grid-cols-1">
                              {project.images
                                .slice(1)
                                .map((image, imageIndex) => (
                                  <ZoomableImage
                                    key={imageIndex}
                                    src={image.src}
                                    alt={image.alt}
                                    caption={image.caption}
                                    className="aspect-[4/3] w-full md:aspect-[16/9]"
                                    sizes="(max-width: 1024px) 44vw, 16vw"
                                    path={[
                                      "projects",
                                      index,
                                      "images",
                                      imageIndex + 1,
                                    ]}
                                    visualId={`project-${index}-image-${
                                      imageIndex + 1
                                    }`}
                                    defaultObjectFit="contain"
                                    captionPath={[
                                      "projects",
                                      index,
                                      "images",
                                      imageIndex + 1,
                                      "caption",
                                    ]}
                                  />
                                ))}
                            </div>
                          </VisualBlock>
                        ) : isEditing ? (
                          <div className="grid min-h-48 place-items-center border border-dashed border-[var(--line)]">
                            <button
                              type="button"
                              className="focus-ring border border-[var(--ink)] px-4 py-3 text-xs"
                              onClick={() =>
                                addImage(["projects", index, "images"])
                              }
                            >
                              添加项目图片
                            </button>
                          </div>
                        ) : null}
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                          {project.keywords.map((keyword, keywordIndex) => (
                            <span
                              key={keywordIndex}
                              className="label text-[var(--muted)]"
                            >
                              <EditableText
                                path={[
                                  "projects",
                                  index,
                                  "keywords",
                                  keywordIndex,
                                ]}
                                placeholder="项目关键词"
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    </VisualBlock>

                    <VisualBlock
                      as="div"
                      visualId={`project-${index}-results`}
                      mode="text"
                      className="relative flex flex-col justify-between border-t border-[var(--line)] py-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:py-10 lg:pl-12"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute right-0 top-0 hidden h-full w-px bg-[var(--line)] lg:block"
                      />
                      <p className="label text-[var(--muted)]">项目结果</p>
                      <ul className="my-12 space-y-4">
                        {project.resultSummary.map((item, resultIndex) => (
                          <li
                            key={resultIndex}
                            className="border-b border-[var(--line)] pb-4 text-lg lg:text-xl"
                          >
                            <EditableText
                              path={[
                                "projects",
                                index,
                                "resultSummary",
                                resultIndex,
                              ]}
                              placeholder="项目结果"
                            />
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="focus-ring flex items-center justify-between border-b border-[var(--ink)] py-3 text-left text-[11px] tracking-[0.12em]"
                        onClick={() => setSelectedProjectIndex(index)}
                      >
                        查看完整案例
                        <ArrowRight
                          size={16}
                          strokeWidth={1.5}
                          className="transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </button>
                    </VisualBlock>
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-20 select-none font-[var(--display)] text-[16rem] leading-none text-[var(--ink)]/[0.025] transition-transform duration-700 group-hover:translate-x-4"
                  >
                    {project.index}
                  </div>

                  {index === 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-[66.666%] hidden w-px bg-[var(--line)] lg:block"
                    />
                  )}
                </VisualBlock>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 lg:mt-28">
            <div className="grid gap-5 border-t border-[var(--line)] pt-4 md:grid-cols-12">
              <p className="label md:col-span-2">其他工作 / OTHER WORK</p>
              <div className="md:col-span-7">
                <h3 className="display text-[clamp(2.75rem,5vw,5.5rem)] leading-[0.94]">
                  其他工作
                </h3>
              </div>
              <p className="max-w-sm self-end text-sm leading-7 text-[var(--muted)] md:col-span-3">
                展会、产品内容、客户沟通与海外社媒内容沉淀。
              </p>
            </div>

            <div className="mt-12">
{otherWorkGroups.map((group, groupIndex) => (
  <Reveal key={groupIndex}>
    <VisualBlock
      as="section"
      visualId={`other-work-${groupIndex}`}
      mode="section"
      className="border-t border-[var(--line)] py-10 lg:py-14"
    >
      {group.title === "产品内容与展示" ? (
        /* ==================== 产品内容与展示 ==================== */
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">

          {/* 左侧 2/3：文字 + 第1张/第4张 */}
          <div className="lg:col-span-2">

            {/* 文字 */}
            <div>
              <p className="label text-[var(--muted)]">
                {String(groupIndex + 1).padStart(2, "0")}
              </p>

              <h4 className="mt-4 text-2xl leading-tight">
                <EditableText
                  path={["otherWorkGroups", groupIndex, "title"]}
                  placeholder="其他工作标题"
                />
              </h4>

              <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--muted)]">
                <EditableText
                  path={["otherWorkGroups", groupIndex, "caption"]}
                  multiline
                  placeholder="其他工作说明"
                />
              </p>

              <div className="mt-5">
                <EditorItemActions
                  section="otherWorkGroups"
                  index={groupIndex}
                  count={otherWorkGroups.length}
                />
              </div>
            </div>

            {/* 第1张 + 第4张：在文字下面 */}
            <div className="mt-6 grid grid-cols-2 gap-3">

              {/* 第1张 */}
              <ZoomableImage
                src={group.images[0].src}
                alt={group.images[0].alt}
                caption={group.images[0].caption}
                className="h-[150px] w-full sm:h-[170px] lg:h-[190px]"
                sizes="(max-width: 768px) 50vw, 33vw"
                path={[
                  "otherWorkGroups",
                  groupIndex,
                  "images",
                  0,
                ]}
                visualId={`other-work-${groupIndex}-image-0`}
                defaultObjectFit="contain"
                captionPath={[
                  "otherWorkGroups",
                  groupIndex,
                  "images",
                  0,
                  "caption",
                ]}
              />

              {/* 第4张 */}
              <ZoomableImage
                src={group.images[3].src}
                alt={group.images[3].alt}
                caption={group.images[3].caption}
                className="h-[150px] w-full sm:h-[170px] lg:h-[190px]"
                sizes="(max-width: 768px) 50vw, 33vw"
                path={[
                  "otherWorkGroups",
                  groupIndex,
                  "images",
                  3,
                ]}
                visualId={`other-work-${groupIndex}-image-3`}
                defaultObjectFit="contain"
                captionPath={[
                  "otherWorkGroups",
                  groupIndex,
                  "images",
                  3,
                  "caption",
                ]}
              />

            </div>
          </div>

          {/* 右侧 1/3：第2张 + 第3张上下排列 */}
          <div className="grid grid-rows-2 gap-3 lg:col-span-1">

            {/* 第2张：产品细节 */}
            <ZoomableImage
              src={group.images[1].src}
              alt={group.images[1].alt}
              caption={group.images[1].caption}
              className="h-[150px] w-full sm:h-[170px] lg:h-[190px]"
              sizes="(max-width: 768px) 50vw, 33vw"
              path={[
                "otherWorkGroups",
                groupIndex,
                "images",
                1,
              ]}
              visualId={`other-work-${groupIndex}-image-1`}
              defaultObjectFit="contain"
              captionPath={[
                "otherWorkGroups",
                groupIndex,
                "images",
                1,
                "caption",
              ]}
            />

            {/* 第3张：材质包装说明 */}
            <ZoomableImage
              src={group.images[2].src}
              alt={group.images[2].alt}
              caption={group.images[2].caption}
              className="h-[150px] w-full sm:h-[170px] lg:h-[190px]"
              sizes="(max-width: 768px) 50vw, 33vw"
              path={[
                "otherWorkGroups",
                groupIndex,
                "images",
                2,
              ]}
              visualId={`other-work-${groupIndex}-image-2`}
              defaultObjectFit="contain"
              captionPath={[
                "otherWorkGroups",
                groupIndex,
                "images",
                2,
                "caption",
              ]}
            />

          </div>
        </div>

      ) : (

  /* ==================== 展会与客户沟通 / 海外社媒内容 ==================== */
  <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">

    {/* 左侧文字 */}
    <div className="lg:col-span-4">
      <p className="label text-[var(--muted)]">
        {String(groupIndex + 1).padStart(2, "0")}
      </p>

      <h4 className="mt-4 text-2xl leading-tight">
        <EditableText
          path={["otherWorkGroups", groupIndex, "title"]}
          placeholder="其他工作标题"
        />
      </h4>

      <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--muted)]">
        <EditableText
          path={["otherWorkGroups", groupIndex, "caption"]}
          multiline
          placeholder="其他工作说明"
        />
      </p>

      <div className="mt-5">
        <EditorItemActions
          section="otherWorkGroups"
          index={groupIndex}
          count={otherWorkGroups.length}
        />
      </div>
    </div>

    {/* ==================== 4张图 ==================== */}
    {group.images.length === 4 ? (
      <div className="lg:col-span-8 grid grid-cols-2 gap-3">

        {group.images.map((image, imageIndex) => (
          <ZoomableImage
            key={imageIndex}
            src={image.src}
            alt={image.alt}
            caption={image.caption}
            className="h-[150px] w-full sm:h-[170px] lg:h-[190px]"
            imageClassName="!object-contain"
            sizes="(max-width: 768px) 50vw, 33vw"
            path={[
              "otherWorkGroups",
              groupIndex,
              "images",
              imageIndex,
            ]}
            visualId={`other-work-${groupIndex}-image-${imageIndex}`}
            defaultObjectFit="contain"
            captionPath={[
              "otherWorkGroups",
              groupIndex,
              "images",
              imageIndex,
              "caption",
            ]}
          />
        ))}

      </div>
    ) : (

      /* ==================== 5张图：海外社媒内容 ==================== */
      <div className="lg:col-span-8 grid grid-cols-12 gap-3">

        {/* 第一行：图片1 */}
        <ZoomableImage
          src={group.images[0].src}
          alt={group.images[0].alt}
          caption={group.images[0].caption}
          className="col-span-6 h-[150px] w-full sm:h-[170px] lg:h-[190px]"
          imageClassName="!object-contain"
          sizes="(max-width: 768px) 50vw, 33vw"
          path={[
            "otherWorkGroups",
            groupIndex,
            "images",
            0,
          ]}
          visualId={`other-work-${groupIndex}-image-0`}
          defaultObjectFit="contain"
          captionPath={[
            "otherWorkGroups",
            groupIndex,
            "images",
            0,
            "caption",
          ]}
        />

        {/* 第一行：图片2 */}
        <ZoomableImage
          src={group.images[1].src}
          alt={group.images[1].alt}
          caption={group.images[1].caption}
          className="col-span-6 h-[150px] w-full sm:h-[170px] lg:h-[190px]"
          imageClassName="!object-contain"
          sizes="(max-width: 768px) 50vw, 33vw"
          path={[
            "otherWorkGroups",
            groupIndex,
            "images",
            1,
          ]}
          visualId={`other-work-${groupIndex}-image-1`}
          defaultObjectFit="contain"
          captionPath={[
            "otherWorkGroups",
            groupIndex,
            "images",
            1,
            "caption",
          ]}
        />

        {/* 第二行：图片3，占1/2 */}
        <ZoomableImage
          src={group.images[2].src}
          alt={group.images[2].alt}
          caption={group.images[2].caption}
          className="col-span-6 h-[150px] w-full sm:h-[170px] lg:h-[190px]"
          imageClassName="!object-contain"
          sizes="(max-width: 768px) 50vw, 50vw"
          path={[
            "otherWorkGroups",
            groupIndex,
            "images",
            2,
          ]}
          visualId={`other-work-${groupIndex}-image-2`}
          defaultObjectFit="contain"
          captionPath={[
            "otherWorkGroups",
            groupIndex,
            "images",
            2,
            "caption",
          ]}
        />

        {/* 第二行：图片4，占1/4 */}
        <ZoomableImage
          src={group.images[3].src}
          alt={group.images[3].alt}
          caption={group.images[3].caption}
          className="col-span-3 h-[150px] w-full sm:h-[170px] lg:h-[190px]"
          imageClassName="!object-contain"
          sizes="(max-width: 768px) 25vw, 25vw"
          path={[
            "otherWorkGroups",
            groupIndex,
            "images",
            3,
          ]}
          visualId={`other-work-${groupIndex}-image-3`}
          defaultObjectFit="contain"
          captionPath={[
            "otherWorkGroups",
            groupIndex,
            "images",
            3,
            "caption",
          ]}
        />

        {/* 第二行：图片5，占1/4 */}
        <ZoomableImage
          src={group.images[4].src}
          alt={group.images[4].alt}
          caption={group.images[4].caption}
          className="col-span-3 h-[150px] w-full sm:h-[170px] lg:h-[190px]"
          imageClassName="!object-contain"
          sizes="(max-width: 768px) 25vw, 25vw"
          path={[
            "otherWorkGroups",
            groupIndex,
            "images",
            4,
          ]}
          visualId={`other-work-${groupIndex}-image-4`}
          defaultObjectFit="contain"
          captionPath={[
            "otherWorkGroups",
            groupIndex,
            "images",
            4,
            "caption",
          ]}
        />

      </div>
    )}
  </div>
)}
    </VisualBlock>
  </Reveal>
))} 
            </div>
          </div>
        </div>
      </VisualBlock>

      {selectedProject && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="backdrop-enter focus-ring absolute inset-0 bg-black/55"
            aria-label="关闭项目详情"
            onClick={() => setSelectedProjectIndex(null)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            className="drawer-enter absolute inset-y-0 right-0 flex w-full flex-col bg-[var(--paper)] shadow-2xl md:max-w-[760px]"
          >
            <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[var(--line)] px-5 md:px-8">
              <p className="label">
                案例 {selectedProject.index} /{" "}
                <EditableText
                  path={[
                    "projects",
                    selectedProjectIndex ?? 0,
                    "eyebrow",
                  ]}
                />
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                className="focus-ring grid size-11 place-items-center border border-[var(--line)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                aria-label="关闭项目详情"
                onClick={() => setSelectedProjectIndex(null)}
              >
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-16 md:px-8">
              <header className="border-b border-[var(--line)] py-10 md:py-14">
                <h2
                  id="project-dialog-title"
                  className="display text-[clamp(3rem,7vw,5.75rem)] leading-[0.9]"
                >
                  <EditableText
                    path={[
                      "projects",
                      selectedProjectIndex ?? 0,
                      "title",
                    ]}
                    placeholder="项目名称"
                  />
                </h2>
                <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                  {selectedProject.keywords.map((keyword, index) => (
                    <li key={index} className="label text-[var(--muted)]">
                      <EditableText
                        path={[
                          "projects",
                          selectedProjectIndex ?? 0,
                          "keywords",
                          index,
                        ]}
                      />
                    </li>
                  ))}
                </ul>
                {(selectedProject.period || isEditing) && (
                  <p className="label mt-6 text-[var(--muted)]">
                    <EditableText
                      path={[
                        "projects",
                        selectedProjectIndex ?? 0,
                        "period",
                      ]}
                      placeholder="项目时间"
                    />
                  </p>
                )}
              </header>

              {selectedProject.images.length > 0 && (
                <section className="grid gap-4 border-b border-[var(--line)] py-8 sm:grid-cols-2">
                  {selectedProject.images.map((image, index) => (
                    <ZoomableImage
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      caption={image.caption}
                      className={`w-full ${
                        index === 0
                          ? "aspect-[4/3] sm:col-span-2"
                          : "aspect-[4/3]"
                      }`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      path={[
                        "projects",
                        selectedProjectIndex ?? 0,
                        "images",
                        index,
                      ]}
                      captionPath={[
                        "projects",
                        selectedProjectIndex ?? 0,
                        "images",
                        index,
                        "caption",
                      ]}
                      visualId={`project-${
                        selectedProjectIndex ?? 0
                      }-drawer-image-${index}`}
                      defaultObjectFit="contain"
                    />
                  ))}
                </section>
              )}

              <CaseBlock index="01" label="项目背景 / CHALLENGE">
                <EditableText
                  as="p"
                  path={[
                    "projects",
                    selectedProjectIndex ?? 0,
                    "challenge",
                  ]}
                  multiline
                  placeholder="项目背景"
                />
              </CaseBlock>

              {selectedProject.insight && (
                <CaseBlock index="02" label="关键洞察 / INSIGHT">
                  <EditableText
                    as="p"
                    path={[
                      "projects",
                      selectedProjectIndex ?? 0,
                      "insight",
                    ]}
                    multiline
                    placeholder="关键洞察"
                  />
                </CaseBlock>
              )}

              <CaseBlock index="03" label="推进方式 / APPROACH">
                <NumberedList
                  items={selectedProject.approach}
                  basePath={[
                    "projects",
                    selectedProjectIndex ?? 0,
                    "approach",
                  ]}
                />
              </CaseBlock>

              {selectedProject.execution.length > 0 && (
                <CaseBlock index="04" label="执行协同 / EXECUTION">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {selectedProject.execution.map((item, index) => (
                      <li
                        key={index}
                        className="border border-[var(--line)] p-4 text-sm leading-6"
                      >
                        <EditableText
                          path={[
                            "projects",
                            selectedProjectIndex ?? 0,
                            "execution",
                            index,
                          ]}
                          multiline
                          placeholder="执行协同"
                        />
                      </li>
                    ))}
                  </ul>
                </CaseBlock>
              )}

              <CaseBlock index="05" label="项目结果 / RESULT">
                <ul className="space-y-4">
                  {selectedProject.result.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-4 border-b border-[var(--line)] pb-4 text-base leading-7"
                    >
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      <EditableText
                        path={[
                          "projects",
                          selectedProjectIndex ?? 0,
                          "result",
                          index,
                        ]}
                        multiline
                        placeholder="项目结果"
                      />
                    </li>
                  ))}
                </ul>
              </CaseBlock>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function CaseBlock({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 border-b border-[var(--line)] py-10 md:grid-cols-12 md:gap-8 md:py-12">
      <div className="md:col-span-3">
        <p className="label text-[var(--muted)]">
          {index} / {label}
        </p>
      </div>
      <div className="text-base leading-8 text-[var(--ink)]/85 md:col-span-9">
        {children}
      </div>
    </section>
  );
}

function NumberedList({
  items,
  basePath,
}: {
  items: string[];
  basePath: EditorPath;
}) {
  return (
    <ol className="space-y-5">
      {items.map((item, index) => (
        <li key={index} className="grid grid-cols-[2rem_1fr] gap-3">
          <span className="label pt-1 text-[var(--muted)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <EditableText
            path={[...basePath, index]}
            multiline
            placeholder="推进方式"
          />
        </li>
      ))}
    </ol>
  );
}
