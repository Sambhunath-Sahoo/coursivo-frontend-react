import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Video,
  Save,
  ArrowLeft,
  PlayCircle,
  FileText,
  Clock,
  GripVertical,
} from "lucide-react";
import { SectionItem } from "./course-builder/SectionItem";
import type { Section, Lesson, CourseData } from "./course-builder/types";
import { initialSections, initialCourseData } from "./course-builder/types";
import { courseService } from "@/api/course.service";

export default function CourseBuilder() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [courseData, setCourseData] = useState<CourseData>(initialCourseData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"section" | "lesson" | null>(
    null,
  );

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Find which section contains a lesson
  const findSectionByLessonId = (lessonId: string): Section | undefined => {
    return sections.find((s) => s.lessons.some((l) => l.id === lessonId));
  };

  // Get lesson by id
  const getLessonById = (lessonId: string): Lesson | undefined => {
    for (const section of sections) {
      const lesson = section.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
    return undefined;
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    setActiveId(active.id as string);
    setActiveType(activeData?.type || null);
  };

  // Handle drag over - for moving lessons between sections
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle lesson dragging
    if (activeData?.type !== "lesson") return;

    const activeLessonId = active.id as string;
    const activeSection = findSectionByLessonId(activeLessonId);

    if (!activeSection) return;

    // Determine target section
    let targetSectionId: string | null = null;

    if (overData?.type === "lesson") {
      // Dropping over another lesson
      const overSection = findSectionByLessonId(over.id as string);
      targetSectionId = overSection?.id || null;
    } else if (overData?.type === "section") {
      // Dropping over a section's droppable area
      targetSectionId = overData.sectionId;
    }

    if (!targetSectionId || targetSectionId === activeSection.id) return;

    // Move lesson to new section
    setSections((prevSections) => {
      const newSections = [...prevSections];

      // Find source and target section indices
      const sourceSectionIndex = newSections.findIndex(
        (s) => s.id === activeSection.id,
      );
      const targetSectionIndex = newSections.findIndex(
        (s) => s.id === targetSectionId,
      );

      if (sourceSectionIndex === -1 || targetSectionIndex === -1)
        return prevSections;

      // Find the lesson
      const lessonIndex = newSections[sourceSectionIndex].lessons.findIndex(
        (l) => l.id === activeLessonId,
      );
      if (lessonIndex === -1) return prevSections;

      // Remove from source
      const [lesson] = newSections[sourceSectionIndex].lessons.splice(
        lessonIndex,
        1,
      );

      // Add to target
      if (overData?.type === "lesson") {
        // Insert at the position of the over lesson
        const overLessonIndex = newSections[
          targetSectionIndex
        ].lessons.findIndex((l) => l.id === over.id);
        newSections[targetSectionIndex].lessons.splice(
          overLessonIndex,
          0,
          lesson,
        );
      } else {
        // Add at the end
        newSections[targetSectionIndex].lessons.push(lesson);
      }

      return newSections;
    });
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeData = active.data.current;

    if (activeData?.type === "section") {
      // Reorder sections
      if (active.id !== over.id) {
        setSections((prevSections) => {
          const oldIndex = prevSections.findIndex((s) => s.id === active.id);
          const newIndex = prevSections.findIndex((s) => s.id === over.id);
          return arrayMove(prevSections, oldIndex, newIndex);
        });
      }
    } else if (activeData?.type === "lesson") {
      // Reorder lessons within the same section
      const activeSection = findSectionByLessonId(active.id as string);
      const overSection = findSectionByLessonId(over.id as string);

      if (activeSection && overSection && activeSection.id === overSection.id) {
        if (active.id !== over.id) {
          setSections((prevSections) => {
            return prevSections.map((section) => {
              if (section.id !== activeSection.id) return section;

              const oldIndex = section.lessons.findIndex(
                (l) => l.id === active.id,
              );
              const newIndex = section.lessons.findIndex(
                (l) => l.id === over.id,
              );

              return {
                ...section,
                lessons: arrayMove(section.lessons, oldIndex, newIndex),
              };
            });
          });
        }
      }
    }
  };

  // Section handlers
  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "New Section",
      lessons: [],
      isExpanded: true,
    };
    setSections([...sections, newSection]);
  };

  const handleUpdateSection = (
    sectionId: string,
    updates: Partial<Section>,
  ) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    );
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const handleToggleSection = (sectionId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s,
      ),
    );
  };

  // Lesson handlers
  const handleAddLesson = (
    sectionId: string,
    type: "video" | "article" | "quiz",
  ) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title:
        type === "video"
          ? "New Video Lesson"
          : type === "article"
            ? "New Article"
            : "New Quiz",
      type,
      duration:
        type === "video"
          ? "0:00"
          : type === "article"
            ? "0 min read"
            : "0 questions",
      isPreview: false,
    };
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: [...s.lessons, newLesson], isExpanded: true }
          : s,
      ),
    );
  };

  const handleUpdateLesson = (
    sectionId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l,
              ),
            }
          : s,
      ),
    );
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s,
      ),
    );
  };

  const handleToggleLessonPreview = (sectionId: string, lessonId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId ? { ...l, isPreview: !l.isPreview } : l,
              ),
            }
          : s,
      ),
    );
  };

  // Get active lesson for drag overlay
  const activeLesson =
    activeId && activeType === "lesson" ? getLessonById(activeId) : null;

  // Calculate totals
  const totalSections = sections.length;
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalVideos = sections.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.type === "video").length,
    0,
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let courseId = id;
      
      // If creating a new course
      if (!courseId) {
        // Minimal course creation
        const newCourse = await courseService.createCourse({
          title: courseData.title || "Untitled Course",
          description: courseData.subtitle,
          price: parseFloat(courseData.price.replace(/[^0-9.]/g, '')) || 0,
        } as any);
        courseId = newCourse.id.toString();
        // Redirect to edit mode
        navigate(`/instructor/courses/${courseId}/edit`, { replace: true });
      }

      // Format payload for curriculum
      const payload = {
        sections: sections.map((s) => ({
          id: s.id,
          title: s.title,
          lessons: s.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            type: l.type,
            duration: l.duration,
            isPreview: l.isPreview
          }))
        }))
      };

      await courseService.saveCurriculum(courseId, payload);
      alert("Curriculum saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save curriculum");
    } finally {
      setIsSaving(false);
    }
  };

  // Custom collision detection
  const collisionDetection = (args: Parameters<typeof closestCenter>[0]) => {
    // First try pointer within for lessons
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    // Fallback to rect intersection
    return rectIntersection(args);
  };

  return (
    <div className="min-h-full bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="container-padding mx-auto max-w-7xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/instructor/dashboard">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {courseData.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Draft • {totalSections} sections • {totalLessons} lessons
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Preview</Button>
              <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-padding mx-auto max-w-7xl py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - Curriculum Builder */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Course Curriculum</CardTitle>
                  <Button
                    onClick={handleAddSection}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Video className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="font-medium">No sections yet</p>
                    <p className="text-sm">
                      Add your first section to start building your course
                    </p>
                    <Button onClick={handleAddSection} className="mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      Add Section
                    </Button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={collisionDetection}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sections.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
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

                    {/* Drag Overlay for lessons */}
                    <DragOverlay>
                      {activeLesson && (
                        <div className="flex items-center gap-3 rounded-sm border border-border bg-card p-3 shadow-lg">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <div className="text-muted-foreground">
                            {activeLesson.type === "video" ? (
                              <PlayCircle className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <span className="flex-1 text-sm">
                            {activeLesson.title}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {activeLesson.duration}
                          </span>
                        </div>
                      )}
                    </DragOverlay>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Course Details */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) =>
                      setCourseData({ ...courseData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={courseData.subtitle}
                    onChange={(e) =>
                      setCourseData({ ...courseData, subtitle: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={courseData.category}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      value={courseData.level}
                      onChange={(e) =>
                        setCourseData({ ...courseData, level: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={courseData.price}
                    onChange={(e) =>
                      setCourseData({ ...courseData, price: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Course Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sections</span>
                    <span className="font-medium">{totalSections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Videos</span>
                    <span className="font-medium">{totalVideos}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-orange-600">Draft</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Publishing..." : "Publish Course"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
