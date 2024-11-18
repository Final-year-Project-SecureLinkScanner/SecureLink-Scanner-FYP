import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p>If you have any questions or need support, feel free to reach out to us.</p>

      <div className="contact-info">
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:support@securelinkscanner.com">support@securelinkscanner.com</a>
        </p>
        <p>
          <strong>Phone:</strong> +1 (123) 456-7890
        </p>
        <p>
          <strong>Address:</strong> 123 Main Street, Galway City, Ireland
        </p>
      </div>

      <form className="contact-form">
        <div className="form-group">
          <input type="text" placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Your Email" required />
        </div>
        <div className="form-group">
          <textarea placeholder="Your Message" rows="5" required></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
