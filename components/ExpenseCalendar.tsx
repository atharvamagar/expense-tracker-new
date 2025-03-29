import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

interface Expense {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

interface ExpenseCalendarProps {
  expenses: Expense[]
}

export function ExpenseCalendar({ expenses }: ExpenseCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const expensesByDate = expenses.reduce(
    (acc, expense) => {
      const date = expense.date.split("T")[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(expense)
      return acc
    },
    {} as Record<string, Expense[]>,
  )

  const selectedDateExpenses = selectedDate ? expensesByDate[format(selectedDate, "yyyy-MM-dd")] || [] : []

  return (
    <div className="space-y-4">
      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-2">
            Expenses for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}
          </h3>
          {selectedDateExpenses.length > 0 ? (
            <ul className="space-y-2">
              {selectedDateExpenses.map((expense) => (
                <li key={expense._id} className="flex justify-between items-center">
                  <span>{expense.description}</span>
                  <span className="font-semibold">₹{expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses for this date.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

