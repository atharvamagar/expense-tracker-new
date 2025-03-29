import type { Expense } from "../hooks/useExpenses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExpenseAnalysisProps {
  expenses: Expense[]
}

export function ExpenseAnalysis({ expenses }: ExpenseAnalysisProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹{averageExpense.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {topCategory ? `${topCategory[0]}: ₹${topCategory[1].toFixed(2)}` : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

