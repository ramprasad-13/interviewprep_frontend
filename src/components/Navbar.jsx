import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // Import useAuth hook
import { useEffect } from 'react'; // Import useEffect to load Bootstrap's JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap's JS bundle

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  // This useEffect ensures Bootstrap's JS is loaded and available
  // It's crucial for `data-bs-toggle` and `data-bs-target` to work correctly.
  useEffect(() => {
    // No specific action needed here other than ensuring the import happens
    // Bootstrap's JS attaches itself to the global window object.
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout('You have successfully logged out.');
    } else {
      // The button itself will just trigger the logout function,
      // it won't navigate directly unless specified in logout().
    }
    // Close the navbar collapse if open
    closeNavbarCollapse();
  };

  const handleNavLinkClick = () => {
    // Close the navbar collapse when any nav link is clicked
    closeNavbarCollapse();
  };

  const closeNavbarCollapse = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
      // Check if the collapse element exists and if it's currently showing
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse); // Get existing instance
      if (bsCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide(); // Hide the collapse
      } else if (!bsCollapse) {
        // If no instance exists (e.g., first time or before full init), create one and hide
        new bootstrap.Collapse(navbarCollapse, { toggle: false }).hide();
      }
    }
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm" style={{ zIndex: 1030 }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Interview Prep</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavLinkClick}>Home</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard" onClick={handleNavLinkClick}>Dashboard</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/about" onClick={handleNavLinkClick}>About</Link>
            </li>
            <li className="nav-item">
              {/* The Login/Logout button can also trigger collapse close */}
              <button className="btn btn-primary ms-2" onClick={handleAuthClick}>
                {isAuthenticated ? 'Logout' : 'Login'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;