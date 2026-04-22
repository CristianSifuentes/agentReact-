'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ProductImage } from '@/lib/types/product'

type Props = {
  images: ProductImage[]
  initialIndex: number
}

export function ProductImageGallery({ images, initialIndex }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const activeImage = images[activeIndex]

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, goNext, goPrev])

  if (!activeImage) return null

  return (
    <div>
      {/*
       * Aspect-ratio container prevents layout shift while the image loads.
       * Set via CSS: .product-image-container { aspect-ratio: 4/3; }
       */}
      <div className="product-image-container">
        <button
          type="button"
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          onClick={() => setIsZoomed((z) => !z)}
          onDoubleClick={() => setLightboxOpen(true)}
        >
          {/*
           * fetchpriority="high" + loading="eager" on the hero image:
           * This is almost always the LCP element. Telling the browser to
           * prioritise it cuts LCP by 200-400ms on typical connections.
           */}
          <img
            key={activeImage.id}
            src={activeImage.url}
            alt={activeImage.alt}
            width={activeImage.width}
            height={activeImage.height}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className={isZoomed ? 'zoomed' : undefined}
          />
        </button>
      </div>

      {images.length > 1 && (
        <>
          <button type="button" onClick={goPrev} aria-label="Previous image">
            ‹
          </button>
          <button type="button" onClick={goNext} aria-label="Next image">
            ›
          </button>

          <ol aria-label="Image thumbnails" role="list">
            {images.map((image, index) => (
              <li key={image.id}>
                <button
                  type="button"
                  aria-label={`View image ${index + 1}: ${image.alt}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Thumbnails are below the fold on most viewports — lazy-load them. */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </li>
            ))}
          </ol>
        </>
      )}

      {lightboxOpen && (
        <dialog open aria-label="Image lightbox">
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            width={activeImage.width}
            height={activeImage.height}
            loading="eager"
            decoding="async"
          />
          <button type="button" onClick={goPrev} aria-label="Previous image">‹</button>
          <button type="button" onClick={goNext} aria-label="Next image">›</button>
        </dialog>
      )}
    </div>
  )
}
