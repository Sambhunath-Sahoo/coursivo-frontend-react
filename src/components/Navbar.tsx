import { Link, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link to={ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-foreground">Cours</span>
                <span className="text-red-500">i</span>
                <span className="text-foreground">vo</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link
                to={ROUTES.COURSES}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === ROUTES.COURSES
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Courses
              </Link>
            </div>
          </div>

          {/* Right side - Search, Sign up, Log in */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Type to search"
                className="pl-9 w-64 border-border bg-background"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="hidden sm:inline-flex border-border"
              >
                Sign up
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

