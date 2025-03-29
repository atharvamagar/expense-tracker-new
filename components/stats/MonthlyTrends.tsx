import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO } from "date-fns"

interface Expense {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

interface MonthlyTrendsProps {
  expenses: Expense[]
}

export function MonthlyTrends({ expenses }: MonthlyTrendsProps) {
  const monthlyData = expenses.reduce((acc: { [key: string]: number }, expense) => {
    const month = format(parseISO(expense.date), "MMM yyyy")
    acc[month] = (acc[month] || 0) + expense.amount
    return acc
  }, {})

  const data = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Monthly Spending Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

    