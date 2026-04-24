// Course instructor
export interface CourseInstructor {
  id: number;
  fullName: string;
}

// Course status
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

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
  lessons?: import("@/api/lesson.service").LessonResponse[];
}
