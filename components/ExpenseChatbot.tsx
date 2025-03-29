"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2, ChevronDown } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ExpenseChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your financial assistant. How can I help you with your expenses today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages appear, if already at bottom
  useEffect(() => {
    if (isScrolledToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isScrolledToBottom])

  // Check if scrolled to bottom
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10
      setIsScrolledToBottom(isAtBottom)
    }
  }

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
      setIsScrolledToBottom(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const messageId = Date.now().toString()
    const userMessage = { id: messageId, role: "user" as "user", content: input }
    setInput("")
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    scrollToBottom()

    try {
      const [expenseRes, incomeRes] = await Promise.all([
        fetch(`/api/expenses`),
        fetch(`/api/income`)
      ])
      if (!expenseRes.ok || !incomeRes.ok) {
        throw new Error("Failed to fetch financial data")
      }
    
      const [expenseHistory, incomeHistory] = await Promise.all([
        expenseRes.json(),
        incomeRes.json()
      ])

      const systemMessage = {
        role: "system",
        content: `Here is the user's financial data: 
        - Expenses: ${JSON.stringify(expenseHistory)}
        - Income: ${JSON.stringify(incomeHistory)}
        Use this data to provide relevant financial advice.`,
      }
      const updatedMessages = [systemMessage, ...messages, userMessage]

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // Replace with your OpenRouter API key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-thinking-exp:free", // Adjust model as needed
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      const assistantMessage = { 
        id: `response-${messageId}`, 
        role: "assistant" as "assistant", 
        content: data.choices[0].message.content 
      }
      
      setMessages((prev) => [...prev, assistantMessage])
      scrollToBottom()
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        { 
          id: `error-${messageId}`,
          role: "assistant", 
          content: "I'm sorry, I couldn't process your request. Please try again later." 
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 border-2 border-white"
        >
          <MessageCircle size={24} />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm md:max-w-md lg:max-w-lg"
          >
            <Card className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] flex flex-col shadow-2xl border-2 border-blue-100 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold">Financial Assistant</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 p-0 relative overflow-auto">
                <ScrollArea 
                  className="h-full p-4" 
                  ref={scrollAreaRef}
                  onScroll={handleScroll}
                >
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 max-w-[90%] ${
                            message.role === "assistant" 
                              ? "bg-gray-100 text-gray-800 rounded-bl-none" 
                              : "bg-blue-600 text-white rounded-br-none"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-1">
                              <ReactMarkdown>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <div>{message.content}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-200"></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                </ScrollArea>
                
                {!isScrolledToBottom && messages.length > 3 && (
                  <Button
                    onClick={scrollToBottom}
                    className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 bg-blue-100 hover:bg-blue-200 text-blue-600"
                    size="icon"
                  >
                    <ChevronDown size={18} />
                  </Button>
                )}
              </CardContent>

              <CardFooter className="p-3 border-t bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something about your finances..."
                    disabled={isLoading}
                    className="rounded-full bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()} 
                    className="rounded-full h-10 w-10 p-0"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}