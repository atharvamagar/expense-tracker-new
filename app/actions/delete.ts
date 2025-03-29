"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DeleteTransaction(id: string) {
    try {
        const client = await clientPromise;
        const db = client.db("expenseTracker");
        const collection = db.collection("income"); // Replace with your collection

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        console.log("Result of deletion", result);
        
        if (result.deletedCount === 0) {
            return { success: false, message: "Item not found" };
        }

        return { success: true, message: "Item deleted successfully" };
    } catch (error) {
        console.error("Error deleting item:", error);
        return { success: false, message: "Internal server error" };
    }
}

export async function deleteExpenseCollection() {
    try {
        const client = await clientPromise;
        const db = client.db("expenseTracker"); // Your database name

        const result = await db.collection("income").drop(); // Drops the collection

        return { success: true, message: "Collection deleted successfully" };
    } catch (error) {
        console.error("Error deleting collection:", error);
        return { success: false, message: "Failed to delete collection" };
    }
}

export async function DeleteExpense(id: string) {
    try {
        const client = await clientPromise;
        const db = client.db("expenseTracker");
        const collection = db.collection("expenses"); // Expense collection

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        console.log("Result of expense deletion", result);
        
        if (result.deletedCount === 0) {
            return { success: false, message: "Expense not found" };
        }

        return { success: true, message: "Expense deleted successfully" };
    } catch (error) {
        console.error("Error deleting expense:", error);
        return { success: false, message: "Internal server error" };
    }
}
