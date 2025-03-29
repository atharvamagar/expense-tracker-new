import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { format, parseISO, subMonths } from "date-fns"

interface Expense {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

interface ExpenseOverviewProps {
  expenses: Expense[]
  timeframe: string
  selectedMonth: Date
}

export function ExpenseOverview({ expenses, timeframe, selectedMonth }: ExpenseOverviewProps) {
  // Use selectedMonth in your calculations
  const currentDate = new Date()
  const startDate =
    timeframe === "year"
      ? subMonths(currentDate, 12)
      : timeframe === "month"
        ? subMonths(currentDate, 1)
        : subMonths(currentDate, 1 / 4)

  const filteredExpenses = expenses.filter(
    (expense) => new Date(expense.date) >= startDate && new Date(expense.date) <= currentDate,
  )

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const avgPerDay = totalSpent / (timeframe === "year" ? 365 : timeframe === "month" ? 30 : 7)

  const dailyData = filteredExpenses.reduce((acc: any[], expense) => {
    const date = format(parseISO(expense.date), "MMM dd")
    const existingDay = acc.find((d) => d.date === date)

    if (existingDay) {
      existingDay.amount += expense.amount
    } else {
      acc.push({ date, amount: expense.amount })
    }

    return acc
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Spending Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Over the past {timeframe}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{avgPerDay.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per day</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Number of Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filteredExpenses.length}</div>
          <p className="text-xs text-muted-foreground">Total transactions</p>
        </CardContent>
      </Card>
    </div>
  )
}

