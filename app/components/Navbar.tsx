// Navbar component for the app
import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4 py-2">
        <ul className="flex space-x-4">
          <li>
            <NavLink to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/essays">
              Essays
            </NavLink>
          </li>
          <li>
            <NavLink to="/notes">
              Notes
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact">
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;