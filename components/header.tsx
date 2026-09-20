"use client";

import {
  Download,
  FileDown,
  FileUp,
  Menu,
  PencilLine,
  RotateCcw,
  Save,
  Undo2,
  Redo2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useResumeData } from "@/components/resume-editor";

const navItems = [
  { href: "#home", index: "01", label: "首页", caption: "HOME" },
  { href: "#education", index: "02", label: "教育背景", caption: "EDUCATION" },
  {
    href: "#experience",
    index: "03",
    label: "我的工作经历",
    caption: "EXPERIENCE",
  },
  { href: "#projects", index: "04", label: "精选项目", caption: "PROJECTS" },
  { href: "#skills", index: "05", label: "能力结构", caption: "SKILLS" },
  { href: "#contact", index: "06", label: "联系方式", caption: "CONTACT" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [editAllowed, setEditAllowed] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const {
    isEditing,
    setIsEditing,
    saveStatus,
    saveNow,
    resetContent,
    exportContent,
    importContent,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResumeData();

  useEffect(() => {
    const enterEditor = () => {
      setEditAllowed(true);
      setIsEditing(true);
    };

    if (new URLSearchParams(window.location.search).get("edit") === "1") {
      enterEditor();
    } else if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      setEditAllowed(true);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "e"
      ) {
        event.preventDefault();
        enterEditor();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setIsEditing]);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--paper)]/95 backdrop-blur-md">
      <a
        href="#home"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-xs focus:text-[var(--paper)]"
      >
        跳到主要内容
      </a>
      <div className="shell flex h-[76px] items-center justify-between gap-6">
        <a
          href="#home"
          className="focus-ring flex items-center gap-3"
          aria-label="返回首页"
          onClick={() => setMenuOpen(false)}
        >
          <span className="display text-2xl leading-none">郭</span>
          <span className="hidden text-[10px] leading-tight text-[var(--muted)] sm:block">
            郭耀薇
            <br />
            个人简历
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="主导航">
          {navItems.map((item) => {
            const isActive = activeId === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={`label focus-ring relative py-2 transition-colors ${
                  isActive
                    ? "text-[var(--ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <span className="mr-1 text-[9px]">{item.index}</span>
                {item.label}
                <span className="ml-1 text-[8px] text-[var(--muted)]">
                  {item.caption}
                </span>
                <span
                  className={`absolute inset-x-0 -bottom-[1px] h-px origin-left bg-[var(--ink)] transition-transform ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {editAllowed && (
            <button
              type="button"
              className={`focus-ring hidden items-center gap-2 border px-3 py-3 text-[10px] tracking-[0.1em] transition-colors sm:flex ${
                isEditing
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
              aria-pressed={isEditing}
              onClick={() => setIsEditing(!isEditing)}
            >
              <PencilLine size={13} strokeWidth={1.5} aria-hidden="true" />
              {isEditing ? "正在编辑" : "编辑模式"}
            </button>
          )}
          <a
            href="/aria-resume.pdf"
            download
            className="focus-ring hidden items-center gap-2 border border-[var(--ink)] px-4 py-3 text-[10px] tracking-[0.1em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] sm:flex"
          >
            <Download size={13} strokeWidth={1.6} aria-hidden="true" />
            下载简历
          </a>
          <button
            type="button"
            className="focus-ring grid size-11 place-items-center border border-[var(--line)] lg:hidden"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={18} strokeWidth={1.6} aria-hidden="true" />
            ) : (
              <Menu size={18} strokeWidth={1.6} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="border-t border-[var(--line)] bg-[#ecece7]">
          <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
            <p className="label text-[var(--muted)]">
              {saveStatus === "saving"
                ? "正在保存..."
                : saveStatus === "error"
                  ? "保存失败，请检查浏览器存储权限"
                  : "编辑模式 · 修改自动保存到本机"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="focus-ring grid size-8 place-items-center border border-[var(--line)] bg-[var(--paper)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="撤销"
                disabled={!canUndo}
                onClick={undo}
              >
                <Undo2 size={12} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="focus-ring grid size-8 place-items-center border border-[var(--line)] bg-[var(--paper)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="重做"
                disabled={!canRedo}
                onClick={redo}
              >
                <Redo2 size={12} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="focus-ring inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[10px] transition-colors hover:border-[var(--ink)]"
                onClick={saveNow}
              >
                <Save size={12} strokeWidth={1.5} aria-hidden="true" />
                保存修改
              </button>
              <button
                type="button"
                className="focus-ring inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[10px] transition-colors hover:border-[var(--ink)]"
                onClick={exportContent}
              >
                <FileDown size={12} strokeWidth={1.5} aria-hidden="true" />
                导出内容
              </button>
              <button
                type="button"
                className="focus-ring inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[10px] transition-colors hover:border-[var(--ink)]"
                onClick={() => importInputRef.current?.click()}
              >
                <FileUp size={12} strokeWidth={1.5} aria-hidden="true" />
                导入内容
              </button>
              <button
                type="button"
                className="focus-ring inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[10px] transition-colors hover:border-[var(--ink)]"
                onClick={resetContent}
              >
                <RotateCcw size={12} strokeWidth={1.5} aria-hidden="true" />
                恢复默认内容
              </button>
              <button
                type="button"
                className="focus-ring border border-[var(--ink)] bg-[var(--ink)] px-3 py-2 text-[10px] text-[var(--paper)]"
                onClick={() => setIsEditing(false)}
              >
                退出编辑
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  try {
                    await importContent(file);
                  } catch (error) {
                    window.alert(
                      error instanceof Error ? error.message : "导入失败。",
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`overflow-hidden border-t border-[var(--line)] bg-[var(--paper)] transition-[max-height] duration-300 lg:hidden ${
          menuOpen ? "max-h-[420px]" : "max-h-0 border-t-transparent"
        }`}
      >
        <nav className="shell py-3" aria-label="移动端导航">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring flex items-center justify-between border-b border-[var(--line)] py-4 last:border-b-0"
              onClick={() => setMenuOpen(false)}
            >
              <span className="display text-3xl">{item.label}</span>
              <span className="label text-right text-[var(--muted)]">
                {item.index}
                <br />
                {item.caption}
              </span>
            </a>
          ))}
          <a
            href="/aria-resume.pdf"
            download
            className="focus-ring mt-4 flex items-center justify-center gap-2 bg-[var(--ink)] px-4 py-4 text-[11px] tracking-[0.12em] text-[var(--paper)] sm:hidden"
          >
            <Download size={14} strokeWidth={1.6} aria-hidden="true" />
            下载简历
          </a>
          {editAllowed && (
            <button
              type="button"
              className={`focus-ring mt-2 flex w-full items-center justify-center gap-2 border px-4 py-4 text-[11px] sm:hidden ${
                isEditing
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[var(--line)]"
              }`}
              onClick={() => {
                setIsEditing(!isEditing);
                setMenuOpen(false);
              }}
            >
              <PencilLine size={14} strokeWidth={1.5} aria-hidden="true" />
              {isEditing ? "正在编辑" : "进入编辑模式"}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
