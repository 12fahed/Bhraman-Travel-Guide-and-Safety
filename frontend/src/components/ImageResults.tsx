
const dummyImages = [
  { id: 1, src: "/placeholder.svg?height=100&width=100", alt: "Image 1" },
  { id: 2, src: "/placeholder.svg?height=100&width=100", alt: "Image 2" },
  { id: 3, src: "/placeholder.svg?height=100&width=100", alt: "Image 3" },
  { id: 4, src: "/placeholder.svg?height=100&width=100", alt: "Image 4" },
]

export default function ImageResults() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Image Results</h2>
      <div className="grid grid-cols-2 gap-4">
        {dummyImages.map((image) => (
          <div key={image.id} className="border rounded-lg overflow-hidden">
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              width={100}
              height={100}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

