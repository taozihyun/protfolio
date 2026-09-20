"use client";

import {
  ArrowDown,
  ArrowUp,
  Plus,
  Trash2,
} from "lucide-react";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  defaultResumeData,
  getDefaultResumeData,
  type Experience,
  type OtherWorkGroup,
  type Project,
  type ResumeData,
  type VisualStyle,
} from "@/lib/resume-data";
import {
  fileToDataUrl,
  getContent,
  getMedia,
  getMediaByIds,
  putContent,
  putMedia,
  type StoredMedia,
} from "@/lib/media-store";

export type EditorPath = Array<string | number>;
export type ListSection = "experiences" | "projects" | "otherWorkGroups";
export type SaveStatus = "saved" | "saving" | "error";
export type VisualMode = "text" | "image" | "section" | "grid";

type EditorContextValue = {
  data: ResumeData;
  hydrated: boolean;
  isEditing: boolean;
  saveStatus: SaveStatus;
  setIsEditing: (editing: boolean) => void;
  setValue: (path: EditorPath, value: unknown) => void;
  replaceImage: (
    path: EditorPath,
    file: File,
    visualId?: string,
  ) => Promise<void>;
  deleteImage: (path: EditorPath, visualId?: string) => void;
  addImage: (path: EditorPath) => void;
  resolveImage: (source: string) => Promise<string>;
  addItem: (section: ListSection) => void;
  removeItem: (section: ListSection, index: number) => void;
  moveItem: (section: ListSection, index: number, direction: -1 | 1) => void;
  saveNow: () => void;
  resetContent: () => void;
  exportContent: () => Promise<void>;
  importContent: (file: File) => Promise<void>;
  selectedVisualId: string | null;
  selectedVisualMode: VisualMode | null;
  setSelectedVisual: (id: string | null, mode?: VisualMode | null) => void;
  updateVisualStyle: (id: string, patch: Partial<VisualStyle>) => void;
  resetVisualStyle: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const STORAGE_KEY = "aria-resume-content-v4";
const EditorContext = createContext<EditorContextValue | null>(null);

export function ResumeEditorProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ResumeData>(() =>
    JSON.parse(JSON.stringify(defaultResumeData)),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const imageCache = useRef<Map<string, string>>(new Map());
  const [selectedVisualId, setSelectedVisualId] = useState<string | null>(null);
  const [selectedVisualMode, setSelectedVisualMode] =
    useState<VisualMode | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef<ResumeData[]>([]);
  const futureRef = useRef<ResumeData[]>([]);
  const previousDataRef = useRef<ResumeData | null>(null);
  const restoringHistoryRef = useRef(false);

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && active) {
          const parsed = JSON.parse(saved) as Partial<ResumeData>;
          const next = normalizeResumeData(parsed);
          setData(next);
          previousDataRef.current = next;
          return;
        }

        const stored = await getContent<Partial<ResumeData>>();
        if (stored && active) {
          const next = normalizeResumeData(stored);
          setData(next);
          previousDataRef.current = next;
        } else {
          previousDataRef.current = getDefaultResumeData();
        }
      } catch {
        if (active) setSaveStatus("error");
      } finally {
        if (active) setHydrated(true);
      }
    };

    void hydrate();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (previousDataRef.current == null) {
      previousDataRef.current = data;
      return;
    }

    if (restoringHistoryRef.current) {
      restoringHistoryRef.current = false;
      previousDataRef.current = data;
      return;
    }

    const timer = window.setTimeout(() => {
      const previous = previousDataRef.current;
      if (previous && JSON.stringify(previous) !== JSON.stringify(data)) {
        historyRef.current = [
          ...historyRef.current.slice(-39),
          previous,
        ];
        futureRef.current = [];
        previousDataRef.current = data;
        setCanUndo(historyRef.current.length > 0);
        setCanRedo(false);
      }
    }, 420);

    return () => window.clearTimeout(timer);
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setSaveStatus("saving");
    const timer = window.setTimeout(async () => {
      try {
        await putContent(data);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 240);

    return () => window.clearTimeout(timer);
  }, [data, hydrated]);

  useEffect(() => {
    document.body.classList.toggle("is-editing", isEditing);
    return () => document.body.classList.remove("is-editing");
  }, [isEditing]);

  const setValue = useCallback((path: EditorPath, value: unknown) => {
    setData((current) => setAtPath(current, path, value));
  }, []);

  const replaceImage = async (
    path: EditorPath,
    file: File,
    visualId?: string,
  ) => {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type.toLowerCase())
    ) {
      throw new Error("请选择 JPG、JPEG、PNG 或 WEBP 图片。");
    }

    const dataUrl = await fileToDataUrl(file);
    const dimensions = await readImageDimensions(dataUrl);
    const id = `upload-${crypto.randomUUID()}`;
    const media: StoredMedia = {
      id,
      dataUrl,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    };
    imageCache.current.set(id, dataUrl);
    setData((current) => {
      const next = setAtPath(current, path, `upload://${id}`);
      if (!visualId) return next;
      const existing = current.visualStyles[visualId] ?? {};
      const aspectRatio = dimensions.width / dimensions.height;
      const element =
        typeof document !== "undefined"
          ? document.querySelector<HTMLElement>(
              `[data-visual-id="${CSS.escape(visualId)}"]`,
            )
          : null;
      const containerWidth = element?.getBoundingClientRect().width;
      const displayWidth =
        existing.width ??
        Math.min(
          dimensions.width,
          Math.max(
            240,
            Math.round(containerWidth ?? Math.min(dimensions.width, 1200)),
          ),
        );
      const displayHeight =
        existing.height ?? Math.round(displayWidth / aspectRatio);
      return {
        ...next,
        visualStyles: {
          ...next.visualStyles,
          [visualId]: {
            ...existing,
            naturalWidth: dimensions.width,
            naturalHeight: dimensions.height,
            aspectRatio,
            width: displayWidth,
            height: displayHeight,
            objectFit: existing.objectFit ?? "contain",
            lockAspect: existing.lockAspect ?? true,
          },
        },
      };
    });

    try {
      await putMedia(media);
    } catch {
      setSaveStatus("error");
      throw new Error("图片已显示，但本地持久化失败，请检查浏览器存储权限。");
    }
  };

  const deleteImage = (path: EditorPath, visualId?: string) => {
    const parentPath = path.slice(0, -1);
    const parent = getValueAtPath(data, parentPath);
    if (Array.isArray(parent)) {
      const index = Number(path[path.length - 1]);
      setData((current) => {
        const next = setAtPath(
          current,
          parentPath,
          parent.filter((_, itemIndex) => itemIndex !== index),
        );
        if (!visualId) return next;
        const visualStyles = { ...next.visualStyles };
        delete visualStyles[visualId];
        return { ...next, visualStyles };
      });
      return;
    }
    setData((current) => {
      const next = setAtPath(current, path, "");
      if (!visualId) return next;
      const visualStyles = { ...next.visualStyles };
      delete visualStyles[visualId];
      return { ...next, visualStyles };
    });
  };

  const addImage = (path: EditorPath) => {
    const current = getValueAtPath(data, path);
    if (!Array.isArray(current)) return;
    setValue(path, [
      ...current,
      {
        src: "",
        alt: "新增图片",
        caption: "点击更换图片并编辑说明",
      },
    ]);
  };

  const setSelectedVisual = (
    id: string | null,
    mode: VisualMode | null = null,
  ) => {
    setSelectedVisualId(id);
    setSelectedVisualMode(id ? mode : null);
  };

  const updateVisualStyle = useCallback(
    (id: string, patch: Partial<VisualStyle>) => {
      setData((current) => ({
        ...current,
        visualStyles: {
          ...current.visualStyles,
          [id]: {
            ...(current.visualStyles[id] ?? {}),
            ...patch,
          },
        },
      }));
    },
    [],
  );

  const resetVisualStyle = (id: string) => {
    setData((current) => {
      const next = { ...current.visualStyles };
      delete next[id];
      return { ...current, visualStyles: next };
    });
  };

  const undo = () => {
    const target = historyRef.current.pop();
    if (!target) return;
    futureRef.current = [data, ...futureRef.current].slice(0, 40);
    restoringHistoryRef.current = true;
    previousDataRef.current = target;
    setData(target);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(true);
  };

  const redo = () => {
    const [target, ...rest] = futureRef.current;
    if (!target) return;
    historyRef.current = [...historyRef.current.slice(-39), data];
    futureRef.current = rest;
    restoringHistoryRef.current = true;
    previousDataRef.current = target;
    setData(target);
    setCanUndo(true);
    setCanRedo(rest.length > 0);
  };

  const resolveImage = useCallback(async (source: string) => {
    if (!source.startsWith("upload://")) return source;
    const id = source.slice("upload://".length);
    const cached = imageCache.current.get(id);
    if (cached) return cached;
    const media = await getMedia(id);
    if (!media) return "";
    imageCache.current.set(id, media.dataUrl);
    return media.dataUrl;
  }, []);

  const addItem = (section: ListSection) => {
    setData((current) => {
      if (section === "experiences") {
        const experiences = [
          ...current.experiences,
          createExperience(current.experiences.length + 1),
        ];
        return { ...current, experiences: reindex(experiences) };
      }

      if (section === "projects") {
        const projects = [
          ...current.projects,
          createProject(current.projects.length + 1),
        ];
        return { ...current, projects: reindex(projects) };
      }

      return {
        ...current,
        otherWorkGroups: [
          ...current.otherWorkGroups,
          createOtherWorkGroup(current.otherWorkGroups.length + 1),
        ],
      };
    });
  };

  const removeItem = (section: ListSection, index: number) => {
    if (section !== "otherWorkGroups" && data[section].length <= 1) {
      window.alert("至少保留一项内容。");
      return;
    }
    if (!window.confirm("确定删除这一项吗？此操作会立即保存。")) return;
    setData((current) => {
      if (section === "experiences") {
        const next = [...current.experiences];
        next.splice(index, 1);
        return { ...current, experiences: reindex(next) };
      }
      if (section === "projects") {
        const next = [...current.projects];
        next.splice(index, 1);
        return { ...current, projects: reindex(next) };
      }
      const next = [...current.otherWorkGroups];
      next.splice(index, 1);
      return { ...current, otherWorkGroups: next };
    });
  };

  const moveItem = (
    section: ListSection,
    index: number,
    direction: -1 | 1,
  ) => {
    setData((current) => {
      if (section === "experiences") {
        const next = [...current.experiences];
        const target = index + direction;
        if (target < 0 || target >= next.length) return current;
        [next[index], next[target]] = [next[target], next[index]];
        return { ...current, experiences: reindex(next) };
      }
      if (section === "projects") {
        const next = [...current.projects];
        const target = index + direction;
        if (target < 0 || target >= next.length) return current;
        [next[index], next[target]] = [next[target], next[index]];
        return { ...current, projects: reindex(next) };
      }
      const next = [...current.otherWorkGroups];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, otherWorkGroups: next };
    });
  };

  const saveNow = () => {
    try {
      void putContent(data);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  };

  const resetContent = () => {
    if (!window.confirm("是否恢复初始简历内容？当前修改将被覆盖。")) return;
    const initial = getDefaultResumeData();
    setData(initial);
    historyRef.current = [];
    futureRef.current = [];
    previousDataRef.current = initial;
    setCanUndo(false);
    setCanRedo(false);
    setSelectedVisual(null);
    imageCache.current.clear();
    void putContent(initial);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    setSaveStatus("saved");
  };

  const exportContent = async () => {
    const refs = collectMediaRefs(data);
    const media = await getMediaByIds(refs);
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
      media,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aria-resume-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importContent = async (file: File) => {
    const text = await file.text();
    const payload = JSON.parse(text) as {
      data?: Partial<ResumeData>;
      media?: Record<string, StoredMedia>;
    };
    if (!payload.data) throw new Error("JSON 中缺少简历内容。");

    const mediaEntries = Object.values(payload.media ?? {});
    await Promise.all(mediaEntries.map((media) => putMedia(media)));
    imageCache.current.clear();
    Object.entries(payload.media ?? {}).forEach(([id, media]) => {
      imageCache.current.set(id, media.dataUrl);
    });

    const next = normalizeResumeData(payload.data);
    setData(next);
    historyRef.current = [];
    futureRef.current = [];
    previousDataRef.current = next;
    setCanUndo(false);
    setCanRedo(false);
    await putContent(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaveStatus("saved");
  };

  return (
    <EditorContext.Provider
      value={{
        data,
        hydrated,
        isEditing,
        saveStatus,
        setIsEditing,
        setValue,
        replaceImage,
        deleteImage,
        addImage,
        resolveImage,
        addItem,
        removeItem,
        moveItem,
        saveNow,
        resetContent,
        exportContent,
        importContent,
        selectedVisualId,
        selectedVisualMode,
        setSelectedVisual,
        updateVisualStyle,
        resetVisualStyle,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useResumeData() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useResumeData must be used inside ResumeEditorProvider");
  }
  return context;
}

export function getValueAtPath(
  source: unknown,
  path: EditorPath,
): unknown {
  return path.reduce<unknown>((current, key) => {
    if (current == null) return undefined;
    return (current as Record<string | number, unknown>)[key];
  }, source);
}

export function EditorItemActions({
  section,
  index,
  count,
}: {
  section: ListSection;
  index: number;
  count: number;
}) {
  const { isEditing, addItem, removeItem, moveItem } = useResumeData();
  if (!isEditing) return null;

  const buttonClass =
    "focus-ring grid size-8 place-items-center border border-current/25 bg-[var(--paper)]/90 text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]";

  return (
    <div className="flex items-center gap-1" data-editor-controls>
      <button
        type="button"
        className={buttonClass}
        aria-label="向上移动"
        disabled={index === 0}
        onClick={() => moveItem(section, index, -1)}
      >
        <ArrowUp size={13} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label="向下移动"
        disabled={index === count - 1}
        onClick={() => moveItem(section, index, 1)}
      >
        <ArrowDown size={13} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label="新增一项"
        onClick={() => addItem(section)}
      >
        <Plus size={13} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label="删除这一项"
        onClick={() => removeItem(section, index)}
      >
        <Trash2 size={13} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

function setAtPath(
  source: ResumeData,
  path: EditorPath,
  value: unknown,
): ResumeData {
  if (path.length === 0) return value as ResumeData;
  const [key, ...rest] = path;
  const current = source[key as keyof ResumeData];

  if (Array.isArray(current)) {
    const next = [...(current as unknown[])];
    next[Number(rest[0])] =
      rest.length === 1
        ? value
        : setAtPathValue(next[Number(rest[0])], rest.slice(1), value);
    return { ...source, [key]: next } as ResumeData;
  }

  if (current && typeof current === "object") {
    return {
      ...source,
      [key]: setAtPathValue(current, rest, value),
    } as ResumeData;
  }

  return { ...source, [key]: value } as ResumeData;
}

function setAtPathValue(
  source: unknown,
  path: EditorPath,
  value: unknown,
): unknown {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  if (Array.isArray(source)) {
    const next = [...source];
    const index = Number(key);
    next[index] = setAtPathValue(next[index], rest, value);
    return next;
  }
  if (source && typeof source === "object") {
    return {
      ...(source as Record<string, unknown>),
      [key]: setAtPathValue(
        (source as Record<string, unknown>)[key],
        rest,
        value,
      ),
    };
  }
  return value;
}

function collectMediaRefs(value: unknown, result = new Set<string>()) {
  if (typeof value === "string" && value.startsWith("upload://")) {
    result.add(value.slice("upload://".length));
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectMediaRefs(item, result));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectMediaRefs(item, result));
  }
  return [...result];
}

function reindex<T extends { index: string }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    index: String(index + 1).padStart(2, "0"),
  }));
}

