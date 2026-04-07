import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./server/utils/db";

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
    async signIn({ user, account }) {
      return true;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        try {
            const { db, client } = await connectDB();

          let userData = await db
            .collection("users")
            .findOne({ email: user.email });

          if (!userData) {
            const defaultImage =
              "https://res.cloudinary.com/dwmmarmfu/image/upload/default-cat-dp_j7fn6i.jpg";
            const role = "user";
            const roleAssignedBy = "system";

            const now = new Date();

            const newUserData = {
              name: user.name,
              email: user.email,
              image: user.image || defaultImage,
              role,
              roleAssignedBy,
              createdAt: now,
              updatedAt: now,
            };

            const newUserCredentials = {
              email: user.email,
              providers: ["google"],
              hashedPassword: null,
              passwordChangedAt: null,
            };

            const mongoClient = client.startSession();
            try {
              await mongoClient.withTransaction(async () => {
                const userResult = await db.collection("users").insertOne(newUserData, { session:mongoClient });
                await db.collection("credentials").insertOne(newUserCredentials, { session:mongoClient });
                
                // inserting _id added by mongoDB in newUserData
                userData = { ...newUserData, _id: userResult.insertedId };
              });
            } finally {
              await mongoClient.endSession();
            }
          }

          token.id = userData._id.toString();
          token.name = userData.name;
          token.email = userData.email;
          token.image = userData.image;
          token.role = userData.role;

          return token;
        } catch(error) {
          console.error("JWT callback DB error:", error);
          return token;
        }
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth-error/signin-error",
  },

  secret: process.env.AUTH_SECRET,
});
