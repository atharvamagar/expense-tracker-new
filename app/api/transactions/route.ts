import { NextApiRequest, NextApiResponse } from "next";
// import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  console.log("Deleting");
  
  // if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("expenseTracker");

      // Ensure the request body is parsed correctly
      const { id, type } = JSON.parse(req.body);
      if (!id || !type) {
        return res.status(400).json({ message: "Transaction ID and type are required" });
      }

      const collection = type === "income" ? "incomes" : "expenses";
      const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting transaction" });
    }
  // } else {
  //   return res.status(405).json({ message: "Method Not Allowed" });
  // }
}
