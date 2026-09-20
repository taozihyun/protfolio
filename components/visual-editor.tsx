"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Maximize2,
  Move,
  Redo2,
  RotateCcw,
  Undo2,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  useResumeData,
  type VisualMode,
} from "@/components/resume-editor";
import type { VisualStyle } from "@/lib/resume-data";

const DEFAULT_IMAGE_DIMENSIONS: Record<
  string,
  { width: number; height: number }
> = {
  "hero-life-photo": { width: 1620, height: 1080 },
  "education-portrait": { width: 1249, height: 1599 },
  "experience-0-image-0": { width: 3840, height: 2343 },
  "experience-0-image-1": { width: 972, height: 532 },
  "experience-0-image-2": { width: 1290, height: 718 },
  "experience-0-image-3": { width: 3072, height: 4096 },
  "experience-0-image-4": { width: 3072, height: 4096 },
  "experience-0-image-5": { width: 3072, height: 4096 },
  "experience-0-image-6": { width: 892, height: 541 },
  "project-2-image-0": { width: 712, height: 1384 },
  "other-work-0-image-0": { width: 1600, height: 1066 },
  "other-work-0-image-1": { width: 972, height: 532 },
  "other-work-0-image-2": { width: 840, height: 634 },
  "other-work-0-image-3": { width: 1080, height: 1440 },
  "other-work-1-image-0": { width: 3072, height: 4096 },
  "other-work-1-image-1": { width: 1600, height: 1066 },
  "other-work-1-image-2": { width: 1290, height: 708 },
  "other-work-1-image-3": { width: 1290, height: 1899 },
  "other-work-2-image-0": { width: 1290, height: 2457 },
  "other-work-2-image-1": { width: 1290, height: 1915 },
  "other-work-2-image-2": { width: 1290, height: 2110 },
  "other-work-2-image-3": { width: 1290, height: 2484 },
  "other-work-2-image-4": { width: 1290, height: 2015 },
};

export function getDefaultImageDimensions(visualId: string) {
  return DEFAULT_IMAGE_DIMENSIONS[visualId];
}

