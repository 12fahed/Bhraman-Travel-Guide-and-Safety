"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const ChatUI = () => {
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; content: string }>>([])
  const [input, setInput] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages")
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { type: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    setLoading(true)
    setError("")
    setAudioUrl("")

    try {
      const response = await fetch("http://localhost:5000/generatevoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          // tone: "mild, motivating, manly",
          max_tokens: 50,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate audio")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setMessages([...newMessages, { type: "bot", content: url }])
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = () => {
    // Implement voice input functionality here
    console.log("Voice input not implemented")
  }

  return (
    <Card className="w-full max-w-md mx-auto h-[90vh] ">
      <CardHeader>
      <h1 className="text-3xl font-bold text-primary text-center">Talk With Your</h1>
      <p className="text-3xl font-bold text-primary font-serif text-center">AI Fam</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg p-2 ${message.type === "user" ? "bg-primary text-secondary-foreground" : "bg-secondary"}`}>
              {message.type === "user" ? (
                message.content
              ) : (
                <audio controls src={message.content}>
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} disabled={loading}>
          Send
        </Button>
        <Button onClick={handleVoiceInput} variant="outline">
          🎤
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ChatUI

