import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to Coursivo</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your application is ready with Tailwind CSS and shadcn/ui!
          </p>
          <Link
            to={ROUTES.COURSES}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}

