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
    async signIn({ user, account }) {
      console.log("SIGNIN CALLED ");

      if (account.provider === "github") {

        const conn = await connectDb(); 
        if (!conn) return false;

        if (!user.email) return false;

        const currentUser = await User.findOne({ email: user.email }).lean(); 

        if (!currentUser) {
          await User.create({
            email: user.email,
            username: user.email.split("@")[0],
          });
        }

        return true;
      }

      return false;
    },

    async session({ session }) {

      const conn = await connectDb(); 
      if (!conn) return session;

      const dbUser = await User.findOne({ email: session.user.email }).lean();

      if (dbUser) {
        session.user.name = dbUser.username;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };