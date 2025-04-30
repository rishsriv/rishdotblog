import { Link } from "react-router"

export function meta() {
  return [
    { title: "Rishabh Srivastava | Co-Founder of Defog.ai" },
    { name: "description", content: "Learning, Growth, Open Source." },
  ];
}

export default function Home() {
  return (
    <main className="flex items-center justify-center py-8">
      <div className="flex-1 flex flex-col items-center">
        <div className="max-w-[800px] w-full px-4">
          <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none
            prose-headings:font-display
            prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
            prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-ul:my-6 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4
            prose-li:relative prose-li:pl-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-4
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
            
            <h1>Rishabh Srivastava 👨🏽‍💻</h1>
            
            <p>
              I am a co-founder of <Link to="https://defog.ai">Defog.ai</Link> (YC W23), an open-source AI Data Analyst for enterprises.
            </p>
            
            <p>
              Previously, I ran <Link to="https://loki.ai">Loki.ai</Link>, a data intelligence platform for extracting insights from unstructured web data.
            </p>
            
            <p>
              I share things I learn <a href="/notes">here</a>.
            </p>
            
            <h2>Operating Principles</h2>
            
            <ol>
              <li>Think for yourself and decide a) what you want, b) what is true, and what you should do to achieve a) in light of b)</li>
              <li>Always add more value than you extract</li>
              <li>Prioritize long-term compounding, not short-term grabs</li>
              <li>Identify the point of highest leverage and go there</li>
              <li>Seek pain and push yourself. Pain + Reflection = Progress</li>
              <li>Build systems that enable sustainable, peak performance for yourself, your team, and your customers</li>
            </ol>
            
            <h2>Say hi!</h2>
            
            <ul>
              <li><Link to="https://x.com/rishdotblog">𝕏 (@rishdotblog)</Link></li>
              <li><Link to="https://linkedin.com/in/rishsriv">LinkedIn (@rishsriv)</Link></li>
              <li><Link to="https://www.youtube.com/@rishdotblog">YouTube (@rishdotblog)</Link></li>
            </ul>
          </article>
        </div>
      </div>
    </main>
  );
}
