import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <div className="flex justify-center flex-col gap-6 items-center text-white h-[60vh] px-5 md:px-0 text-sm md:text-base text-center">
        
        <div className="font-bold flex gap-4 md:gap-6 md:text-5xl justify-center items-center text-3xl">
          Get Me a Chai
          <span>
            <img className="invertImg" src="/tea.gif" width={70} alt="" />
          </span>
        </div>

        <p className="text-gray-300 max-w-xl">
          A crowdfunding platform for creators to fund their projects.
        </p>

        <p className="text-gray-400 max-w-xl">
          A place where your fans can buy you a chai. Unleash the power of your fans and get your projects funded.
        </p>

        <div className="mt-4 flex gap-4">
          <Link href="/login">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all">
              Start Here
            </button>
          </Link>

          <Link href="/about">
            <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-all">
              Read More
            </button>
          </Link>
        </div>
      </div>

      {/* LINE */}
      <div className="bg-white h-[1px] opacity-10"></div>

      {/* FEATURES */}
      <div className="text-white container mx-auto pb-32 pt-14 px-6">
        <h2 className="text-3xl font-bold text-center mb-14">
          Your Fans can buy you a Chai
        </h2>

        <div className="flex flex-row gap-10 justify-center items-center flex-wrap">
          
          <div className="space-y-3 flex flex-col items-center text-center">
            <img className="bg-slate-400 rounded-full p-2" width={80} src="/man.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p className="text-gray-400">Your fans are available to support you</p>
          </div>

          <div className="space-y-3 flex flex-col items-center text-center">
            <img className="bg-slate-400 rounded-full p-2" width={80} src="/coin.gif" alt="" />
            <p className="font-bold">Fans want to contribute</p>
            <p className="text-gray-400">Your fans are willing to contribute financially</p>
          </div>

          <div className="space-y-3 flex flex-col items-center text-center">
            <img className="bg-slate-400 rounded-full p-2" width={80} src="/group.gif" alt="" />
            <p className="font-bold">Fans want to collaborate</p>
            <p className="text-gray-400">Your fans are ready to collaborate with you</p>
          </div>

        </div>
      </div>

      {/* LINE */}
      <div className="bg-white h-[1px] opacity-10"></div>

      {/* VIDEO */}
      <div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center px-5">
        <h2 className="text-3xl font-bold text-center mb-10">
          Learn more about us
        </h2>

        <div className="w-full md:w-[60%] h-[40vh] rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}