"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseOverview } from "@/components/stats/ExpenseOverview"
import { CategoryBreakdown } from "@/components/stats/CategoryBreakdown"
import { MonthlyTrends } from "@/components/stats/MonthlyTrends"
import { SpendingPatterns } from "@/components/stats/SpendingPatterns"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subMonths, startOfYear } from "date-fns"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Expense {
  _id: string
  description: string
  amount: number
  date: string
  category: string
}

export default function StatsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("month")
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchExpenses() {
      try {
        setLoading(true)

        let url = timeframe === "year"
          ? `/api/expenses?year=${selectedMonth.getFullYear()}`
          : `/api/expenses?month=${selectedMonth.toISOString().slice(0, 7)}`

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch expenses")
        const data = await response.json()
        setExpenses(data)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [selectedMonth, timeframe])

  const handleExportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Description,Category,Amount\n" +
      expenses.map((e) => `${e.date},${e.description},${e.category},${e.amount}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "expense_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Months for mobile selection
  const recentMonths = Array.from({ length: 12 }).map((_, i) => {
    const date = subMonths(new Date(), i)
    return {
      label: format(date, "MMM yyyy"),
      value: date.toISOString().slice(0, 7)
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-lg font-medium">Loading stats...</p>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 py-4 sm:p-4 space-y-4 max-w-6xl">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Financial Analytics</h1>
        
        {/* Mobile Actions Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Date Selection Sheet for Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:hidden">
                <Calendar size={14} />
                {timeframe === "year" ? format(selectedMonth, "yyyy") : format(selectedMonth, "MMM yyyy")}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-80">
              <div className="pt-6 pb-2">
                <h3 className="text-lg font-medium mb-4">Select Time Range</h3>
                
                {/* Timeframe Selection for Mobile */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["week", "month", "year"].map((period) => (
                    <Button
                      key={period}
                      variant={timeframe === period ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setTimeframe(period)
                        if (period === "year") {
                          setSelectedMonth(startOfYear(new Date()))
                        }
                      }}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                  ))}
                </div>
                
                {/* Month Selection for Mobile */}
                <div className="grid grid-cols-2 gap-2">
                  {recentMonths.map((month) => (
                    <Button
                      key={month.value}
                      variant={selectedMonth.toISOString().slice(0, 7) === month.value ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedMonth(new Date(month.value))}
                      disabled={timeframe === "year"}
                    >
                      {month.label}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Export Button */}
          <Button 
            onClick={handleExportData} 
            variant="outline" 
            size="sm"
            className="ml-auto text-xs"
          >
            <Download size={14} className="mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Desktop Time Range Selection */}
      <Card className="hidden sm:block">
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg">Time Range</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Month Selection Dropdown - Desktop */}
              <Select
                value={selectedMonth.toISOString().slice(0, 7)}
                onValueChange={(value) => setSelectedMonth(new Date(value))}
                disabled={timeframe === "year"}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {timeframe === "year" 
                      ? format(selectedMonth, "yyyy") 
                      : format(selectedMonth, "MMMM yyyy")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {recentMonths.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Timeframe Buttons - Desktop */}
              <div className="flex gap-1">
                {["week", "month", "year"].map((period) => (
                  <Button
                    key={period}
                    variant={timeframe === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTimeframe(period)
                      if (period === "year") {
                        setSelectedMonth(startOfYear(new Date()))
                      }
                    }}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Navigation - Improved Mobile Experience */}
      <Tabs 
        defaultValue="overview" 
        className="space-y-4"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4 h-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "categories", label: "Categories" },
            { id: "trends", label: "Trends" },
            { id: "patterns", label: "Patterns" }
          ].map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="py-2 text-xs sm:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="overview" className="mt-0 space-y-4">
          <ExpenseOverview 
            expenses={expenses} 
            timeframe={timeframe}
            selectedMonth={selectedMonth}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-0 space-y-4">
          <CategoryBreakdown 
            expenses={expenses} 
            timeframe={timeframe}
            selectedMonth={selectedMonth}
          />
        </TabsContent>

        <TabsContent value="trends" className="mt-0 space-y-4">
          <MonthlyTrends expenses={expenses} />
        </TabsContent>

        <TabsContent value="patterns" className="mt-0 space-y-4 pb-16">
          <SpendingPatterns expenses={expenses} timeframe={timeframe} />
        </TabsContent>
      </Tabs>
    </div>
  )
}