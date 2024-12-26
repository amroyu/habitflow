export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-64px)] -mt-16">
      {children}
    </div>
  )
}
