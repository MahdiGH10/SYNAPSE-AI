import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        // Check if user exists
        let existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Update Google ID if not set
          if (!existingUser.googleId && account?.providerAccountId) {
            existingUser.googleId = account.providerAccountId;
            existingUser.verified = true;
            existingUser.lastLogin = new Date();
            await existingUser.save();
          } else {
            // Just update last login
            existingUser.lastLogin = new Date();
            await existingUser.save();
          }
        } else {
          // Create new user
          existingUser = await User.create({
            name: user.name || user.email?.split('@')[0],
            email: user.email,
            googleId: account?.providerAccountId,
            image: user.image,
            verified: true,
            lastLogin: new Date(),
          });
        }

        // Store user ID in the user object for JWT callback
        user.id = existingUser._id.toString();
        
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Initial sign in - add custom fields to token
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
