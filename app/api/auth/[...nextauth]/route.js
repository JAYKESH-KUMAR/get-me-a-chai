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
      try {
        if (account.provider === "github") {

          await connectDb(); 

          if (!user.email) return false;

          const currentUser = await User.findOne({ email: user.email });

          if (!currentUser) {
            await User.create({
              email: user.email,
              username: user.email.split("@")[0],
            });
          }

          return true;
        }

        return false;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },

    async session({ session }) {
      try {
        await connectDb(); 

        const dbUser = await User.findOne({ email: session.user.email });

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