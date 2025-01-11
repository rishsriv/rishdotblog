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
import { useEffect, useState } from "react";

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for system preference and localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else if (systemPrefersDark) {
      setTheme('dark');
    }

    loadFonts();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-200">
        <Navbar theme={theme} setTheme={setTheme} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
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
