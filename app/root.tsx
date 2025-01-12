import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "~/app.css?url";
import Navbar from "~/components/Navbar";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/theme";

declare global {
  interface Window {
    WebFontConfig?: {
      google?: {
        families: string[];
      };
    };
    WebFont?: {
      load: (config: any) => void;
    };
  }
}

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

function loadFonts() {
  const script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
  script.async = true;

  script.onload = () => {
    window.WebFont?.load({
      google: {
        families: ['Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap']
      }
    });
  };

  document.head.appendChild(script);
}

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ThemeProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>👨🏽‍💻</text></svg>"></link>
          <Meta />
          <Links />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const savedTheme = sessionStorage.getItem('theme');
                    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
                    document.documentElement.className = initialTheme;
                    window.__theme = initialTheme;
                  } catch (e) {
                    console.error('Error setting initial theme:', e);
                  }
                })();
              `,
            }}
          />
        </head>
        <body className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-200">
          <Navbar />
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
