"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingBag, Utensils, Book, AmbulanceIcon as FirstAid, Bus, Wallet, Plus, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSwipeable } from "react-swipeable"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeleteTransaction } from "./actions/delete"
import { getExpense, getIncome } from "./actions/getActions"

export interface Expense {
  _id: string; // Store as string because ObjectId is complex to handle in frontend
  description: string;
  amount: number;
  date: string;
  category: string;
  createdAt: Date;
}

interface Income {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

interface CategoryData {
  icon: React.ElementType
  color: string
  bgColor: string
}

const categoryConfig: Record<string, CategoryData> = {
  food: { icon: Utensils, color: "text-orange-500", bgColor: "bg-orange-100" },
  education: { icon: Book, color: "text-blue-500", bgColor: "bg-blue-100" },
  health: { icon: FirstAid, color: "text-red-500", bgColor: "bg-red-100" },
  transportation: { icon: Bus, color: "text-green-500", bgColor: "bg-green-100" },
  grocery: { icon: ShoppingBag, color: "text-purple-500", bgColor: "bg-purple-100" },
  other: { icon: Wallet, color: "text-gray-500", bgColor: "bg-gray-100" },
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [direction, setDirection] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  console.log("Current Month: ",currentMonth);
  
  useEffect(() => {
    async function fetchExpensesAndIncome() {
      try {
        setLoading(true)
        const exp = await getExpense(currentMonth.toISOString().slice(0, 7))
        const inc = await getIncome(currentMonth.toISOString().slice(0, 7))
        
        console.log("Income in useEffect:",inc);
        
        if (!exp) {
          throw new Error("Failed to fetch expenses")
        }
        if (!inc) {
          throw new Error("Failed to fetch income")
        }

        // const totalIncome = await inc.json()
        setExpenses(exp as Expense[])
        // setIncome(totalIncome as Income[])
      } catch (err) {
        setError("Error loading financial data")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExpensesAndIncome()
  }, [currentMonth])
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0)
  const balance = totalIncome - totalExpenses
  const percentSpent = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0

  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || "other"
    if (!acc[category]) acc[category] = 0
    acc[category] += expense.amount
    return acc
  }, {} as Record<string, number>)

  const handlers = useSwipeable({
    onSwipedLeft: () => handleMonthChange(1),
    onSwipedRight: () => handleMonthChange(-1),
    trackMouse: true
  })

  const handleDelete = async (id: string) => {
    try {
      const data = await DeleteTransaction(id)
      if (data.success) {
        alert("Transaction deleted successfully")
        const refreshIncome = await fetch(`/api/income?month=${currentMonth.toISOString().slice(0, 7)}`);
        const updatedIncome = await refreshIncome.json();
        setIncome(updatedIncome);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const now = new Date()
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1))
  
    
  }, [])

  const handleMonthChange = (increment: number) => {
    setDirection(increment)
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + increment)
    console.log("New Date",newDate);
    setCurrentMonth(newDate)
  }

  if (loading) {
    return (
      <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-500">Loading your financial data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 p-6 rounded-lg text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 hover:bg-red-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const renderCategoryIcon = (category: string) => {
    const config = categoryConfig[category] || categoryConfig.other;
    const IconComponent = config.icon;
    return <IconComponent size={16} className={config.color} />;
  };


  return (
    <div className="container max-w-md mx-auto p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback className="bg-blue-500 text-white">👤</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-500">Welcome back</p>
            <h2 className="font-semibold">My Finances</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => handleMonthChange(-1)}
            className="p-2 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-medium text-sm">
            {format(currentMonth, 'MMM yyyy')}
          </span>
          <Button 
            variant="ghost" 
            onClick={() => handleMonthChange(+1)}
            className="p-2 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div {...handlers} className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentMonth.toISOString().slice(0, 7)}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-lg"
          >
            <p className="text-sm opacity-90">Balance</p>
            <h1 className="text-4xl font-bold mt-1">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h1>
            
            <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full" 
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-2 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <p className="opacity-90">Income</p>
                <p className="font-semibold">₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                <p className="opacity-90">Expenses</p>
                <p className="font-semibold">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between gap-3 mt-4">
          <Link href="/add-expense" className="flex-1">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </Link>
          <Link href="/add-income" className="flex-1">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </Link>
        </div>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Spending by Category</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(expensesByCategory).map(([category, amount]) => {
                const config = categoryConfig[category] || categoryConfig.other;
                const percentage = (amount / totalExpenses * 100).toFixed(1);
                const IconComponent = config.icon;
                
                return (
                  <div key={category} className="flex items-center gap-3 p-2 rounded-lg border">
                    <div className={`p-2 rounded-full ${config.bgColor}`}>
                      <IconComponent size={16} className={config.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium capitalize">{category}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">{percentage}%</p>
                        <p className="text-sm font-medium">₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Recent Income</h3>
              <Link href="/all-income" className="text-xs text-blue-600">View All</Link>
            </div>
            <div className="space-y-3">
              {income.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No income recorded this month</p>
              ) : (
                income.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3).map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full text-green-500">
                          <TrendingUp size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.description}</p>
                          <p className="text-xs text-gray-500">{format(new Date(item.date), 'dd MMM yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-green-500">
                          +₹{item.amount ? item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                        </p>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4 mt-4">
  <div className="flex justify-between items-center">
    <h3 className="font-medium">Recent Transactions</h3>
    <Link 
      href={`/all-expenses?month=${currentMonth.toISOString().slice(0, 7)}`} 
      className="text-sm text-blue-600"
    >
      View All
    </Link>
  </div>
  
  <div className="space-y-3">
    {expenses.length === 0 ? (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">No expenses recorded this month</p>
      </Card>
    ) : (
      expenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((expense) => {
          const category = expense.category || "other";
          const config = categoryConfig[category] || categoryConfig.other;
          const IconComponent = config.icon;
          
          return (
            <Card key={expense._id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${config.bgColor}`}>
                  <IconComponent size={20} className={config.color} />
                </div>
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-xs text-gray-500">{format(new Date(expense.date), 'dd MMM yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-red-500">-₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                <button 
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ❌
                </button>
              </div>
            </Card>
          );
        })
    )}
  </div>
</TabsContent>

      </Tabs>
    </div>
  )
}