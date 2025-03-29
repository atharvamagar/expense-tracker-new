import type { Expense } from "../hooks/useExpenses"
import { Button } from "@/components/ui/button"

interface ExpenseListProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
          <div>
            <h3 className="font-semibold">{expense.description}</h3>
            <p className="text-sm text-gray-500">
              {expense.category} - {expense.date}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-bold">₹{expense.amount.toFixed(2)}</span>
            <Button variant="destructive" size="sm" onClick={() => onDeleteExpense(expense.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

