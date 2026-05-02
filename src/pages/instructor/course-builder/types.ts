// Types for Course Builder
export interface Lesson {
  id: string;
  title: string;
  type: "video" | "article";
  duration: string;
  isPreview: boolean;
  videoUrl?: string;
  content?: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

export interface CourseData {
  title: string;
  subtitle: string;
  category: string;
  subcategory: string;
  level: string;
  language: string;
  price: string;
}

// Demo data
export const initialSections: Section[] = [
  {
    id: "section-1",
    title: "Introduction to React",
    isExpanded: true,
    lessons: [
      {
        id: "lesson-1-1",
        title: "Welcome to the Course",
        type: "video",
        duration: "5:30",
        isPreview: true,
      },
      {
        id: "lesson-1-2",
        title: "What is React?",
        type: "video",
        duration: "12:45",
        isPreview: false,
      },
      {
        id: "lesson-1-3",
        title: "Setting Up Your Development Environment",
        type: "article",
        duration: "10 min read",
        isPreview: false,
      },
    ],
  },
  {
    id: "section-2",
    title: "React Fundamentals",
    isExpanded: true,
    lessons: [
      {
        id: "lesson-2-1",
        title: "Components and JSX",
        type: "video",
        duration: "18:20",
        isPreview: false,
      },
      {
        id: "lesson-2-2",
        title: "Props and State",
        type: "video",
        duration: "22:15",
        isPreview: false,
      },
      {
        id: "lesson-2-3",
        title: "Event Handling",
        type: "video",
        duration: "15:40",
        isPreview: false,
      },
    ],
  },
  {
    id: "section-3",
    title: "Hooks in React",
    isExpanded: false,
    lessons: [
      {
        id: "lesson-3-1",
        title: "Introduction to Hooks",
        type: "video",
        duration: "14:30",
        isPreview: false,
      },
      {
        id: "lesson-3-2",
        title: "useState Deep Dive",
        type: "video",
        duration: "20:00",
        isPreview: false,
      },
      {
        id: "lesson-3-3",
        title: "useEffect and Side Effects",
        type: "video",
        duration: "25:10",
        isPreview: false,
      },
    ],
  },
];

export const initialCourseData: CourseData = {
  title: "Complete React Developer Course 2024",
  subtitle:
    "Learn React from scratch with hands-on projects and real-world examples",
  category: "Development",
  subcategory: "Web Development",
  level: "Beginner",
  language: "English",
  price: "₹499",
};
