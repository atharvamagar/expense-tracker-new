"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, BarChart2, Settings } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/stats", icon: BarChart2, label: "Stats" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === item.href ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

