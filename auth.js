import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./server/utils/db";

export const ROLES = {
  USER: "user",
  TECHNICIAN: "technician",
  DELIVERYMAN: "deliveryman",
  ADMIN: "admin",
};


export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({user, account}){
      if (account?.provider !== "google"){
        try{
          const db = connectDB();

        }catch{

        }
      }else{
        return true
      }

    }
  }
});
