import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Check,
  X,
  Plus,
  Video,
  FileText,
} from "lucide-react";
import { LessonItem } from "./LessonItem";
import type { Section, Lesson } from "./types";

interface SectionItemProps {
  section: Section;
  index: number;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
  onToggle: (sectionId: string) => void;
  onAddLesson: (sectionId: string, type: "video" | "article") => void;
  onUpdateLesson: (sectionId: string, lessonId: string, updates: Partial<Lesson>) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onToggleLessonPreview: (sectionId: string, lessonId: string) => void;
}

export function SectionItem({
  section,
  index,
  onUpdate,
  onDelete,
  onToggle,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onToggleLessonPreview,
}: SectionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [addOpen, setAddOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setSectionRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, data: { type: "section", section } });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `section-${section.id}-lessons`,
    data: { type: "section", sectionId: section.id },
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleSave = () => {
    onUpdate(section.id, { title: editTitle || section.title });
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditTitle(section.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setSectionRef}
      style={style}
      className={`overflow-hidden rounded-xl border bg-background transition-shadow ${
        isDragging
          ? "border-border opacity-50 shadow-sm"
          : "border-border shadow-none"
      }`}
    >
      {/* ── Section header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 border-b border-border/50 bg-muted/30 px-4 py-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => onToggle(section.id)}
          className="text-muted-foreground/80 hover:text-foreground/80"
        >
          {section.isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Title / edit inline */}
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="h-7 flex-1 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground focus:border-zinc-900 focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCancel}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground">
                Section {index + 1}:{" "}
              </span>
              <span className="text-sm font-semibold text-foreground">{section.title}</span>
              <span className="ml-2 text-xs text-muted-foreground/80">
                ({section.lessons.length}{" "}
                {section.lessons.length === 1 ? "lesson" : "lessons"})
              </span>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              {/* Add lesson inline toggle */}
              <div className="relative">
                <button
                  onClick={() => setAddOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
                {addOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAddOpen(false)} />
                    <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-40 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                      <button
                        onClick={() => { onAddLesson(section.id, "video"); setAddOpen(false); }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-foreground/80 hover:bg-muted/30"
                      >
                        <Video className="h-3.5 w-3.5 text-muted-foreground/80" />
                        Video Lesson
                      </button>
                      <button
                        onClick={() => { onAddLesson(section.id, "article"); setAddOpen(false); }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-foreground/80 hover:bg-muted/30"
                      >
                        <FileText className="h-3.5 w-3.5 text-muted-foreground/80" />
                        Article
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => { setEditTitle(section.title); setIsEditing(true); }}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/80 hover:bg-muted hover:text-foreground/80"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(section.id)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/80 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Lessons area ─────────────────────────────────────────────── */}
      {section.isExpanded && (
        <div
          ref={setDroppableRef}
          className={`min-h-[56px] p-3 transition-colors ${isOver ? "bg-muted/30" : ""}`}
        >
          {section.lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="mb-3 text-xs text-muted-foreground/80">
                {isOver ? "Drop lesson here" : "No lessons in this section yet"}
              </p>
              {!isOver && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddLesson(section.id, "video")}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  >
                    <Video className="h-3 w-3" /> Video
                  </button>
                  <button
                    onClick={() => onAddLesson(section.id, "article")}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  >
                    <FileText className="h-3 w-3" /> Article
                  </button>
                </div>
              )}
            </div>
          ) : (
            <SortableContext
              items={section.lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1.5">
                {section.lessons.map((lesson, lessonIndex) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    index={lessonIndex}
                    sectionId={section.id}
                    onUpdate={onUpdateLesson}
                    onDelete={onDeleteLesson}
                    onTogglePreview={onToggleLessonPreview}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}
