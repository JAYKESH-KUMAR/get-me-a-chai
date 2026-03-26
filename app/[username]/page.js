import PaymentPage from "@/components/PaymentPage";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export default async function Page(props) {

  const params = props.params;   
  const username = params?.username;

  if (!username) {
    return (
      <div className="text-white text-center mt-10">
        Invalid URL
      </div>
    );
  }

  await connectDb();

  const user = await User.findOne({
    username: username.toLowerCase(),
  });

  if (!user) {
    return (
      <div className="text-white text-center mt-10">
        User Not Found
      </div>
    );
  }

  return <PaymentPage username={username} />;
}

export async function generateMetadata(props) {

  const params = props.params;
  const username = params?.username;

  return {
    title: `Support ${username || "User"} - Get Me A Chai`,
  };
}