import PaymentPage from "@/components/PaymentPage";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export default async function Page({ params }) {
  try {
    const username = params?.username;

    //  invalid URL check
    if (!username || typeof username !== "string") {
      return (
        <div className="text-white text-center mt-10">
          Invalid URL
        </div>
      );
    }

    await connectDb();

    //  case-insensitive + safe search
    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    }).lean();

    //  user not found
    if (!user) {
      return (
        <div className="text-white text-center mt-10">
          User Not Found
        </div>
      );
    }

    //  success
    return <PaymentPage username={user.username} />;

  } catch (error) {
    console.log("USERNAME PAGE ERROR:", error);

    return (
      <div className="text-white text-center mt-10">
        Something went wrong
      </div>
    );
  }
}