import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddIncomeFormProps {
  onAddIncome: (income: { description: string; amount: number; date: string; category: string }) => void
}

export function AddIncomeForm({ onAddIncome }: AddIncomeFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description && amount && date && category) {
      onAddIncome({
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
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="allowance">Allowance</SelectItem>
          <SelectItem value="salary">Salary</SelectItem>
          <SelectItem value="bonus">Bonus</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full">
        Add Income
      </Button>
    </form>
  )
}
