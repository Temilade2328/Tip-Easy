import { TippingCalculator } from "@/components/app/tipping-calculator";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <TippingCalculator />
    </main>
  );
}
