import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  PlayCircle,
  FileText,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  Link,
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
  onUpdate: (
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) => void;
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
  const [editContent, setEditContent] = useState(lesson.content ?? "");
  const [editDuration, setEditDuration] = useState(lesson.duration);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lesson.id,
    data: { type: "lesson", lesson, sectionId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getLessonIcon = (type: "video" | "article") => {
    return type === "video"
      ? <PlayCircle className="h-4 w-4" />
      : <FileText className="h-4 w-4" />;
  };

  const handleSave = () => {
    onUpdate(sectionId, lesson.id, {
      title: editTitle || lesson.title,
      duration: editDuration || lesson.duration,
      videoUrl: lesson.type === "video" ? editVideoUrl : undefined,
      content: lesson.type === "article" ? editContent : undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(lesson.title);
    setEditVideoUrl(lesson.videoUrl ?? "");
    setEditContent(lesson.content ?? "");
    setEditDuration(lesson.duration);
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditTitle(lesson.title);
    setEditVideoUrl(lesson.videoUrl ?? "");
    setEditContent(lesson.content ?? "");
    setEditDuration(lesson.duration);
    setIsEditing(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 rounded-sm bg-card p-3 hover:bg-muted/50 ${
        isDragging ? "shadow-sm ring-2 ring-primary/20" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab touch-none text-muted-foreground/50 transition-opacity hover:text-muted-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="mt-1 text-muted-foreground">{getLessonIcon(lesson.type)}</div>

      {isEditing ? (
        <div className="flex flex-1 flex-col gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Lesson title"
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
            }}
          />

          {lesson.type === "video" && (
            <div className="flex items-center gap-2">
              <Link className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <Input
                value={editVideoUrl}
                onChange={(e) => setEditVideoUrl(e.target.value)}
                placeholder="Video URL"
                className="h-8 text-sm"
              />
            </div>
          )}

          {lesson.type === "article" && (
            <Textarea
              value={editContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
              placeholder="Article content"
              className="min-h-[80px] text-sm"
            />
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1">
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <Input
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
                placeholder={lesson.type === "article" ? "e.g. 10 min read" : "e.g. 12:45"}
                className="h-8 text-sm"
              />
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <span className="text-sm">
              {index + 1}. {lesson.title}
            </span>
            {lesson.type === "video" && lesson.videoUrl && (
              <span className="truncate text-[11px] text-muted-foreground">
                {lesson.videoUrl}
              </span>
            )}
            {lesson.type === "article" && lesson.content && (
              <span className="line-clamp-1 text-[11px] text-muted-foreground">
                {lesson.content}
              </span>
            )}
          </div>
          {lesson.isPreview && (
            <span className="mt-0.5 shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Preview
            </span>
          )}
          <span className="mt-0.5 flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {lesson.duration}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
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
