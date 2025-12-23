import Courses from './pages/Courses'
import Home from './pages/Home'
import CourseDetails from './pages/CourseDetails'
import { ROUTES } from './constants/routes'

/**
 * Route definitions
 * Centralized route configuration for better maintainability
 */
export const routes = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.COURSES, element: <Courses /> },
  { path: ROUTES.COURSE_DETAIL, element: <CourseDetails /> },
]

