"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearToken, isAuthenticated } from "@/lib/auth"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(isAuthenticated())
  }, [pathname])

  function handleLogout() {
    clearToken()
    setAuthed(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold text-foreground">
            VenueBooker
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className={cn(
                "text-sm hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/70",
              )}
            >
              Home
            </Link>

            {!authed ? (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "text-sm hover:text-foreground/80",
                    pathname === "/login" ? "text-foreground" : "text-foreground/70",
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    "text-sm hover:text-foreground/80",
                    pathname === "/register" ? "text-foreground" : "text-foreground/70",
                  )}
                >
                  Register
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-sm text-foreground/70 hover:text-foreground">
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
