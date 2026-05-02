import { api } from "./http";
import type { Course } from "@/types/course.types";

export const courseService = {
  // Get all public courses
  getPublicCourses: (signal?: AbortSignal): Promise<Course[]> => {
    return api.get<Course[]>("courses", { signal });
  },

  // Create a new course
  createCourse: (data: Partial<Course>): Promise<Course> => {
    return api.post<Course>("instructor/courses", data);
  },

  // Get course by ID
  getCourseById: (id: number): Promise<Course> => {
    return api.get<Course>(`courses/${id}`);
  },

  // Get instructor courses
  getInstructorCourses: (): Promise<Course[]> => {
    return api.get<Course[]>("instructor/courses");
  },

  // Update course details
  updateCourse: (id: number, data: { title: string; description: string; price: number; thumbnailUrl: string | null }): Promise<Course> => {
    return api.put<Course>(`instructor/courses/${id}`, data);
  },

  // Publish a course
  publishCourse: (id: number): Promise<Course> => {
    return api.put<Course>(`instructor/courses/${id}/publish`, {});
  },

  // Save curriculum
  saveCurriculum: (id: number | string, data: any): Promise<void> => {
    return api.put<void>(`instructor/courses/${id}/curriculum`, data);
  },
};
