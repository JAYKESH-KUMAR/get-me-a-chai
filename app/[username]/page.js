import PaymentPage from "@/components/PaymentPage";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export default async function Page(props) {
  const params = props.params;            
  const username = params?.username;

  if (!username) {
    return <div className="text-white text-center mt-10">Invalid URL</div>;
  }

  await connectDb();

  // case-insensitive + null-safe
  const user = await User.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!user) {
    return (
      <div className="text-white text-center mt-10">
        User Not Found
      </div>
    );
  }

  //  try/catch so server never throws 500 from here
  try {
    return <PaymentPage username={username.toLowerCase()} />;
  } catch (e) {
    console.log("Page error:", e);
    return (
      <div className="text-white text-center mt-10">
        Something went wrong
      </div>
    );
  }
}