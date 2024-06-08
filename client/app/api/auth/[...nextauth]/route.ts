import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.secret,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return "http://localhost:3000";
    },
  },

  /*
  callbacks: {
    async signIn({ account, profile }) {
      console.log(process.env.GOOGLE_CLIENT_ID);
      console.log(process.env.GOOGLE_CLIENT_SECRET);
      try {
        if (!profile?.email) {
          throw new Error("No Profile");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  */
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
