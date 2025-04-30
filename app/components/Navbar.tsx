// Navbar component for the app
import { NavLink } from "react-router";
import { useTheme } from "~/contexts/theme";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-center">
        <div className="max-w-[800px] w-full px-4 py-2">
          <div className="flex justify-between items-center">
            <ul className="flex space-x-4">
              <li>
                <NavLink 
                  to="/"
                  className="relative px-2 py-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-gray-900 dark:before:bg-white before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-200 before:origin-left"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <a 
                  href="/notes"
                  className="relative px-2 py-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-gray-900 dark:before:bg-white before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-200 before:origin-left"
                >
                  Notes
                </a>
              </li>
            </ul>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              { '🌓︎'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;