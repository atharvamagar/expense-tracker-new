import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddExpenseFormProps {
  onAddExpense: (expense: { description: string; amount: number; date: string; category: string }) => void
}

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description && amount && date && category) {
      onAddExpense({
        description,
        amount: Number.parseFloat(amount),
        date,
        category,
      })
      setDescription("")
      setAmount("")
      setDate("")
      setCategory("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
        min="0"
        step="0.01"
      />
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Select value={category} onValueChange={setCategory} required>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="transportation">Transportation</SelectItem>
          <SelectItem value="grocery">Grocery</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  )
}

