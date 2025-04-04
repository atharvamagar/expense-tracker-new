"use client";

import { redirect } from "next/dist/server/api-utils";
import { signIn, signOut } from "next-auth/react";

export const login = async () => {
    await signIn("github", { redirectTo: "/" });
};

export const logout = async () => {
    await signOut({ redirectTo: "/" });
};