type VisualBlockProps = {
  visualId: string;
  mode: VisualMode;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export function VisualBlock({
  visualId,
  mode,
  children,
  as,
  className = "",
  style,
  id,
}: VisualBlockProps) {
  const {
    data,
    isEditing,
    selectedVisualId,
    setSelectedVisual,
    updateVisualStyle,
  } = useResumeData();
  const Component = as ?? "div";
  const visualStyle = data.visualStyles[visualId] ?? {};
  const selected = isEditing && selectedVisualId === visualId;
  const hasTextOverride =
    mode === "text" &&
    (visualStyle.fontSize != null ||
      visualStyle.fontWeight != null ||
      visualStyle.lineHeight != null ||
      visualStyle.letterSpacing != null ||
      visualStyle.textAlign != null);

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isEditing) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedVisual(visualId, mode);

    const startX = event.clientX;
    const startY = event.clientY;
    const originX = visualStyle.x ?? 0;
    const originY = visualStyle.y ?? 0;

    const onMove = (moveEvent: PointerEvent) => {
      updateVisualStyle(visualId, {
        x: Math.round(originX + moveEvent.clientX - startX),
        y: Math.round(originY + moveEvent.clientY - startY),
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize = (
    event: ReactPointerEvent<HTMLButtonElement>,
    directionX: -1 | 0 | 1,
    directionY: -1 | 0 | 1,
  ) => {
    if (!isEditing) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedVisual(visualId, mode);

    const element = event.currentTarget.closest(
      "[data-visual-id]",
    ) as HTMLElement | null;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = visualStyle.width ?? rect.width;
    const startHeight = visualStyle.height ?? rect.height;
    const startAspect =
      visualStyle.aspectRatio ??
      (startHeight > 0 ? startWidth / startHeight : 1);

    const onMove = (moveEvent: PointerEvent) => {
      const patch: Partial<VisualStyle> = {};
      const keepAspect =
        mode === "image" &&
        (visualStyle.lockAspect ?? true) &&
        !moveEvent.shiftKey;

      if (directionX !== 0) {
        patch.width = Math.max(
          40,
          Math.round(startWidth + (moveEvent.clientX - startX) * directionX),
        );
      }
      if (directionY !== 0) {
        patch.height = Math.max(
          24,
          Math.round(startHeight + (moveEvent.clientY - startY) * directionY),
        );
      }
      if (keepAspect) {
        const widthDelta =
          directionX !== 0 ? Math.abs((patch.width ?? startWidth) - startWidth) : 0;
        const heightDelta =
          directionY !== 0
            ? Math.abs((patch.height ?? startHeight) - startHeight)
            : 0;
        if (widthDelta >= heightDelta && directionX !== 0) {
          patch.height = Math.max(24, Math.round((patch.width ?? startWidth) / startAspect));
        } else if (directionY !== 0) {
          patch.width = Math.max(40, Math.round((patch.height ?? startHeight) * startAspect));
        }
      }
      updateVisualStyle(visualId, patch);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <Component
      id={id}
      className={`visual-block ${
        hasTextOverride ? "visual-text-override" : ""
      } ${className}`}
      data-visual-id={visualId}
      data-visual-mode={mode}
      style={{ ...style, ...visualStyleToCss(visualStyle) }}
      onClick={(event: React.MouseEvent) => {
        if (isEditing) {
          event.stopPropagation();
          setSelectedVisual(visualId, mode);
        }
      }}
    >
      {children}

      {isEditing && (
        <div
          className={`pointer-events-none absolute inset-0 z-20 border transition-colors ${
            selected
              ? "border-[var(--accent)]"
              : "border-transparent hover:border-[var(--accent)]/55"
          }`}
          aria-hidden="true"
        >
          <button
            type="button"
            className="focus-ring pointer-events-auto absolute -left-px -top-8 inline-flex items-center gap-1.5 bg-[var(--accent)] px-2.5 py-1.5 text-[9px] text-white shadow-sm"
            aria-label="拖动模块"
            onPointerDown={startDrag}
          >
            <Move size={11} strokeWidth={1.6} aria-hidden="true" />
            拖动
          </button>

          {selected && (
            <>
              <ResizeHandle
                className="-right-1.5 -top-1.5 cursor-nesw-resize"
                onPointerDown={(event) => startResize(event, 1, -1)}
              />
              <ResizeHandle
                className="-bottom-1.5 -left-1.5 cursor-nesw-resize"
                onPointerDown={(event) => startResize(event, -1, 1)}
              />
              <ResizeHandle
                className="-bottom-1.5 -right-1.5 cursor-nwse-resize"
                onPointerDown={(event) => startResize(event, 1, 1)}
              />
              <ResizeHandle
                className="-right-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize"
                onPointerDown={(event) => startResize(event, 1, 0)}
              />
              <ResizeHandle
                className="bottom-1/2 -left-1.5 translate-y-1/2 cursor-ew-resize"
                onPointerDown={(event) => startResize(event, -1, 0)}
              />
              <ResizeHandle
                className="-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize"
                onPointerDown={(event) => startResize(event, 0, 1)}
              />
            </>
          )}
        </div>
      )}
    </Component>
  );
}

export function VisualEditorToolbar() {
  const {
    data,
    isEditing,
    selectedVisualId,
    selectedVisualMode,
    setSelectedVisual,
    updateVisualStyle,
    resetVisualStyle,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResumeData();

  if (!isEditing || !selectedVisualId) return null;
  const style = data.visualStyles[selectedVisualId] ?? {};
  const domImage = readNaturalImageDimensions(selectedVisualId);
  const aspectRatio =
    style.aspectRatio ??
    (domImage?.width && domImage.height
      ? domImage.width / domImage.height
      : undefined);

  return (
    <aside
      className="fixed bottom-4 right-4 z-[65] w-[min(92vw,340px)] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] shadow-2xl"
      onPointerDown={(event) => event.stopPropagation()}
      aria-label="视觉编辑工具栏"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-3">
        <div>
          <p className="label">视觉编辑</p>
          <p className="mt-1 max-w-[210px] truncate text-[10px] text-[var(--muted)]">
            {selectedVisualId}
          </p>
        </div>
        <button
          type="button"
          className="focus-ring grid size-8 place-items-center border border-[var(--line)]"
          aria-label="关闭视觉工具栏"
          onClick={() => setSelectedVisual(null)}
        >
          <X size={13} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2">
        <div className="flex gap-1">
          <ToolbarButton
            label="撤销"
            disabled={!canUndo}
            onClick={undo}
            icon={<Undo2 size={12} strokeWidth={1.5} />}
          />
          <ToolbarButton
            label="重做"
            disabled={!canRedo}
            onClick={redo}
            icon={<Redo2 size={12} strokeWidth={1.5} />}
          />
        </div>
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-1.5 border border-[var(--line)] px-2.5 py-2 text-[9px]"
          onClick={() => resetVisualStyle(selectedVisualId)}
        >
          <RotateCcw size={11} strokeWidth={1.5} aria-hidden="true" />
          恢复此模块
        </button>
      </div>

      <div className="max-h-[62vh] overflow-y-auto p-3">
        {selectedVisualMode === "text" && (
          <ToolbarSection title="文字">
            <NumberField
              label="字号"
              value={style.fontSize}
              min={8}
              max={240}
              onChange={(value) =>
                updateVisualStyle(selectedVisualId, { fontSize: value })
              }
            />
            <NumberField
              label="字重"
              value={style.fontWeight}
              min={100}
              max={900}
              step={100}
              onChange={(value) =>
                updateVisualStyle(selectedVisualId, { fontWeight: value })
              }
            />
            <NumberField
              label="行高"
              value={style.lineHeight}
              min={0.7}
              max={3}
              step={0.05}
              onChange={(value) =>
                updateVisualStyle(selectedVisualId, { lineHeight: value })
              }
            />
            <NumberField
              label="字间距"
              value={style.letterSpacing}
              min={-2}
              max={20}
              step={0.5}
              onChange={(value) =>
                updateVisualStyle(selectedVisualId, { letterSpacing: value })
              }
            />
            <div className="col-span-2 flex items-center justify-between">
              <span className="text-[10px] text-[var(--muted)]">对齐</span>
              <div className="flex gap-1">
                {[
                  ["left", AlignLeft],
                  ["center", AlignCenter],
                  ["right", AlignRight],
                ].map(([value, Icon]) => (
                  <button
                    key={value as string}
                    type="button"
                    className={`focus-ring grid size-8 place-items-center border ${
                      style.textAlign === value
                        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                        : "border-[var(--line)]"
                    }`}
                    aria-label={`文本${value}`}
                    onClick={() =>
                      updateVisualStyle(selectedVisualId, {
                        textAlign: value as VisualStyle["textAlign"],
                      })
                    }
                  >
                    <Icon size={12} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </ToolbarSection>
        )}

        {selectedVisualMode === "image" && (
          <ToolbarSection title="图片">
            <label className="col-span-2 flex items-center justify-between gap-3 text-[10px]">
              <span className="text-[var(--muted)]">裁切方式</span>
              <select
                className="focus-ring border border-[var(--line)] bg-[var(--paper)] px-2 py-2"
                value={style.objectFit ?? "cover"}
                onChange={(event) =>
                  updateVisualStyle(selectedVisualId, {
                    objectFit: event.target.value as "cover" | "contain",
                  })
                }
              >
                <option value="cover">填满裁切</option>
                <option value="contain">完整显示</option>
              </select>
            </label>
            <label className="col-span-2 flex items-center justify-between gap-3 text-[10px]">
              <span className="text-[var(--muted)]">焦点位置</span>
              <select
                className="focus-ring border border-[var(--line)] bg-[var(--paper)] px-2 py-2"
                value={style.objectPosition ?? "center"}
                onChange={(event) =>
                  updateVisualStyle(selectedVisualId, {
                    objectPosition: event.target.value,
                  })
                }
              >
                <option value="center">居中</option>
                <option value="top">顶部</option>
                <option value="bottom">底部</option>
                <option value="left">左侧</option>
                <option value="right">右侧</option>
              </select>
            </label>
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="focus-ring inline-flex items-center justify-center gap-2 border border-[var(--line)] py-2 text-[10px]"
                onClick={() => {
                  const naturalWidth = style.naturalWidth ?? domImage?.width ?? 1200;
                  const naturalHeight =
                    style.naturalHeight ?? domImage?.height ?? naturalWidth;
                  const aspect =
                    style.aspectRatio ??
                    (naturalHeight > 0 ? naturalWidth / naturalHeight : 1);
                  const width = Math.min(naturalWidth, 1200);
                  updateVisualStyle(selectedVisualId, {
                    width,
                    height: Math.round(width / aspect),
                    aspectRatio: aspect,
                    objectFit: "contain",
                    lockAspect: true,
                  });
                }}
              >
                <Maximize2 size={12} strokeWidth={1.5} aria-hidden="true" />
                原始尺寸
              </button>
              <button
                type="button"
                className="focus-ring inline-flex items-center justify-center gap-2 border border-[var(--line)] py-2 text-[10px]"
                onClick={() =>
                  updateVisualStyle(selectedVisualId, {
                    width: undefined,
                    height: undefined,
                    objectFit: "contain",
                  })
                }
              >
                适应容器
              </button>
            </div>
            <label className="col-span-2 flex items-center justify-between gap-3 text-[10px]">
              <span className="text-[var(--muted)]">锁定宽高比</span>
              <input
                type="checkbox"
                checked={style.lockAspect ?? true}
                onChange={(event) =>
                  updateVisualStyle(selectedVisualId, {
                    lockAspect: event.target.checked,
                  })
                }
              />
            </label>
          </ToolbarSection>
        )}

        <ToolbarSection title="尺寸与位置">
          <NumberField
            label="X"
            value={style.x}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { x: value })
            }
          />
          <NumberField
            label="Y"
            value={style.y}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { y: value })
            }
          />
          <NumberField
            label="宽度"
            value={style.width}
            min={40}
            onChange={(value) => {
              const keepAspect =
                selectedVisualMode === "image" &&
                (style.lockAspect ?? true) &&
                aspectRatio;
              updateVisualStyle(selectedVisualId, {
                width: value,
                height:
                  keepAspect && value != null && aspectRatio
                    ? Math.round(value / aspectRatio)
                    : style.height,
              });
            }}
          />
          <NumberField
            label="高度"
            value={style.height}
            min={24}
            onChange={(value) => {
              const keepAspect =
                selectedVisualMode === "image" &&
                (style.lockAspect ?? true) &&
                aspectRatio;
              updateVisualStyle(selectedVisualId, {
                height: value,
                width:
                  keepAspect && value != null && aspectRatio
                    ? Math.round(value * aspectRatio)
                    : style.width,
              });
            }}
          />
          <NumberField
            label="最小高度"
            value={style.minHeight}
            min={0}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { minHeight: value })
            }
          />
          <NumberField
            label="模块间距"
            value={style.gap}
            min={0}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { gap: value })
            }
          />
          <NumberField
            label="旋转"
            value={style.rotation}
            min={-360}
            max={360}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { rotation: value })
            }
          />
          <NumberField
            label="层级"
            value={style.zIndex}
            min={0}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { zIndex: value })
            }
          />
        </ToolbarSection>

        <ToolbarSection title="外边距与留白">
          <NumberField
            label="上外边距"
            value={style.marginTop}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { marginTop: value })
            }
          />
          <NumberField
            label="下外边距"
            value={style.marginBottom}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { marginBottom: value })
            }
          />
          <NumberField
            label="上内边距"
            value={style.paddingTop}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { paddingTop: value })
            }
          />
          <NumberField
            label="下内边距"
            value={style.paddingBottom}
            onChange={(value) =>
              updateVisualStyle(selectedVisualId, { paddingBottom: value })
            }
          />
        </ToolbarSection>
      </div>
    </aside>
  );
}

