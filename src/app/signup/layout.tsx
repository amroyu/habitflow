export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-64px)] -mt-[64px]">
      {children}
    </div>
  )
}
