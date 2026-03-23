import { useState, type ImgHTMLAttributes } from 'react'

type ImgProps = ImgHTMLAttributes<HTMLImageElement>

interface SafeImageProps extends ImgProps {
  fallbackSrc: string
}

export function SafeImage({ src, fallbackSrc, alt, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
      }}
    />
  )
}
