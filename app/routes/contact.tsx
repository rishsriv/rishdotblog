import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Rishabh Srivastava" },
    { name: "description", content: "Rishabh is an entrepreneur based in Singapore." },
  ];
}

export default function Home() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <h1 className="font-bold text-3xl text-gray-700 dark:text-gray-200">
            Rishabh Srivastava
          </h1>
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            Learning, Growth, Open Source.
          </p>
        </div>
      </div>
    </main>
  );
}
