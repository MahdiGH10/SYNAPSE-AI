import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        // Check if user exists
        let existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Check if user registered with password (not Google)
          if (!existingUser.googleId && existingUser.password) {
            // Link Google account to existing email account
            existingUser.googleId = account?.providerAccountId || "";
            existingUser.verified = true; // Auto-verify Google users
            await existingUser.save();
          }
        } else {
          // Create new user with Google
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            googleId: account?.providerAccountId,
            verified: true, // Google users are auto-verified
            password: undefined, // No password for Google users
          });
        }

        // Store user ID in token for later use
        user.id = existingUser._id.toString();
        
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.userId = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
