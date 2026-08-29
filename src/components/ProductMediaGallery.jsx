import { useState } from 'react'

function ProductMediaGallery({ product, variant = 'quick' }) {
  const [selectedMedia, setSelectedMedia] = useState({ type: 'image', index: 0 })
  const gallery = product.gallery.length >= 4
    ? product.gallery.slice(0, 4)
    : Array.from({ length: 4 }, (_, index) => product.gallery[index % product.gallery.length])
  const selectedImage = selectedMedia.type === 'image' ? gallery[selectedMedia.index] : null

  return (
    <div className={`product-media-gallery product-media-${variant}`}>
      <div className={variant === 'detail' ? 'detail-main-image' : 'quick-view-image-wrap'}>
        {selectedImage ? (
          <img
            src={selectedImage.src}
            style={{ objectPosition: selectedImage.position, objectFit: selectedImage.fit || 'cover' }}
            alt={selectedImage.alt}
          />
        ) : product.videoSrc ? (
          <video
            className="product-video"
            src={product.videoSrc}
            poster={product.videoPoster || product.image}
            controls
            playsInline
          >
            Your browser does not support the product video.
          </video>
        ) : (
          <div className="video-placeholder" role="status">
            <span className="video-placeholder-icon" aria-hidden="true">▶</span>
            <p>Product Video</p>
            <small>A closer look in the light is coming soon.</small>
          </div>
        )}
      </div>

      <div className="media-thumbnails" aria-label="Product media">
        {gallery.map((image, index) => (
          <button
            className={selectedMedia.type === 'image' && selectedMedia.index === index ? 'media-thumbnail active' : 'media-thumbnail'}
            type="button"
            key={`${image.position}-${index}`}
            onClick={() => setSelectedMedia({ type: 'image', index })}
            aria-label={`View product image ${index + 1}`}
            aria-pressed={selectedMedia.type === 'image' && selectedMedia.index === index}
          >
            <img src={image.src} style={{ objectPosition: image.position, objectFit: image.fit || 'cover' }} alt="" />
          </button>
        ))}
        <button
          className={selectedMedia.type === 'video' ? 'media-thumbnail video-thumbnail active' : 'media-thumbnail video-thumbnail'}
          type="button"
          onClick={() => setSelectedMedia({ type: 'video', index: 0 })}
          aria-label={product.videoLabel || 'View product video'}
          aria-pressed={selectedMedia.type === 'video'}
        >
          <span aria-hidden="true">▶</span>
          <small>Video</small>
        </button>
      </div>
    </div>
  )
}

export default ProductMediaGallery
