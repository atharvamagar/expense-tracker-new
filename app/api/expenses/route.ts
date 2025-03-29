import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("expenseTracker")
    const { description, amount, date, category } = await request.json()

    const expense = {
      description,
      amount: Number.parseFloat(amount),
      date,
      category,
      createdAt: new Date(),
    }

    const result = await db.collection("expenses").insertOne(expense)

    return NextResponse.json({ message: "Expense added successfully", id: result.insertedId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error adding expense" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("expenseTracker");
    
    // Get the month parameter from URL
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    let query = {};
    if (month) {
      // Create date range for the selected month
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
      
      query = {
        date: {
          $gte: startDate.toISOString().split('T')[0],
          $lt: endDate.toISOString().split('T')[0]
        }
      };
    }

    const expenses = await db.collection("expenses").find(query).toArray();
    return NextResponse.json(expenses);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error fetching expenses" }, { status: 500 });
  }
}
