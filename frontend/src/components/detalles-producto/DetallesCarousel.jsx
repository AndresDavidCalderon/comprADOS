import { useMemo, useState } from "react"
import "./DetallesCarousel.css"

export default function DetallesCarousel({ initialProduct }) {
    const photos = useMemo(() => {
        return initialProduct?.photoURLs ?? initialProduct?.photos ?? []
    }, [initialProduct])
    const [currentIndex, setCurrentIndex] = useState(0)

    const hasPhotos = photos.length > 0
    const currentPhoto = hasPhotos ? photos[currentIndex % photos.length] : ""

    const goToPrevious = () => {
        if (!hasPhotos) return
        setCurrentIndex((current) => (current - 1 + photos.length) % photos.length)
    }

    const goToNext = () => {
        if (!hasPhotos) return
        setCurrentIndex((current) => (current + 1) % photos.length)
    }

    return (
        <div className="detalles-carousel">
            <div className="detalles-carousel-main">
                {hasPhotos ? (
                    <img
                        className="detalles-carousel-image"
                        src={currentPhoto}
                        alt={`${initialProduct?.name} - foto ${currentIndex + 1}`}
                    />
                ) : (
                    <div className="detalles-carousel-empty">No hay fotos disponibles</div>
                )}
                {hasPhotos && photos.length > 1 && (
                    <>
                        <button
                            className="detalles-carousel-btn detalles-carousel-btn-prev"
                            type="button"
                            onClick={goToPrevious}
                            aria-label="Ver foto anterior"
                        >
                            ‹
                        </button>
                        <button
                            className="detalles-carousel-btn detalles-carousel-btn-next"
                            type="button"
                            onClick={goToNext}
                            aria-label="Ver foto siguiente"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {hasPhotos && photos.length > 1 && (
                <div className="detalles-carousel-thumbs" aria-label="Miniaturas del producto">
                    {photos.map((photo, index) => (
                        <button
                            key={`${photo}-${index}`}
                            type="button"
                            className={`detalles-carousel-thumb ${index === currentIndex ? "is-active" : ""}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Ver foto ${index + 1}`}
                        >
                            <img src={photo} alt={`${initialProduct?.name} miniatura ${index + 1}`} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}