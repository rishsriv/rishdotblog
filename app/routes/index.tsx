import { Link } from "react-router"

export function meta() {
  return [
    { title: "Rishabh Srivastava | Data Nerd, Founder of Defog.ai" },
    { name: "description", content: "Learning, Growth, Open Source." },
  ];
}

export default function Home() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[800px] w-full space-y-6 px-4">
          <h1 className="font-bold text-3xl text-gray-700 dark:text-gray-200">
            Rishabh Srivastava 👨🏽‍💻
          </h1>
          <p className="font-medium text-gray-700 dark:text-gray-200">
            I am the founder of <Link to="https://defog.ai" className="text-blue-600 hover:underline">Defog.ai</Link> (YC W23), an open-source AI Data Analyst for enterprises.
          </p>
          <p className="font-medium text-gray-700 dark:text-gray-200">
            Previously, I founded <Link to="https://loki.ai" className="text-blue-600 hover:underline">Loki.ai</Link>, a data intelligence platform for extracting insights from unstructured web data for enterprises in Asia.
          </p>
          <p className="font-medium text-gray-700 dark:text-gray-200">
            I share things I learn <Link to="/notes" className="text-blue-600 hover:underline">here</Link>.
          </p>
          <hr />
          <h2 className="font-bold text-2xl text-gray-700 dark:text-gray-200">
            Operating Principles
          </h2>
          <ul className="list-decimal">
            <li className="ml-4 pl-2 pb-2">Think for yourself and decide a) what you want, b) what is true, and what you should do to achieve a) in light of b)</li>
            <li className="ml-4 pl-2 pb-2">Always add more value than you extract</li>
            <li className="ml-4 pl-2 pb-2">Prioritize long-term compounding, not short-term grabs</li>
            <li className="ml-4 pl-2 pb-2">Identify the point of highest leverage and go there</li>
            <li className="ml-4 pl-2 pb-2">Seek pain and push yourself. Pain + Reflection = Progress</li>
            <li className="ml-4 pl-2 pb-2">Build systems that enable flow states for yourself, your team, and your customers</li>
          </ul>
          <hr />
          <h2 className="font-bold text-2xl text-gray-700 dark:text-gray-200">
            Say hi!
          </h2>
          <ul className="list-disc">
            <li className="ml-4 pl-2 pb-2">
              <Link to="https://x.com/rishdotblog" className="text-blue-600 hover:underline"> 𝕏 (@rishdotblog)</Link>
            </li>
            <li className="ml-4 pl-2 pb-2">
              <Link to="https://linkedin.com/in/rishsriv" className="text-blue-600 hover:underline"> LinkedIn (@rishsriv)</Link>
            </li>
            <li className="ml-4 pl-2 pb-2">
              <Link to="https://www.youtube.com/@rishdotblog" className="text-blue-600 hover:underline"> YouTube (@rishdotblog)</Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
