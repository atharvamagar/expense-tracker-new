"use server";

import clientPromise from "@/lib/mongodb";



export async function getExpense(month: string) {
    try{
    const client = await clientPromise
    const db = client.db("expenseTracker");
    let query = {};
    if (month) {
      // Create date range for the selected month
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      query = {
        date: {
          $gte: startDate.toISOString().split('T')[0],
          $lte: endDate.toISOString().split('T')[0]
        }
      };
    }

    const expenses = await db.collection("expenses").find(query).toArray();
    const formattedExpenses = expenses.map(exp => ({
        _id: exp._id.toString(),  // Convert ObjectId to string
        description: exp.description,
        amount: exp.amount,
        date: exp.date,
        category: exp.category,
        createdAt: new Date(exp.createdAt), // Ensure Date type
    }));
    return formattedExpenses;
  } catch (e) {
    console.error(e);
    // return NextResponse.json({ message: "Error fetching expenses" }, { status: 500 });
  }
}
export async function getIncome(month: string) {
    try {
      const client = await clientPromise
      const db = client.db("expenseTracker");
      let query = {};
      if (month) {
        // Create date range for the selected month
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        
        query = {
          date: {
            $gte: startDate.toISOString().split('T')[0],
            $lte: endDate.toISOString().split('T')[0]
          }
        };
        const income = await db.collection("income").find(query).toArray();
        const formattedIncome = income.map(inc => ({
          _id: inc._id.toString(),
          description: inc.description,
          amount: inc.amount,
          date: inc.date,
          category: inc.category,
          createdAt: new Date(inc.createdAt), // Ensure Date type
        }))
        return formattedIncome;
      }

    } catch (error) {
        console.error("Error fetching income records:", error);
        return { success: false, message: "Internal server error" };
        
    }
}
