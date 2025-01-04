export default function TestSVG() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Testing SVG Files</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Logo Light:</h2>
          <img 
            src="/logos/logo-light.svg" 
            alt="Logo Light" 
            className="w-[120px] h-[30px] border"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Logo Dark:</h2>
          <img 
            src="/logos/logo-dark.svg" 
            alt="Logo Dark" 
            className="w-[120px] h-[30px] border"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Google:</h2>
          <img 
            src="/google.svg" 
            alt="Google" 
            className="w-[18px] h-[18px] border"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Twitter:</h2>
          <img 
            src="/twitter.svg" 
            alt="Twitter" 
            className="w-[18px] h-[18px] border"
          />
        </div>
      </div>
    </div>
  )
}
