import { MobileNav } from "./components/mobile-nav"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pb-16">
      {children}
      <MobileNav />
    </div>
  )
}

