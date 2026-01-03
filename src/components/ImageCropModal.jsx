import { useState, useRef, useEffect } from 'react'

export default function ImageCropModal({ imageSrc, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState(300)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  // Calculate responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const maxSize = Math.min(containerWidth - 32, 400) // Max 400px, with 32px padding
        const minSize = Math.max(maxSize, 200) // Min 200px
        setCanvasSize(minSize)
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      drawCanvas()
    }
    img.src = imageSrc
  }, [imageSrc])

  useEffect(() => {
    drawCanvas()
  }, [zoom, rotation, position, canvasSize])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageRef.current) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvasSize
    canvas.height = canvasSize

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Save context state
    ctx.save()

    // Translate to center
    ctx.translate(canvasSize / 2, canvasSize / 2)

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180)

    // Apply zoom and position
    const scaledWidth = imageRef.current.width * zoom
    const scaledHeight = imageRef.current.height * zoom

    ctx.drawImage(
      imageRef.current,
      -scaledWidth / 2 + position.x,
      -scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    )

    // Restore context
    ctx.restore()

    // Draw circular mask overlay
    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

    // Draw circle border
    ctx.strokeStyle = '#F97316'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 2, 0, Math.PI * 2)
    ctx.stroke()
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    })
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    if (!isDragging) return
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    })
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create final 200x200 canvas
    const finalCanvas = document.createElement('canvas')
    finalCanvas.width = 200
    finalCanvas.height = 200
    const finalCtx = finalCanvas.getContext('2d')

    // Draw scaled down version
    finalCtx.drawImage(canvas, 0, 0, 200, 200)

    // Convert to blob
    finalCanvas.toBlob((blob) => {
      onSave(blob)
    }, 'image/jpeg', 0.8)
  }

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90)
  }

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div 
        ref={containerRef}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 my-8"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h3 className="text-lg sm:text-xl font-bold text-white text-center">Adjust Your Photo</h3>
          <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">Drag, zoom, and rotate to fit</p>
        </div>

        {/* Canvas Container */}
        <div className="p-4 sm:p-6">
          <div className="relative mx-auto flex items-center justify-center" style={{ minHeight: `${canvasSize}px` }}>
            <canvas
              ref={canvasRef}
              className="cursor-move touch-none rounded-full"
              style={{ width: `${canvasSize}px`, height: `${canvasSize}px` }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              Drag to adjust
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            {/* Zoom */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-medium text-gray-300">Zoom</label>
                <span className="text-xs text-gray-400">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">Rotate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleRotateLeft}
                  className="px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Left
                </button>
                <button
                  type="button"
                  onClick={handleRotateRight}
                  className="px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  Right
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg font-medium transition-all text-xs sm:text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
