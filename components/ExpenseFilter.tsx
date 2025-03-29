import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ExpenseFilterProps {
  filter: { category: string; startDate: string; endDate: string }
  setFilter: (filter: { category: string; startDate: string; endDate: string }) => void
}

export function ExpenseFilter({ filter, setFilter }: ExpenseFilterProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Select value={filter.category} onValueChange={(value) => setFilter({ ...filter, category: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="transportation">Transportation</SelectItem>
          <SelectItem value="grocery">Grocery</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={filter.startDate}
        onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
        placeholder="Start Date"
      />
      <Input
        type="date"
        value={filter.endDate}
        onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
        placeholder="End Date"
      />
    </div>
  )
}

