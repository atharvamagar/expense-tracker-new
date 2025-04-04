"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp } from "lucide-react"

interface Income {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

export default function AllIncome() {
  const searchParams = useSearchParams()
  const [income, setIncome] = useState<Income[]>([])
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('formattedMonth') ||new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    async function fetchIncome() {
      try {
        const response = await fetch(`/api/income?month=${selectedMonth}`)
        if (!response.ok) throw new Error("Failed to fetch income")
        const data = await response.json()
      console.log(data);
      
        setIncome(data)
      } catch (error) {
        console.error("Error fetching income:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIncome()
  }, [selectedMonth])
  
  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost">← Back</Button>
        </Link>
        <h1 className="text-2xl font-bold">All Income</h1>
      </div>

      <div className="mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {income.map((inc) => {
            return (
              <Card key={inc._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full text-green-500">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{inc.description}</p>
                    <p className="text-sm text-gray-500">{new Date(inc.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{inc.amount}</p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}