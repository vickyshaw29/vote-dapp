import ConnectButton from "./components/ConnectButton";
import { Lottery } from "./components/Lottery";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Lottery dApp</h1>
          <ConnectButton />
        </div>

        <Lottery />
      </div>
    </main>
  );
}
