import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("expenseTracker");
    const { description, amount, date, category } = await request.json();
    const income = {
      description,
      amount: Number.parseFloat(amount),
      date,
      category,
      createdAt: new Date(),
    };
    const result = await db.collection("income").insertOne(income);

    return NextResponse.json({ message: "Income added successfully", id: result.insertedId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error adding income" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("expenseTracker");
    const { id } = await request.json();
    const result = await db.collection("income").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Income record not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Income record deleted successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error deleting income record" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
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

    

    const incomeRecords = await db.collection("income").find(query).toArray();
    return NextResponse.json(incomeRecords);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error fetching income records" }, { status: 500 });
  }
}
