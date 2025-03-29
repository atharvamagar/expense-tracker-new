"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Home, PawPrint, Smartphone } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { name: "01", income: 2000, expenses: 1400 },
  { name: "02", income: 3000, expenses: 1800 },
  { name: "03", income: 2500, expenses: 2000 },
  { name: "04", income: 4000, expenses: 2400 },
  { name: "05", income: 2000, expenses: 1500 },
  { name: "06", income: 3000, expenses: 2000 },
  { name: "07", income: 2500, expenses: 2100 },
  { name: "08", income: 3500, expenses: 2400 },
]

export default function Transactions() {
  const [activeTab, setActiveTab] = useState("expenses")

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
          <X size={24} />
        </Link>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-full">
        <Button
          variant={activeTab === "income" ? "default" : "ghost"}
          className="flex-1 rounded-full"
          onClick={() => setActiveTab("income")}
        >
          Income
        </Button>
        <Button
          variant={activeTab === "expenses" ? "default" : "ghost"}
          className="flex-1 rounded-full"
          onClick={() => setActiveTab("expenses")}
        >
          Expenses
        </Button>
      </div>

      <Card className="p-4">
        <p className="text-sm text-gray-500">01 Jan 2021 - 01 April 2021</p>
        <p className="text-2xl font-bold mt-1">₹3500.00</p>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey={activeTab} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-4">
        {[
          { icon: Home, color: "bg-yellow-500", name: "Home Rent", amount: -350.0 },
          { icon: PawPrint, color: "bg-blue-500", name: "Pet Groom", amount: -50.0 },
          { icon: Smartphone, color: "bg-emerald-500", name: "Recharge", amount: -100.0 },
        ].map((item, i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${item.color} p-3 rounded-full text-white`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
              </div>
            </div>
            <p className="font-semibold">₹{Math.abs(item.amount).toFixed(2)}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

