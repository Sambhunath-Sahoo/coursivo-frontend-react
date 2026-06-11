import { api } from "./http";
import type { Course, DifficultyLevel, PageResponse } from "@/types/course.types";

export interface CourseSearchParams {
  q?: string;
  difficulty?: DifficultyLevel | "";
  priceType?: "ALL" | "FREE" | "PAID";
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  page?: number;
  size?: number;
}

export const courseService = {
  // Search published courses — server-side filtering, sorting, and pagination.
  // Default limit is 50 courses per page when no params are sent.
  searchCourses: (params: CourseSearchParams = {}, signal?: AbortSignal): Promise<PageResponse<Course>> => {
    const query = new URLSearchParams();
    if (params.q)         query.set("q", params.q);
    if (params.difficulty) query.set("difficulty", params.difficulty);
    if (params.priceType && params.priceType !== "ALL") query.set("priceType", params.priceType);
    if (params.sort && params.sort !== "newest") query.set("sort", params.sort);
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));

    const qs = query.toString();
    return api.get<PageResponse<Course>>(qs ? `courses?${qs}` : "courses", { signal });
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
