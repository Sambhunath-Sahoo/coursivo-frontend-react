import { api } from "./http";
import type { Course } from "@/types/course.types";

export interface EnrollmentResponse {
  id: number;
  course: Course;
  enrolledAt: string;
}

export const enrollmentService = {
  /** POST /api/enrollments/courses/{courseId} */
  enrollInCourse: (courseId: number): Promise<EnrollmentResponse> =>
    api.post<EnrollmentResponse>(`enrollments/courses/${courseId}`, {}),

  /** GET /api/enrollments/my-courses */
  getMyEnrollments: (): Promise<EnrollmentResponse[]> =>
    api.get<EnrollmentResponse[]>("enrollments/my-courses"),

  /** GET /api/enrollments/courses/{courseId}/check */
  checkEnrollment: (courseId: number): Promise<{ isEnrolled: boolean }> =>
    api.get<{ isEnrolled: boolean }>(`enrollments/courses/${courseId}/check`),
};
