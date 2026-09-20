"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
} from "react";
import {
  getValueAtPath,
  useResumeData,
  type EditorPath,
} from "@/components/resume-editor";

type EditableTextProps = {
  path: EditorPath;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
};

export function EditableText({
  path,
  as,
  className = "",
  multiline = false,
  placeholder = "点击编辑",
}: EditableTextProps) {
  const Component = as ?? "span";
  const { data, isEditing, setValue } = useResumeData();
  const elementRef = useRef<HTMLElement>(null);
  const focusValueRef = useRef("");
  const value = String(getValueAtPath(data, path) ?? "");
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (document.activeElement !== elementRef.current) {
      setDraft(value);
    }
  }, [value]);

  if (!isEditing) {
    return <Component className={className}>{value}</Component>;
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !multiline) {
      event.preventDefault();
      elementRef.current?.blur();
    }
    if (event.key === "Escape") {
      setDraft(focusValueRef.current);
      setValue(path, focusValueRef.current);
      if (elementRef.current) {
        elementRef.current.textContent = focusValueRef.current;
      }
      elementRef.current?.blur();
    }
  };

  return (
    <Component
      ref={elementRef}
      className={`editable-text ${className}`}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      data-placeholder={placeholder}
      onFocus={() => {
        focusValueRef.current = value;
      }}
      onKeyDown={onKeyDown}
      onInput={(event: React.FormEvent<HTMLElement>) => {
        const nextValue = event.currentTarget.innerText.replace(/\n{3,}/g, "\n\n");
        setDraft(nextValue);
        setValue(path, nextValue);
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        const nextValue = event.currentTarget.innerText.replace(/\n{3,}/g, "\n\n");
        setDraft(nextValue);
        setValue(path, nextValue);
      }}
    >
      {draft}
    </Component>
  );
}
