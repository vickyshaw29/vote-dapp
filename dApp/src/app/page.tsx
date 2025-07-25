import ConnectButton from "./components/ConnectButton";
import { Lottery } from "./components/Lottery";

export default function Home() {
  return (
    <main className="min-h-screen p-8 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col space-y-4 justify-between items-center mb-8">
          <ConnectButton />
        </div>
        <Lottery />
      </div>
    </main>
  );
}
