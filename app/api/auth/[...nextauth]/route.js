import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  trustHost: true,

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
      
        await connectDb();

        
        const email =
          user.email ||
          profile?.email ||
          `${profile?.login || "user"}@github.com`;

        
        await User.updateOne(
          { email },
          {
            $setOnInsert: {
              email,
              username: email.split("@")[0],
            },
          },
          { upsert: true }
        );

        return true; 
      } catch (error) {
        console.error("SignIn Error:", error);
        return true; 
      }
    },

    async session({ session }) {
      try {
        await connectDb();

        
        if (!session?.user?.email) return session;

        const dbUser = await User.findOne({
          email: session.user.email,
        });

        if (dbUser) {
          session.user.name = dbUser.username;
        }

        return session;
      } catch (error) {
        console.error("Session Error:", error);
        return session;
      }
    },
  },
});

export { handler as GET, handler as POST };