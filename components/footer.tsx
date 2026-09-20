"use client";

import { ArrowUp, Download, Mail, Phone } from "lucide-react";
import { EditableText } from "@/components/editable-text";
import { useResumeData } from "@/components/resume-editor";
import { VisualBlock } from "@/components/visual-editor";

export function Footer() {
  const { data, isEditing } = useResumeData();
  const { profile } = data;

  return (
    <VisualBlock
      as="footer"
      id="contact"
      visualId="section-contact"
      mode="section"
      className="bg-[var(--ink)] pb-8 text-[var(--paper)]"
    >
      <div className="shell">
        <div className="border-t border-white/25 pt-10 lg:pt-14">
          <div className="grid gap-10 pb-20 lg:grid-cols-12 lg:gap-8 lg:pb-28">
            <div className="lg:col-span-7">
              <p className="label mb-6 text-white/40">
                简历与联系方式 / RESUME & CONTACT
              </p>
              <h2 className="display text-[clamp(3.25rem,8vw,8rem)] leading-[0.84]">
                <EditableText path={["profile", "name"]} />
                <span className="mx-3 text-white/40">/</span>
                <EditableText path={["profile", "englishName"]} />
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-4 lg:col-span-5">
              <a
                href={`mailto:${profile.email}`}
                className="focus-ring flex items-center gap-3 border-b border-white/25 py-4 text-sm transition-colors hover:border-white"
                onClick={(event) => {
                  if (isEditing) event.preventDefault();
                }}
              >
                <Mail size={15} strokeWidth={1.4} aria-hidden="true" />
                <EditableText
                  path={["profile", "email"]}
                  placeholder="邮箱"
                />
              </a>
              <a
                href={`tel:${profile.phone}`}
                className="focus-ring flex items-center gap-3 border-b border-white/25 py-4 text-sm transition-colors hover:border-white"
                onClick={(event) => {
                  if (isEditing) event.preventDefault();
                }}
              >
                <Phone size={15} strokeWidth={1.4} aria-hidden="true" />
                <EditableText
                  path={["profile", "phone"]}
                  placeholder="手机号"
                />
              </a>
              <a
                href={profile.resumeHref}
                download
                className="focus-ring group mt-3 inline-flex items-center justify-between bg-[var(--paper)] px-5 py-4 text-[11px] tracking-[0.12em] text-[var(--ink)]"
              >
                下载简历
                <Download
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-white/25 py-6 text-[10px] tracking-[0.1em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 {profile.name} / {profile.englishName}. 保留所有权利。</p>
            <a
              href="#home"
              className="focus-ring flex items-center gap-2 transition-colors hover:text-white"
            >
              返回顶部
              <ArrowUp size={13} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </VisualBlock>
  );
}
