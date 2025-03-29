import { NextResponse } from "next/server"
import db from "@/lib/db" // Adjust the path to your database module

export async function DELETE(req, { params }) {
  try {
    const { id } = params
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    await db.expense.delete({ where: { id: Number(id) } }) // Adjust this based on your DB structure

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}
