import { API_URL } from "@/lib/constants"
import type { Course } from "@/types"

export const getCourses = async (): Promise<Course[]> => {
    try {
        const response = await fetch(`${API_URL}/courses`)
        if (!response.ok) {
            throw new Error('Failed to fetch courses')
        }
        return response.json()
    } catch (error) {
        console.error('Error fetching courses:', error)
        throw error
    }
}

export const getCourse = async (courseId: number): Promise<Course> => {
    try {
        const response = await fetch(`${API_URL}/courses/${courseId}`)
        if (!response.ok) {
            throw new Error('Failed to fetch course')
        }
        return response.json()
    } catch (error) {
        console.error('Error fetching course:', error)
        throw error
    }
}

