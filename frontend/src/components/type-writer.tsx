import { useState, useEffect } from "react"

const phrases = [
  "Experience the Best in Travel",
  "What's in your mind?",
  "Not able to Decide where to?",
  "All in one platform",
  "Find people with same spirit as You",
]

export function TypeWriter() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const currentPhrase = phrases[currentPhraseIndex]

        if (!isDeleting) {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1))

          if (currentText === currentPhrase) {
            setIsDeleting(true)
            setTimeout(() => {}, 2000) // Wait before starting to delete
          }
        } else {
          setCurrentText(currentPhrase.substring(0, currentText.length - 1))

          if (currentText === "") {
            setIsDeleting(false)
            setCurrentPhraseIndex((prevIndex) => (prevIndex === phrases.length - 1 ? 0 : prevIndex + 1))
          }
        }
      },
      isDeleting ? 50 : 100,
    ) // Faster deletion, slower typing

    return () => clearTimeout(timeout)
  }, [currentText, currentPhraseIndex, isDeleting])

  return (
    <span className="text-gray-400 text-sm sm:text-lg max-w-xl">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

