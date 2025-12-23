export type User = {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
  updatedAt: string
}

export type Lesson = {
  id: number
  title: string
  contentUrl: string
  orderIndex: number
  isPreview: boolean
}

export type Section = {
  id: number
  title: string
  orderIndex: number
  lessons: Lesson[]
}

export type Course = {
  id: number
  title: string
  description?: string
  thumbnailUrl?: string
  sections: Section[]
  createdAt?: string
  updatedAt?: string
}

