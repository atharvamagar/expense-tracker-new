"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function AddExpense() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [errors, setErrors] = useState<{ amount?: string; description?: string; category?: string; customCategory?: string }>({})
  const [expenses, setExpenses] = useState<{ id: string; description: string; category: string; date: string }[]>([]) // Ensure expenses have an id
  const router = useRouter()

  const validateForm = () => {
    let newErrors: { amount?: string; description?: string; category?: string; customCategory?: string } = {}
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Amount must be a positive number."
    if (!description.trim()) newErrors.description = "Description is required."
    if (!category) newErrors.category = "Please select a category."
    if (category === "custom" && !customCategory.trim()) newErrors.customCategory = "Custom category is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          amount: Number.parseFloat(amount),
          date,
          category: category === "custom" ? customCategory : category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add expense")
      }

      const newExpense = await response.json()
      setExpenses([...expenses, newExpense]) // Add new expense to state

      toast({
        title: "Expense added successfully",
        description: "Your expense has been saved to the database.",
      })

      router.push("/")
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete expense")
      }

      setExpenses(expenses.filter(expense => expense.id !== expenseId)) // Remove expense from state

      toast({
        title: "Expense deleted successfully",
        description: "The expense has been removed from the database.",
      })
    } catch (error) {
      console.error("Error deleting expense:", error)
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Add Expenses</h1>
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
          <X size={24} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold">₹</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-4xl font-bold border-none text-center w-40 inline-block"
              placeholder="0"
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="grocery">Grocery</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              {category === "custom" && (
                <>
                  <Input
                    className="mt-2"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                  {errors.customCategory && <p className="text-red-500 text-sm">{errors.customCategory}</p>}
                </>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-500">Description</label>
              <Input
                className="mt-1"
                placeholder="Add Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-500">Date</label>
              <Input className="mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </Card>

        <Button type="submit" className="w-full gradient-button h-12" onClick={handleSubmit}>
          Save
        </Button>
      </form>

      {/* Render expenses with delete buttons */}
      <div className="space-y-4">
        {expenses.map(expense => (
          <Card key={expense.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{expense.description}</p>
              <p className="text-sm text-gray-500">{expense.category}</p>
              <p className="text-sm text-gray-500">{expense.date}</p>
            </div>
            <Button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500">
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}