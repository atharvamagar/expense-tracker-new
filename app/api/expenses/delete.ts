import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" });

        const client = await clientPromise;
        const db = client.db("expenseTracker");
        const collection = db.collection("expenses");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        return res.status(200).json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
