import { useEffect, useState } from "react"

const TAGLINE = "Real World Assets on OPN Chain"

export default function Logo({ size = 32, showText = false }) {
  const [displayed, setDisplayed] = useState("")
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!showText) return
    if (idx < TAGLINE.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + TAGLINE[idx])
        setIdx(i => i + 1)
      }, 60)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDisplayed("")
        setIdx(0)
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [idx, showText])

  return (
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes hexPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
            .hex-outer { animation: hexPulse 3s ease-in-out infinite; }
            .hex-inner { animation: hexPulse 3s ease-in-out infinite 1s; }
          `}</style>
        </defs>
        <polygon className="hex-outer"
          points="40,2 74,21 74,59 40,78 6,59 6,21"
          fill="none" stroke="#4F6EF7" strokeWidth="2.5" strokeLinejoin="round"/>
        <polygon className="hex-inner"
          points="40,14 63,27 63,53 40,66 17,53 17,27"
          fill="none" stroke="#00D4FF" strokeWidth="1.2" strokeLinejoin="round"/>
        <text x="40" y="48" textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight="700" fontSize="22" fill="#4F6EF7" letterSpacing="1">OPN</text>
      </svg>
      {showText && (
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:600,color:"var(--text)",letterSpacing:"-0.5px"}}>
            OPN<span style={{color:"#00D4FF"}}>fi</span>
          </span>
          <span style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.5px",minWidth:220,minHeight:16}}>
            {displayed}<span style={{animation:"hexPulse 1s infinite",display:"inline-block",marginLeft:1,color:"#4F6EF7"}}>|</span>
          </span>
        </div>
      )}
    </div>
  )
}
