import { api } from "./http";

export interface LessonResponse {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  content: string | null;
  order: number;
  durationMinutes: number | null;
  isPreviewable: boolean;
  createdAt: string;
  updatedAt: string;
}

export const lessonService = {
  /** GET /api/instructor/courses/{courseId}/lessons — public, no auth needed */
  getLessonsByCourse: (courseId: number): Promise<LessonResponse[]> =>
    api.get<LessonResponse[]>(`instructor/courses/${courseId}/lessons`),
};
