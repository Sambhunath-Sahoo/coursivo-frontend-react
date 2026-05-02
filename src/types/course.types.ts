import type { LessonResponse } from "@/api/lesson.service";

// Course instructor
export interface CourseInstructor {
  id: number;
  fullName: string;
}

// Course status
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// Section with nested lessons from API
export interface SectionResponse {
  id: number;
  title: string;
  order: number;
  lessons: LessonResponse[];
}

// Course from API
export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  isFree: boolean;
  thumbnailUrl: string;
  instructor: CourseInstructor;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
  sections?: SectionResponse[];
}
