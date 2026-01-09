// https://youtu.be/n-fVrzaikBQ?si=03CzQiRyqoa4XNq8

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
