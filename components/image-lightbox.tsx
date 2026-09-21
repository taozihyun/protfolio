"use client";

import Image from "next/image";
import { Maximize2, Trash2, Upload, X } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useResumeData,
  type EditorPath,
} from "@/components/resume-editor";
import { EditableText } from "@/components/editable-text";
import {
  VisualBlock,
  getDefaultImageDimensions,
} from "@/components/visual-editor";

type ViewerImage = {
  src: string;
  alt: string;
  caption?: string;
};

type LightboxContextValue = {
  openImage: (image: ViewerImage) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function ImageLightboxProvider({ children }: { children: ReactNode }) {
  const [activeImage, setActiveImage] = useState<ViewerImage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeImage) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
      if (event.key !== "Tab") return;

      const dialog = document.querySelector("div[role='dialog']");
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
  }, [activeImage]);

  return (
    <LightboxContext.Provider value={{ openImage: setActiveImage }}>
      {children}
      {activeImage && (
        <div className="fixed inset-0 z-[70] bg-black/92 text-white">
          <button
            type="button"
            className="backdrop-enter focus-ring absolute inset-0 cursor-zoom-out"
            aria-label="关闭高清图片"
            onClick={() => setActiveImage(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.alt}
            className="drawer-enter relative mx-auto flex h-full w-full max-w-[1800px] flex-col px-3 py-3 md:px-8 md:py-6"
          >
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center justify-between gap-6 border-t border-white/25 py-4">
              <p className="text-xs tracking-[0.08em] text-white/65">
                {activeImage.caption ?? activeImage.alt}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                className="focus-ring grid size-11 shrink-0 place-items-center border border-white/40 transition-colors hover:bg-white hover:text-black"
                aria-label="关闭高清图片"
                onClick={() => setActiveImage(null)}
              >
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

type ZoomableImageProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  path?: EditorPath;
  captionPath?: EditorPath;
  visualId?: string;
  defaultObjectFit?: "cover" | "contain";
};

export function ZoomableImage({
  src,
  alt,
  caption,
  className = "",
  imageClassName = "object-contain",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  path,
  captionPath,
  visualId,
  defaultObjectFit = "contain",
}: ZoomableImageProps) {
  const context = useContext(LightboxContext);

  const {
    isEditing,
    data,
    hydrated,
    replaceImage,
    deleteImage,
    resolveImage,
    updateVisualStyle,
  } = useResumeData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [resolvedSrc, setResolvedSrc] = useState(src);

  const imageVisualStyle = visualId
    ? data.visualStyles[visualId]
    : undefined;

  const effectiveObjectFit =
    imageVisualStyle?.objectFit ?? defaultObjectFit;

  const knownDimensions = visualId
    ? getDefaultImageDimensions(visualId)
    : undefined;

  useEffect(() => {
    let active = true;

    resolveImage(src)
      .then((nextSource) => {
        if (active) setResolvedSrc(nextSource);
      })
      .catch(() => {
        if (active) setResolvedSrc("");
      });

    return () => {
      active = false;
    };
  }, [resolveImage, src]);

  useEffect(() => {
    if (
      !hydrated ||
      !visualId ||
      !knownDimensions ||
      imageVisualStyle?.naturalWidth
    ) {
      return;
    }

    updateVisualStyle(visualId, {
      naturalWidth: knownDimensions.width,
      naturalHeight: knownDimensions.height,
      aspectRatio:
        effectiveObjectFit === "contain"
          ? knownDimensions.width / knownDimensions.height
          : imageVisualStyle?.aspectRatio,
      objectFit: effectiveObjectFit,
      lockAspect: imageVisualStyle?.lockAspect ?? true,
    });
  }, [
    effectiveObjectFit,
    hydrated,
    imageVisualStyle?.aspectRatio,
    imageVisualStyle?.lockAspect,
    imageVisualStyle?.naturalWidth,
    knownDimensions,
    updateVisualStyle,
    visualId,
  ]);

  if (!context) {
    throw new Error(
      "ZoomableImage must be used inside ImageLightboxProvider",
    );
  }

  const openViewer = () => {
    if (!resolvedSrc) return;

    context.openImage({
      src: resolvedSrc,
      alt,
      caption,
    });
  };

  const content = (
    <>
      {resolvedSrc ? (
        <button
          type="button"
          className="focus-ring relative block w-full overflow-hidden"
          aria-label={`查看高清图片：${alt}`}
          onClick={openViewer}
        >
          <Image
            key={resolvedSrc}
            ref={imageRef}
            src={resolvedSrc}
            alt={alt}
            width={1200}
            height={900}
            sizes={sizes}
            priority={priority}
            unoptimized={
              resolvedSrc.startsWith("data:") ||
              resolvedSrc.startsWith("blob:")
            }
            onLoad={() => {
              if (!hydrated || !visualId || !imageRef.current) return;

              const image = imageRef.current;
              const aspectRatio =
                image.naturalWidth / image.naturalHeight;

              if (
                imageVisualStyle?.naturalWidth === image.naturalWidth &&
                imageVisualStyle?.naturalHeight === image.naturalHeight
              ) {
                return;
              }

              updateVisualStyle(visualId, {
                naturalWidth: image.naturalWidth,
                naturalHeight: image.naturalHeight,
                aspectRatio:
                  (imageVisualStyle?.objectFit ?? defaultObjectFit) ===
                  "contain"
                    ? aspectRatio
                    : imageVisualStyle?.aspectRatio,
                objectFit:
                  imageVisualStyle?.objectFit ?? defaultObjectFit,
                lockAspect: imageVisualStyle?.lockAspect ?? true,
              });
            }}
            className={`h-auto max-h-[220px] w-full object-contain ${imageClassName} transition-transform duration-500 ease-out group-hover/image:scale-[1.015]`}
            style={{
              objectFit: effectiveObjectFit,
              objectPosition: imageVisualStyle?.objectPosition,
            }}
          />

          <span className="absolute right-3 top-3 grid size-9 place-items-center bg-black/65 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
            <Maximize2
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>

          {caption && !(isEditing && captionPath) && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-10 text-[10px] leading-4 tracking-[0.08em] text-white">
              {caption}
            </span>
          )}
        </button>
      ) : isEditing ? (
        <div className="absolute inset-0 grid place-items-center border border-dashed border-[var(--line)] text-xs text-[var(--muted)]">
          暂无图片
        </div>
      ) : null}

      {caption && isEditing && captionPath && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-10">
          <EditableText
            path={captionPath}
            className="text-[10px] leading-4 tracking-[0.08em] text-white"
            placeholder="图片说明"
          />
        </div>
      )}

      {isEditing && path && (
        <div
          className="absolute left-2 top-2 z-20 flex items-center gap-1"
          data-editor-controls
        >
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 bg-[var(--paper)]/95 px-2.5 py-2 text-[9px] text-[var(--ink)] shadow-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload
              size={12}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            更换
          </button>

          <button
            type="button"
            className="focus-ring grid size-8 place-items-center bg-[var(--paper)]/95 text-[var(--ink)] shadow-sm"
            aria-label="查看原图"
            onClick={openViewer}
          >
            <Maximize2
              size={12}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className="focus-ring grid size-8 place-items-center bg-[var(--paper)]/95 text-[var(--ink)] shadow-sm"
            aria-label="删除图片"
            onClick={() => deleteImage(path, visualId)}
          >
            <Trash2
              size={12}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";

              if (!file) return;

              try {
                await replaceImage(path, file, visualId);
              } catch (error) {
                window.alert(
                  error instanceof Error
                    ? error.message
                    : "图片上传失败。",
                );
              }
            }}
          />
        </div>
      )}
    </>
  );

  return visualId ? (
    <VisualBlock
      visualId={visualId}
      mode="image"
      className={`group/image overflow-hidden bg-[var(--paper-soft)] text-left ${className}`}
    >
      {content}
    </VisualBlock>
  ) : (
    <div
      className={`group/image relative block overflow-hidden bg-[var(--paper-soft)] text-left ${className}`}
    >
      {content}
    </div>
  );
}
