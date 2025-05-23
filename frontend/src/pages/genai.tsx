
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface ChatMessageProps {
    content: string
    isUser: boolean
  }
  
  export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
      >
        <div className={`max-w-md p-1 rounded-lg ${isUser ? "bg-primary text-secondary pr-2" : "bg-secondary text-secondary-foreground pl-2"}`}>
        <MarkdownRenderer content={content} />
        </div>
      </motion.div>
    )
  }
  
  
export default function Genai() {
    const [prompt, setPrompt] = useState("")
    const [responses, setResponses] = useState([])
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef(null)
    const { toast } = useToast()
  
    useEffect(() => {
      fetchResponses()
    }, [])
  
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [responses])
  
    const fetchResponses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/responses")
        if (res.data.success) {
          setResponses(res.data.responses)
        }
      } catch (error) {
        console.error("Error fetching responses:", error)
        toast({
          title: "Error",
          description: "Failed to fetch responses. Please try again.",
          variant: "destructive",
        })
      }
    }
  
    const handleGenerate = async () => {
      if (!prompt.trim()) {
        toast({
          title: "Empty Prompt",
          description: "Please enter a prompt before generating.",
          variant: "destructive",
        })
        return
      }
      setLoading(true)
  
      try {
        const res = await axios.post("http://localhost:3000/api/generate", { prompt })
        if (res.data.success) {
          setPrompt("")
          fetchResponses()
        } else {
          throw new Error("Failed to generate response.")
        }
      } catch (error) {
        console.error("Error generating response:", error)
        toast({
          title: "Error",
          description: "Failed to generate response. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
          {/* <VoiceGenerator /> */}
  
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-6 "
        >
          Do you remeber? corner
        </motion.h1>
  
        <div className="flex-grow overflow-auto mb-4 space-y-4">
          <AnimatePresence>
            {responses.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage content={item.prompt} isUser={true} />
                <ChatMessage content={item.response} isUser={false} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
  
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-end space-x-2"
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="flex-grow resize-none"
          />
          <Button onClick={handleGenerate} disabled={loading} className="h-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </motion.div>
      </div>
    )
  }
  
  