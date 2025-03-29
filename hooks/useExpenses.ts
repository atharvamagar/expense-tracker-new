import { useState, useEffect, useMemo } from "react"
import { parseISO } from "date-fns"

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("expenses")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [filter, setFilter] = useState({ category: "all", startDate: "", endDate: "" })

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: Date.now().toString() }
    setExpenses((prevExpenses) => [...prevExpenses, newExpense])
  }

  const deleteExpense = (id: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id))
  }

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const categoryMatch = filter.category === "all" || expense.category === filter.category
      const dateMatch =
        (!filter.startDate || expense.date >= filter.startDate) && (!filter.endDate || expense.date <= filter.endDate)
      return categoryMatch && dateMatch
    })
  }, [expenses, filter])

  const monthlyExpenses = useMemo(() => {
    const monthlyData: { [key: string]: number } = {}
    expenses.forEach((expense) => {
      const date = parseISO(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + expense.amount
    })
    return Object.entries(monthlyData).map(([month, total]) => ({ month, total }))
  }, [expenses])

  return {
    expenses: filteredExpenses,
    addExpense,
    deleteExpense,
    setFilter,
    filter,
    monthlyExpenses,
  }
}

