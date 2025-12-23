import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCourse } from '@/services/course.service'
import type { Course } from '@/types'
import { ROUTES } from '@/constants/routes'

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError('Course ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const courseId = parseInt(id)
        const courseData = await getCourse(courseId)
        setCourse(courseData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course')
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading course details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || 'Course not found'}</p>
            <Link
              to={ROUTES.COURSES}
              className="text-primary hover:underline"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          to={ROUTES.COURSES}
          className="mb-4 inline-block text-primary hover:underline"
        >
          ← Back to Courses
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          
          {course.description && (
            <p className="text-muted-foreground text-lg mb-4">{course.description}</p>
          )}
        </div>

        {course.thumbnailUrl ? (
          <div className="mb-6">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full max-w-2xl h-64 object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="mb-6 w-full max-w-2xl h-64 bg-muted flex items-center justify-center rounded-lg">
            <span className="text-muted-foreground">No Thumbnail</span>
          </div>
        )}

        {course.sections && course.sections.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Course Content</h2>
            {course.sections.map((section) => (
              <div key={section.id} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                {section.lessons && section.lessons.length > 0 ? (
                  <div className="space-y-3">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border-b border-border pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium mb-1">{lesson.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Order: {lesson.orderIndex}</span>
                              {lesson.isPreview && (
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                                  Preview
                                </span>
                              )}
                            </div>
                          </div>
                          {lesson.contentUrl && (
                            <a
                              href={lesson.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                              Watch Video
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No lessons in this section</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No course content available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