function ResizeHandle({
  className,
  onPointerDown,
}: {
  className: string;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      className={`focus-ring pointer-events-auto absolute size-3 border border-white bg-[var(--accent)] ${className}`}
      aria-label="调整模块大小"
      onPointerDown={onPointerDown}
    />
  );
}

function ToolbarSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-[var(--line)] py-4 last:border-b-0 last:pb-0">
      <p className="label mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-[10px]">
      <span className="text-[var(--muted)]">{label}</span>
      <input
        type="number"
        className="focus-ring w-20 border border-[var(--line)] bg-[var(--paper)] px-2 py-1.5 text-right"
        value={value ?? ""}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "" ? undefined : Number(next));
        }}
      />
    </label>
  );
}

function ToolbarButton({
  label,
  disabled,
  icon,
  onClick,
}: {
  label: string;
  disabled: boolean;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="focus-ring inline-flex items-center gap-1.5 border border-[var(--line)] px-2.5 py-2 text-[9px] disabled:cursor-not-allowed disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function readNaturalImageDimensions(visualId: string) {
  if (typeof document === "undefined") return null;
  const element = document.querySelector<HTMLElement>(
    `[data-visual-id="${CSS.escape(visualId)}"]`,
  );
  const image = element?.querySelector("img");
  if (!image?.naturalWidth || !image.naturalHeight) return null;
  return { width: image.naturalWidth, height: image.naturalHeight };
}

function visualStyleToCss(style: VisualStyle): CSSProperties {
  const transforms = [
    style.x != null || style.y != null
      ? `translate(${style.x ?? 0}px, ${style.y ?? 0}px)`
      : "",
    style.rotation ? `rotate(${style.rotation}deg)` : "",
  ].filter(Boolean);

  return {
    transform: transforms.length > 0 ? transforms.join(" ") : undefined,
    width: style.width != null ? `${style.width}px` : undefined,
    height: style.height != null ? `${style.height}px` : undefined,
    aspectRatio: style.aspectRatio,
    minHeight: style.minHeight != null ? `${style.minHeight}px` : undefined,
    marginTop: style.marginTop != null ? `${style.marginTop}px` : undefined,
    marginBottom:
      style.marginBottom != null ? `${style.marginBottom}px` : undefined,
    paddingTop:
      style.paddingTop != null ? `${style.paddingTop}px` : undefined,
    paddingBottom:
      style.paddingBottom != null ? `${style.paddingBottom}px` : undefined,
    gap: style.gap != null ? `${style.gap}px` : undefined,
    fontSize: style.fontSize != null ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing:
      style.letterSpacing != null ? `${style.letterSpacing}px` : undefined,
    textAlign: style.textAlign,
    opacity: style.opacity,
    borderRadius:
      style.borderRadius != null ? `${style.borderRadius}px` : undefined,
    position: "relative",
    zIndex:
      style.zIndex ??
      (style.x != null || style.y != null || style.height != null ? 5 : undefined),
  };
}
