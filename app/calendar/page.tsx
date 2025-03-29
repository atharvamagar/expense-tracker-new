"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Loader2Icon, PlusIcon, XIcon, ChevronLeft, ChevronRight, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, isSameMonth, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface Expense {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

interface Income {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

export default function CalendarPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomeRecords, setIncomeRecords] = useState<Income[]>([]) // Store income records
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [total, setTotal] = useState(0)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [showTooltip, setShowTooltip] = useState<{ day: Date, x: number, y: number } | null>(null)
  
  useEffect(() => {
    async function fetchExpensesAndIncome() {
      try {
        setLoading(true)
        const expensesResponse = await fetch("/api/expenses")
        const incomeResponse = await fetch("/api/income")
  
        if (!expensesResponse.ok || !incomeResponse.ok) {
          throw new Error("Failed to fetch data")
        }
  
        const expensesData = await expensesResponse.json()
        const incomeData = await incomeResponse.json()
  
        setExpenses(expensesData)
        setIncomeRecords(incomeData) // Store income records
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpensesAndIncome()
  }, [])

  useEffect(() => {
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return isSameMonth(expenseDate, currentMonth)
    })
    
    const monthlyTotalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const monthlyTotalIncome = incomeRecords.reduce((sum, inc) => {
      const incomeDate = new Date(inc.date)
      return isSameMonth(incomeDate, currentMonth) ? sum + inc.amount : sum
    }, 0)
    setTotal(monthlyTotalIncome - monthlyTotalExpenses) // Calculate remaining balance
  }, [expenses, incomeRecords, currentMonth])

  const CalendarDay = ({ day }: { day: Date }) => {
    const isCurrentMonth = isSameMonth(day, currentMonth)
    const isToday = isSameDay(day, new Date())
    const dayExpenses = expenses.filter(expense => isSameDay(new Date(expense.date), day))
    const dayIncome = incomeRecords.filter(inc => isSameDay(new Date(inc.date), day)).reduce((sum, inc) => sum + inc.amount, 0) // Calculate daily income
    const dayExpenseTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    const handleQuickView = (e: React.MouseEvent) => {
      e.stopPropagation()
      const rect = e.currentTarget.getBoundingClientRect()
      setShowTooltip({ 
        day, 
        x: rect.left + window.scrollX, 
        y: rect.bottom + window.scrollY 
      })
    }

    return (
      <div
        onClick={() => setSelectedDay(day)}
        className={cn(
          "border relative p-1 md:p-2 h-16 md:h-24 cursor-pointer overflow-hidden rounded-md flex flex-col", 
          isCurrentMonth ? "bg-white" : "bg-gray-100 text-gray-400",
          isToday ? "border-blue-500 border-2" : "border-gray-200",
          "hover:bg-gray-50 transition-colors"
        )}
      >
        <div className={cn(
          "text-xs md:text-sm font-medium flex justify-between items-center",
          isToday ? "text-blue-500" : ""
        )}>
          <span>{day.getDate()}</span>
          {(dayIncome > 0 || dayExpenseTotal > 0) && (
            <button 
              onClick={handleQuickView}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
            >
              <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          )}
        </div>
        <div className="space-y-0.5 mt-1 flex flex-col">
          {dayIncome > 0 && (
            <div className="text-xs text-blue-500 truncate">
              +₹{dayIncome.toFixed(0)}
            </div>
          )}
          {dayExpenseTotal > 0 && (
            <div className="text-xs text-red-500 truncate">
              -₹{dayExpenseTotal.toFixed(0)}
            </div>
          )}
          {dayExpenses.length > 0 && (
            <div className="hidden md:block text-xs text-gray-600 truncate">
              {dayExpenses[0].description}
              {dayExpenses.length > 1 && ` (+${dayExpenses.length - 1} more)`}
            </div>
          )}
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Close tooltip when clicking outside
    const handleClickOutside = () => {
      setShowTooltip(null)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1))
  }

  const generateCalendarDays = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const startDate = new Date(monthStart)
    const endDate = new Date(monthEnd)
    
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)
    
    const remainingDays = 6 - endDate.getDay()
    endDate.setDate(endDate.getDate() + remainingDays)
    
    const days = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="container mx-auto p-2 md:p-4 max-w-5xl bg-white text-black">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Monthly summary */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <Card className="p-3 bg-blue-50">
              <div className="text-xs md:text-sm text-blue-700">Income</div>
              <div className="text-lg md:text-xl font-semibold">₹{incomeRecords.reduce((sum, inc) => sum + inc.amount, 0).toFixed(0)}</div>
            </Card>
            <Card className="p-3 bg-red-50">
              <div className="text-xs md:text-sm text-red-700">Expenses</div>
              <div className="text-lg md:text-xl font-semibold">₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(0)}</div>
            </Card>
            <Card className="p-3 bg-green-50">
              <div className="text-xs md:text-sm text-green-700">Remaining</div>
              <div className="text-lg md:text-xl font-semibold">₹{total.toFixed(0)}</div>
            </Card>
          </div>

          {/* Calendar header */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={goToPreviousMonth} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <h2 className="text-lg md:text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
            <button onClick={goToNextMonth} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1">
            {weekdays.map(day => (
              <div key={day} className="text-center text-xs md:text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {generateCalendarDays().map((day, index) => (
              <CalendarDay key={index} day={day} />
            ))}
          </div>

          {/* Tooltip for quick view */}
          {showTooltip && (
            <div 
              className="absolute bg-white shadow-lg rounded-md p-2 z-50 w-48 border border-gray-200"
              style={{ 
                top: showTooltip.y + 'px', 
                left: showTooltip.x + 'px',
                transform: 'translateX(-50%)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-sm font-medium">{format(showTooltip.day, "MMMM dd, yyyy")}</div>
              <div className="text-xs space-y-1 mt-1">
                {incomeRecords.filter(inc => isSameDay(new Date(inc.date), showTooltip.day)).map(inc => (
                  <div key={inc._id} className="flex justify-between text-blue-500">
                    <span className="truncate flex-1">{inc.description}</span>
                    <span className="ml-2">+₹{inc.amount}</span>
                  </div>
                ))}
                {expenses.filter(expense => isSameDay(new Date(expense.date), showTooltip.day)).map(expense => (
                  <div key={expense._id} className="flex justify-between text-red-500">
                    <span className="truncate flex-1">{expense.description}</span>
                    <span className="ml-2">-₹{expense.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal for day details */}
          {selectedDay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <Card className="bg-white rounded-lg shadow-lg max-w-sm w-full">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-base md:text-lg">{format(selectedDay, "MMMM dd, yyyy")}</CardTitle>
                  <button 
                    onClick={() => setSelectedDay(null)} 
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incomeRecords.filter(inc => isSameDay(new Date(inc.date), selectedDay)).length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Income</h3>
                      <div className="space-y-2">
                        {incomeRecords.filter(inc => isSameDay(new Date(inc.date), selectedDay)).map(inc => (
                          <div key={inc._id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <div className="font-medium">{inc.description}</div>
                              <div className="text-xs text-gray-500">{inc.category}</div>
                            </div>
                            <span className="text-blue-500">+₹{inc.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {expenses.filter(expense => isSameDay(new Date(expense.date), selectedDay)).length > 0 ? (
                    <div>
                      <h3 className="font-medium mb-2">Expenses</h3>
                      <div className="space-y-2">
                        {expenses.filter(expense => isSameDay(new Date(expense.date), selectedDay)).map(expense => (
                          <div key={expense._id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <div className="font-medium">{expense.description}</div>
                              <div className="text-xs text-gray-500">{expense.category}</div>
                            </div>
                            <span className="text-red-500">-₹{expense.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">No expenses for this day</div>
                  )}
                  
                  <div className="flex justify-center">
                    {/* <button className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      <PlusIcon className="w-4 h-4" />
                      <span>Add Expense</span>
                    </button> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}