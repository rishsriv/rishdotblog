// Navbar component for the app
import { NavLink } from "react-router";
import { useTheme } from "~/contexts/theme";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-center">
        <div className="max-w-[800px] w-full px-4 py-2">
          <div className="flex justify-between items-center">
            <ul className="flex space-x-4">
              <li>
                <NavLink 
                  to="/"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/notes"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Notes
                </NavLink>
              </li>
              {/* <li>
                <NavLink 
                  to="/contact"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contact
                </NavLink>
              </li> */}
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