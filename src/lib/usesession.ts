import { getSession } from "next-auth/react";

type MyTokenPayload = {
  id: string;
  email: string;
  name?: string;
};

export async function getUserFromSession() {
  if (typeof window === "undefined") return null;

  const session = await getSession(); // no ctx on client

  if (!session || !session.user) return null;

  // Depending on how you configured callbacks, you may have id / email / name here
  const user: MyTokenPayload = {
    id: (session.user as any).id ?? "",
    email: session.user.email ?? "",
    name: session.user.name ?? "",
  };

  // Optional: store in localStorage if you really need it
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userName", user.name || "");

  return user;
}