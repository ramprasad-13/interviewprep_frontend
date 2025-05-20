import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const About = () => {
  return (
    <div className="container my-5">
      <h1 className="display-4 text-center mb-4">Interview Prep</h1>
      <h2 className="h3 mb-3">About Interview Prep</h2>
      <section className="card shadow-sm p-4 mb-4">
        <article>
          <p className="lead">
            <b>Interview Prep</b> was started in 2025 by Venkata Ramprasad Pade to help you excel in interviews. This website equips you with resources to prepare for interviews, including frequently asked questions and their solutions. It also offers a personal blog feature, allowing you to log questions immediately after an interview. By revisiting these questions, you can identify patterns, commit solutions to muscle memory, and make your upcoming interviews significantly easier.
          </p>
        </article>
      </section>
      <h3 className="h4 text-primary">Happy Coding!</h3>
      <p className="text-muted">All the best for your upcoming interview.</p>
    </div>
  );
};

export default About;