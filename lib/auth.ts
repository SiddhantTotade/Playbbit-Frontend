import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "./api-config";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Playbbit",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // lib/auth.ts
      async authorize(credentials) {
        const authApiUrl = process.env.AUTH_API_URL || "http://127.0.0.1:1994/api";
        try {
          // Use direct Java backend port (1994) to bypass local connection refusal issues 
          // between Next.js server and Teeter load balancer.
          const res = await fetch(`${authApiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();
          const targetUrl = `${authApiUrl}/auth/login`;

          console.log(`Login attempt for ${credentials?.email} to ${targetUrl}`);
          console.log("Backend response status:", res.status);
          console.log("Backend response data:", data);

          if (res.ok && data.token) {
            console.log("Login successful, token received");
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              accessToken: data.token,
            };
          }

          console.warn("Login failed: Backend returned non-ok status or no token");
          return null;
        } catch (error) {
          console.error("FATAL: NextAuth authorize cannot reach Java backend!");
          console.error("Target URL attempted:", `${authApiUrl}/auth/login`);
          console.error("Error details:", error);
          if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Stack trace:", error.stack);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        (session as any).accessToken = token.accessToken;
        if (session.user) {
          (session.user as any).id = token.id;
        }
      }
      return session;
    },
  },
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
};
