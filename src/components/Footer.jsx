import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 5.3.6 CSS

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">

                    {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-light text-decoration-none">Dashboard</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">About</Link>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">Address</h5>
            <p className="mb-2">
              Interview Prep HQ<br />
              123 Career Lane, Tech City<br />
              Bengaluru, Karnataka 560001, India
            </p>
          </div>


          {/* Support Email */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">Contact Us</h5>
            <p className="mb-2">
              <i className="bi bi-envelope me-2"></i>
              <a href="mailto:support@interviewprep.com" className="text-light text-decoration-none">
                support@interviewprep.com
              </a>
            </p>
          </div>

        </div>

        {/* Copyright and Terms/Privacy */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="mb-2">
              &copy; {currentYear} Interview Prep. All rights reserved.
            </p>
            <p>
              <Link to="/terms" className="text-light text-decoration-none me-3">Terms of Service</Link>
              <Link to="/privacy" className="text-light text-decoration-none">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;