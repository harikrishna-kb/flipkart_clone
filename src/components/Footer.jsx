// Simple Flipkart-style footer with informational links.
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Flipkart Stories</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation &amp; Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Policy</h4>
          <ul>
            <li>Return Policy</li>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Social</h4>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>YouTube</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Flipkart Clone — College Project. For educational use only.</p>
      </div>
    </footer>
  );
}

export default Footer;
