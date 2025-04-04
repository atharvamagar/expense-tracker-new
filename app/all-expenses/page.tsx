"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns";
import { ShoppingBag, Utensils, Book, AmbulanceIcon as FirstAid, Bus } from "lucide-react"

interface Expense {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

const categoryIcons = {
  food: Utensils,
  education: Book,
  health: FirstAid,
  transportation: Bus,
  grocery: ShoppingBag,
}

export default function AllExpenses() {
  const searchParams = useSearchParams()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('currentMonth') || new Date())
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchExpenses() {
      try {
        console.log("Fetching expenses for month:", selectedMonth)
        const response = await fetch(`/api/expenses?month=${selectedMonth}`);
        console.log("Response:", response)
        if (!response.ok) throw new Error("Failed to fetch expenses")
        const data = await response.json()
        console.log("Fetched expenses:", data)
        setExpenses(data)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [selectedMonth])

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost">← Back</Button>
        </Link>
        <h1 className="text-2xl font-bold">All Expenses</h1>
      </div>

      <div className="mb-4">
        <input
          type="month"
          value={format(new Date(selectedMonth), "yyyy-MM")}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => {
            const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons] || ShoppingBag
            return (
              <Card key={expense._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-full text-red-600">
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{expense.amount.toFixed(2)}</p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}