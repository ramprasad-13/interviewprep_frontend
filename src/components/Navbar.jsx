import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/useAuth';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // No specific action needed here other than ensuring the import happens
    // Bootstrap's JS attaches itself to the global window object.
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout('You have successfully logged out.');
    } else {
      // Navigate to /signin when not authenticated
      navigate('/signin');
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
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      } else if (!bsCollapse) {
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
