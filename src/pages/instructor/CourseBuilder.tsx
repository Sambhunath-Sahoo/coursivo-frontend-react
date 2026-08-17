import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay, pointerWithin, rectIntersection,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import {
  ArrowLeft, Plus, Save, FileText, GripVertical,
  PlayCircle, Clock, BookOpen, Layers, Check, Loader2,
} from "lucide-react";
import { SectionItem } from "./course-builder/SectionItem";
import type { Section, Lesson, CourseData } from "./course-builder/types";
import { initialSections, initialCourseData } from "./course-builder/types";
import { courseService } from "@/api/course.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label, id, value, onChange, placeholder, type = "text",
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseBuilder() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>(id ? [] : initialSections);
  const [courseData, setCourseData] = useState<CourseData>(
    id ? { title: "", subtitle: "", category: "", subcategory: "", level: "", language: "", price: "" }
      : initialCourseData,
  );
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"section" | "lesson" | null>(null);
  const [activeTab, setActiveTab] = useState<"curriculum" | "details">("curriculum");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const course = await courseService.getCourseById(Number(id));
        if (cancelled) return;
        setCourseData({
          title: course.title ?? "", subtitle: course.description ?? "",
          category: "", subcategory: "", level: "", language: "",
          price: course.price != null ? `₹${course.price}` : "",
        });
        setSections((course.sections ?? []).map((s) => ({
          id: String(s.id), title: s.title, isExpanded: true,
          lessons: s.lessons.map((l) => ({
            id: String(l.id), title: l.title,
            type: (l.videoUrl ? "video" : "article") as "video" | "article",
            duration: l.durationMinutes
              ? `${Math.floor(l.durationMinutes)}:${String(Math.round((l.durationMinutes % 1) * 60)).padStart(2, "0")}`
              : l.videoUrl ? "0:00" : "0 min read",
            isPreview: l.isPreviewable, videoUrl: l.videoUrl ?? undefined, content: l.content ?? undefined,
          })),
        })));
      } catch (err) { console.error("Failed to load course:", err); }
      finally { if (!cancelled) setIsLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const findSectionByLessonId = (lessonId: string) =>
    sections.find((s) => s.lessons.some((l) => l.id === lessonId));

  const getLessonById = (lessonId: string): Lesson | undefined => {
    for (const s of sections) {
      const l = s.lessons.find((l) => l.id === lessonId);
      if (l) return l;
    }
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
    setActiveType(e.active.data.current?.type || null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || active.data.current?.type !== "lesson") return;
    const activeLessonId = active.id as string;
    const activeSection = findSectionByLessonId(activeLessonId);
    if (!activeSection) return;
    const overData = over.data.current;
    let targetSectionId: string | null = null;
    if (overData?.type === "lesson") {
      targetSectionId = findSectionByLessonId(over.id as string)?.id || null;
    } else if (overData?.type === "section") {
      targetSectionId = overData.sectionId;
    }
    if (!targetSectionId || targetSectionId === activeSection.id) return;
    setSections((prev) => {
      const next = [...prev];
      const si = next.findIndex((s) => s.id === activeSection.id);
      const ti = next.findIndex((s) => s.id === targetSectionId);
      if (si === -1 || ti === -1) return prev;
      const li = next[si].lessons.findIndex((l) => l.id === activeLessonId);
      if (li === -1) return prev;
      const [lesson] = next[si].lessons.splice(li, 1);
      if (overData?.type === "lesson") {
        const oi = next[ti].lessons.findIndex((l) => l.id === over.id);
        next[ti].lessons.splice(oi, 0, lesson);
      } else {
        next[ti].lessons.push(lesson);
      }
      return next;
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null); setActiveType(null);
    if (!over) return;
    if (active.data.current?.type === "section" && active.id !== over.id) {
      setSections((prev) => arrayMove(prev, prev.findIndex((s) => s.id === active.id), prev.findIndex((s) => s.id === over.id)));
    } else if (active.data.current?.type === "lesson") {
      const as_ = findSectionByLessonId(active.id as string);
      const os = findSectionByLessonId(over.id as string);
      if (as_ && os && as_.id === os.id && active.id !== over.id) {
        setSections((prev) => prev.map((s) => {
          if (s.id !== as_.id) return s;
          return { ...s, lessons: arrayMove(s.lessons, s.lessons.findIndex((l) => l.id === active.id), s.lessons.findIndex((l) => l.id === over.id)) };
        }));
      }
    }
  };

  const handleAddSection = () => setSections([...sections, {
    id: `section-${Date.now()}`, title: "New Section", lessons: [], isExpanded: true,
  }]);

  const handleUpdateSection = (sectionId: string, updates: Partial<Section>) =>
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)));

  const handleDeleteSection = (sectionId: string) =>
    setSections(sections.filter((s) => s.id !== sectionId));

  const handleToggleSection = (sectionId: string) =>
    setSections(sections.map((s) => s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s));

  const handleAddLesson = (sectionId: string, type: "video" | "article") => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: type === "video" ? "New Video Lesson" : "New Article",
      type, duration: type === "video" ? "0:00" : "0 min read", isPreview: false,
    };
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, lessons: [...s.lessons, newLesson], isExpanded: true } : s));
  };

  const handleUpdateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) =>
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, lessons: s.lessons.map((l) => l.id === lessonId ? { ...l, ...updates } : l) } : s));

  const handleDeleteLesson = (sectionId: string, lessonId: string) =>
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s));

  const handleToggleLessonPreview = (sectionId: string, lessonId: string) =>
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, lessons: s.lessons.map((l) => l.id === lessonId ? { ...l, isPreview: !l.isPreview } : l) } : s));

  const buildPayload = () => ({
    sections: sections.map((s) => ({
      id: s.id, title: s.title,
      lessons: s.lessons.map((l) => ({
        id: l.id, title: l.title, type: l.type, duration: l.duration,
        isPreview: l.isPreview, videoUrl: l.videoUrl, content: l.content,
      })),
    })),
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let courseId = id;
      if (!courseId) {
        const c = await courseService.createCourse({
          title: courseData.title || "Untitled Course",
          description: courseData.subtitle,
          price: parseFloat(courseData.price.replace(/[^0-9.]/g, "")) || 0,
        } as any);
        courseId = c.id.toString();
        navigate(`/instructor/courses/${courseId}/edit`, { replace: true });
      } else {
        await courseService.updateCourse(Number(courseId), {
          title: courseData.title || "Untitled Course",
          description: courseData.subtitle,
          price: parseFloat(courseData.price.replace(/[^0-9.]/g, "")) || 0,
          thumbnailUrl: null,
        });
      }
      await courseService.saveCurriculum(courseId!, buildPayload());
      toast.success("Course saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save course");
    } finally { setIsSaving(false); }
  };

  const handlePublish = async () => {
    if (!id) { toast.warning("Save the course first before publishing."); return; }
    try {
      setIsPublishing(true);
      await courseService.publishCourse(Number(id));
      toast.success("Course published!");
      navigate("/instructor/courses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish course");
    } finally { setIsPublishing(false); }
  };

  const totalSections = sections.length;
  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);
  const totalVideos = sections.reduce((a, s) => a + s.lessons.filter((l) => l.type === "video").length, 0);
  const activeLesson = activeId && activeType === "lesson" ? getLessonById(activeId) : null;

  const collisionDetection = (args: Parameters<typeof closestCenter>[0]) => {
    const p = pointerWithin(args);
    return p.length > 0 ? p : rectIntersection(args);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/80" />
      </div>
    );
  }

  const set = (k: keyof CourseData) => (v: string) => setCourseData((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex h-full flex-col bg-muted/30 font-sans antialiased">

      {/* ── Sticky top bar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-5">
        {/* Left */}
        <div className="flex w-1/3 items-center gap-3 min-w-0">
          <Link
            to="/instructor/dashboard"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/80 hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 hidden sm:block">
            <p className="truncate text-sm font-semibold text-foreground">
              {courseData.title || "Untitled Course"}
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              {totalSections} sections · {totalLessons} lessons
            </p>
          </div>
        </div>

        {/* Center - Tabs */}
        <div className="flex w-1/3 justify-center">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab("curriculum")}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-semibold transition-all",
                activeTab === "curriculum" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-semibold transition-all",
                activeTab === "details" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Course Details
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex w-1/3 justify-end items-center gap-2.5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-foreground/50 hover:text-foreground disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isSaving ? "Saving…" : "Save"}</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing || isSaving || !id}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            {isPublishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isPublishing ? "Publishing…" : "Publish"}</span>
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-12">
          
          {/* Main content container using full horizontal space but capped to 7xl for readability */}
          <div className="mx-auto max-w-7xl">

            {/* ── Curriculum Tab ──────────────────────────────────────────────── */}
            {activeTab === "curriculum" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Curriculum</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Drag sections and lessons to reorder your content.
                    </p>
                  </div>
                  <button
                    onClick={handleAddSection}
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" /> Add Section
                  </button>
                </div>

                {sections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-24 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/30">
                      <Layers className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="mb-1 text-lg font-semibold text-foreground">No sections yet</p>
                    <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                      Add your first section to start building your curriculum
                    </p>
                    <button
                      onClick={handleAddSection}
                      className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" /> Add Section
                    </button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={collisionDetection}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {sections.map((section, index) => (
                          <SectionItem
                            key={section.id}
                            section={section}
                            index={index}
                            onUpdate={handleUpdateSection}
                            onDelete={handleDeleteSection}
                            onToggle={handleToggleSection}
                            onAddLesson={handleAddLesson}
                            onUpdateLesson={handleUpdateLesson}
                            onDeleteLesson={handleDeleteLesson}
                            onToggleLessonPreview={handleToggleLessonPreview}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeLesson && (
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
                          <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                          <div className="text-muted-foreground/80">
                            {activeLesson.type === "video" ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <span className="flex-1 text-sm font-medium text-foreground">{activeLesson.title}</span>
                          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground/80">
                            <Clock className="h-3 w-3" />{activeLesson.duration}
                          </span>
                        </div>
                      )}
                    </DragOverlay>
                  </DndContext>
                )}
              </div>
            )}

            {/* ── Details Tab ─────────────────────────────────────────────────── */}
            {activeTab === "details" && (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">Course Information</h2>
                    <div className="space-y-5 rounded-2xl border border-border bg-background p-6">
                      <Field label="Title" id="title" value={courseData.title}
                        onChange={set("title")} placeholder="e.g. Complete React Developer Course" />
                      <Field label="Subtitle / Description" id="subtitle" value={courseData.subtitle}
                        onChange={set("subtitle")} placeholder="A short, catchy description of your course…" />
                      
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Field label="Category" id="category" value={courseData.category}
                          onChange={set("category")} placeholder="e.g. Web Development" />
                        <Field label="Level" id="level" value={courseData.level}
                          onChange={set("level")} placeholder="e.g. Beginner" />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Field label="Language" id="language" value={courseData.language}
                          onChange={set("language")} placeholder="e.g. English" />
                        <Field label="Price (₹)" id="price" value={courseData.price}
                          onChange={set("price")} placeholder="e.g. 499" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-foreground">Summary</h3>
                    <div className="space-y-2">
                      {[
                        { icon: Layers, label: "Sections", value: totalSections },
                        { icon: BookOpen, label: "Lessons", value: totalLessons },
                        { icon: PlayCircle, label: "Videos", value: totalVideos },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center justify-between rounded-xl bg-background border border-border px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
                            <Icon className="h-4 w-4 text-muted-foreground/80" />
                            {label}
                          </div>
                          <span className="text-base font-semibold text-foreground">{value}</span>
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-between rounded-xl bg-background border border-border px-4 py-3 shadow-sm mt-4">
                        <span className="text-sm font-medium text-muted-foreground">Status</span>
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          id ? "border-foreground/30 bg-accent text-foreground" : "border-border bg-muted text-muted-foreground"
                        }`}>
                          {id ? "Draft" : "New"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
