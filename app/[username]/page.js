import PaymentPage from "@/components/PaymentPage";
import { notFound } from "next/navigation";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export default async function Page(props) {

  const params = await props.params;   
  const username = params?.username;
  if (!username) {
    return <div>Loading...</div>;
  }   


  await connectDb();
  

  const user = await User.findOne({ username });

  if (!user) {
    notFound();
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