import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GripVertical,
  PlayCircle,
  FileText,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  Link,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Lesson } from "./types";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  sectionId: string;
  onUpdate: (sectionId: string, lessonId: string, updates: Partial<Lesson>) => void;
  onDelete: (sectionId: string, lessonId: string) => void;
  onTogglePreview: (sectionId: string, lessonId: string) => void;
}

export function LessonItem({
  lesson,
  index,
  sectionId,
  onUpdate,
  onDelete,
  onTogglePreview,
}: LessonItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editVideoUrl, setEditVideoUrl] = useState(lesson.videoUrl ?? "");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
    data: { type: "lesson", lesson, sectionId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(sectionId, lesson.id, {
      title: editTitle || lesson.title,
      videoUrl: editVideoUrl || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(lesson.title);
    setEditVideoUrl(lesson.videoUrl ?? "");
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditTitle(lesson.title);
    setEditVideoUrl(lesson.videoUrl ?? "");
    setIsEditing(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-sm bg-card px-3 py-2.5 hover:bg-muted/50 ${
        isDragging ? "shadow-sm ring-2 ring-primary/20" : ""
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground/40 transition-opacity hover:text-muted-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Type icon */}
      <div className="shrink-0 text-muted-foreground/50">
        {lesson.type === "video" ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </div>

      {isEditing ? (
        /* ── Edit mode: title + video URL only ── */
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Lesson title"
            className="h-8 flex-1 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <div className="flex flex-1 items-center gap-1.5">
            <Link className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <Input
              value={editVideoUrl}
              onChange={(e) => setEditVideoUrl(e.target.value)}
              placeholder="Video URL (YouTube, Vimeo…)"
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        /* ── View mode: title + watch link ── */
        <>
          <div className="flex flex-1 items-center gap-3 min-w-0">
            <span className="truncate text-sm font-medium text-foreground">
              {index + 1}. {lesson.title}
            </span>
            {lesson.videoUrl && (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1 text-[11px] text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
                Watch video
              </a>
            )}
          </div>

          {lesson.isPreview && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Preview
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={startEditing}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePreview(sectionId, lesson.id)}>
                <PlayCircle className="mr-2 h-4 w-4" />
                {lesson.isPreview ? "Remove Preview" : "Make Preview"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(sectionId, lesson.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
