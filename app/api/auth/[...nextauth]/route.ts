import { nextAuthOptions } from "@/app/lib/next-auth/options";
import NextAuth from "next-auth/next";

const handler = NextAuth(nextAuthOptions);

// https://next-auth.js.org/configuration/initialization#route-handlers-app
export { handler as GET, handler as POST };