import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./server/utils/db";
import getApprovedRoleForEmail from "./server/utils/approvedRole";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findUserByEmail(db, email) {
  const normalizedEmail = email.trim().toLowerCase();
  const escapedEmail = escapeRegex(normalizedEmail);

  return db.collection("users").findOne({
    email: {
      $regex: new RegExp(`^${escapedEmail}$`, "i"),
    },
  });
}

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
    async signIn({ user, account, profile }) {

      // =*=*=*=*=*=*=*=*=*=* PROVIDERS LINKING LOGIC (DON'T DELETE) =*=*=*=*=*=*=*=*=*=*

      // if (account?.provider === "google") {
      //   const { db } = await connectDB();

      //   const existing = await db.collection("credentials").findOne({ email: user.email });

      //   const isCredentialsOnly = existing?.providers?.length === 1 && existing.providers[0] === "credentials";
      //   const isGoogleOnly = existing?.providers?.length === 1 && existing.providers[0] === "google";

      //   if (isCredentialsOnly) {
      //     return `/login?email=${encodeURIComponent(user.email)}&provider=google`;
      //   }

      //   if (isGoogleOnly) {
      //     return `/home?email=${encodeURIComponent(user.email)}&provider=credentials`;
      //   }
        
      // }
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

    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" && user?.email) {
        try {
          const { db, client } = await connectDB();
          const normalizedEmail = user.email.trim().toLowerCase();
          const approvedRole = await getApprovedRoleForEmail(db, normalizedEmail);
          let userData = await findUserByEmail(db, normalizedEmail);

          if (userData) {
            if (approvedRole && userData.role !== approvedRole) {
              await db.collection("users").updateOne(
                { _id: userData._id },
                {
                  $set: {
                    role: approvedRole,
                    roleAssignedBy: "application-approval",
                  },
                },
              );

              userData = {
                ...userData,
                role: approvedRole,
                roleAssignedBy: "application-approval",
              };
            }
            
            // =*=*=*=*=*=*=*=*=*=* PROVIDERS LINKING LOGIC (DON'T DELETE) =*=*=*=*=*=*=*=*=*=*

            // if ( existingUser.providers?.length === 1 && existingUser.providers[0] === "credentials") {
            //   token._linkingRequired = true;
            //   token._linkingEmail = user.email;
            //   token._linkingProvider = "google";
              
            //   return token;
            // }
          } else {
            // new user
            const defaultImage = process.env.DEFAULT_USER_IMAGE;
            const role = approvedRole || "user";
            const roleAssignedBy = approvedRole ? "application-approval" : "system";

            const now = new Date();

            const newUserData = {
              name: user.name,
              email: normalizedEmail,
              image: user.image || defaultImage,
              role,
              roleAssignedBy,
              createdAt: now,
              lastLoginAt: null,
            };

            const newUserCredentials = {
              email: normalizedEmail,
              providers: ["google"],
              hashedPassword: null,
              passwordChangedAt: null,
            };

            const mongoClient = client.startSession();
            try {
              await mongoClient.withTransaction(async () => {
                const userResult = await db
                  .collection("users")
                  .insertOne(newUserData, { session: mongoClient });
                await db
                  .collection("credentials")
                  .insertOne(newUserCredentials, { session: mongoClient });

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
        } catch (error) {
          console.error("JWT callback DB error:", error);
          return token;
        }
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