function normalizeResumeData(input: Partial<ResumeData>): ResumeData {
  const initial = getDefaultResumeData();
  const experienceAdditions = (initial.experiences[0]?.images ?? []).filter(
    (image) =>
      [
        "/images/experience-product-table-2.jpg",
        "/images/experience-sneaker-detail-2.jpg",
        "/images/experience-sample-letter.png",
      ].includes(image.src),
  );
  const experiences = (input.experiences ?? initial.experiences).map(
    (experience, index) =>
      index === 0
        ? {
            ...experience,
            images: mergeUniqueImages(
              experience.images ?? [],
              experienceAdditions,
            ),
          }
        : experience,
  );
  const projectAdditions = initial.projects
    .flatMap((project) => project.images)
    .filter((image) => image.src === "/images/project-overseas-marketing.png");
  const projects = (input.projects ?? initial.projects).map((project, index) => {
    const isOverseasProject =
      index === 2 || project.title.includes("海外达人营销");
    return isOverseasProject
      ? {
          ...project,
          images: mergeUniqueImages(project.images ?? [], projectAdditions),
        }
      : project;
  });
  const sourceGroups = input.otherWorkGroups ?? initial.otherWorkGroups;
  const socialImage = initial.otherWorkGroups
    .flatMap((group) => group.images)
    .find((image) => image.src === "/images/social-santic-collab.jpg");
  const otherWorkGroups = sourceGroups.map((group, index) => {
    const isSocialGroup =
      index === 2 ||
      group.title.includes("社媒") ||
      group.images.some((image) => image.src.includes("youtube-creator"));
    if (
      !isSocialGroup ||
      !socialImage ||
      group.images.some((image) => image.src === socialImage.src)
    ) {
      return group;
    }
    return { ...group, images: [...group.images, socialImage] };
  });

  return {
    profile: { ...initial.profile, ...(input.profile ?? {}) },
    heroMetrics: input.heroMetrics ?? initial.heroMetrics,
    education: { ...initial.education, ...(input.education ?? {}) },
    experiences,
    projects,
    skills: input.skills ?? initial.skills,
    tools: input.tools ?? initial.tools,
    otherWorkGroups,
    visualStyles: {
      ...initial.visualStyles,
      ...(input.visualStyles ?? {}),
    },
  };
}

