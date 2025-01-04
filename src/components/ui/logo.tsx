interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 24, text: 72 },
  md: { icon: 30, text: 90 },
  lg: { icon: 40, text: 120 }
}

export function Logo({ className = "", showText = true, size = 'md' }: LogoProps) {
  const dimensions = sizes[size]
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative" style={{ width: dimensions.icon, height: dimensions.icon }}>
        <img
          src="/logos/icon-light.svg"
          alt="HabitFlow Icon Light"
          width={dimensions.icon}
          height={dimensions.icon}
          className="w-full h-full object-contain dark:hidden"
        />
        <img
          src="/logos/icon-dark.svg"
          alt="HabitFlow Icon Dark"
          width={dimensions.icon}
          height={dimensions.icon}
          className="w-full h-full object-contain hidden dark:block"
        />
      </div>
      {showText && (
        <div className="relative" style={{ width: dimensions.text, height: dimensions.icon }}>
          <img
            src="/logos/text-light.svg"
            alt="HabitFlow Text Light"
            width={dimensions.text}
            height={dimensions.icon}
            className="w-full h-full object-contain dark:hidden"
          />
          <img
            src="/logos/text-dark.svg"
            alt="HabitFlow Text Dark"
            width={dimensions.text}
            height={dimensions.icon}
            className="w-full h-full object-contain hidden dark:block"
          />
        </div>
      )}
    </div>
  )
}
