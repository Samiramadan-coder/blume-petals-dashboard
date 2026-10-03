"use server";

import { cookies } from "next/headers";

/**
 * Save token in HTTP-only cookie for authentication.
 */
export async function saveToken(token: string) {
  (await cookies()).set("token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Delete token from HTTP-only cookie for logout.
 */
export async function deleteToken() {
  (await cookies()).delete("token");
}
