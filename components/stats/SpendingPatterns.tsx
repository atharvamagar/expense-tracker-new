import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"

interface Expense {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

interface SpendingPatternsProps {
  expenses: Expense[]
  timeframe: string
}

export function SpendingPatterns({ expenses, timeframe }: SpendingPatternsProps) {
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount)
  const highestExpense = sortedExpenses[0]
  const averageAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length

  const expensesByDay = expenses.reduce((acc: { [key: string]: number }, expense) => {
    const day = format(parseISO(expense.date), "EEEE")
    acc[day] = (acc[day] || 0) + expense.amount
    return acc
  }, {})

  const highestSpendingDay = Object.entries(expensesByDay).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Highest Expense</CardTitle>
        </CardHeader>
        <CardContent>
          {highestExpense ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">₹{highestExpense.amount.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{highestExpense.description}</div>
              <div className="text-sm text-muted-foreground">{format(parseISO(highestExpense.date), "PP")}</div>
            </div>
          ) : (
            <div>No expenses recorded</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{averageAmount.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Per transaction</div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Spending Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Highest Spending Day</div>
              <div className="text-2xl font-bold">
                {highestSpendingDay ? (
                  <>
                    {highestSpendingDay[0]}
                    <span className="text-sm text-muted-foreground ml-2">₹{highestSpendingDay[1].toFixed(2)}</span>
                  </>
                ) : (
                  "No data"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