function mergeUniqueImages<T extends { src: string }>(
  current: T[],
  additions: T[],
): T[] {
  const sources = new Set(current.map((image) => image.src));
  return [
    ...current,
    ...additions.filter((image) => !sources.has(image.src)),
  ];
}

function createExperience(index: number): Experience {
  return {
    index: String(index).padStart(2, "0"),
    company: "新增工作经历",
    role: "职位名称",
    period: "开始时间 — 结束时间",
    summary: "点击编辑工作内容摘要。",
    keywords: ["核心能力"],
    metrics: [
      { value: "0", label: "核心数据" },
      { value: "0", label: "关键结果" },
    ],
    groups: [
      {
        label: "ACTION",
        title: "工作内容",
        points: ["点击编辑具体工作内容。"],
      },
    ],
    images: [],
  };
}

function createProject(index: number): Project {
  return {
    index: String(index).padStart(2, "0"),
    eyebrow: "PROJECT",
    period: "",
    title: "新增项目",
    keywords: ["核心动作"],
    resultSummary: ["项目结果"],
    challenge: "点击编辑项目背景。",
    insight: "点击编辑关键洞察。",
    approach: ["点击编辑推进方式。"],
    execution: ["点击编辑执行协同。"],
    result: ["点击编辑项目成果。"],
    images: [],
  };
}

function createOtherWorkGroup(index: number): OtherWorkGroup {
  return {
    title: `其他工作 ${index}`,
    caption: "点击编辑图片说明。",
    images: [],
  };
}

function readImageDimensions(
  source: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => reject(new Error("无法读取图片尺寸。"));
    image.src = source;
  });
}
