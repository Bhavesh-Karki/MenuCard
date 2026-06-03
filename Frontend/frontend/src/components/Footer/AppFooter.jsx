import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  WhatsAppIcon,
  XIcon,
} from '../Icons';

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-grid">
        <div>
          <h2>MenuCard as a Digital Ordering Solution</h2>
          <p>
In-store self-service touchscreens and digital ordering platforms across its smart restaurants. You can browse menus, customize meals, and pay without waiting in traditional lines
          </p>
        </div>

        <div>
          <h3>Collaborative Work</h3>
          <p>Developer's profile.</p>
          <div className="footer-icon-row" aria-label="Developer GitHub profiles">
            <a
              className="footer-icon-link github"
              href="https://github.com/Bhavesh-Karki"
              aria-label="Bhavesh Karki"
              rel="noreferrer"
              target="_blank"
            >
              <GithubIcon />
              <span className="footer-profile-name">Bhavesh Karki</span>
            </a>
            <a
              className="footer-icon-link github"
              href="https://github.com/Lishanaik11"
              aria-label="Lisha Naik"
              rel="noreferrer"
              target="_blank"
            >
              <GithubIcon />
              <span className="footer-profile-name">Lisha Naik</span>
            </a>
            <a
              className="footer-icon-link github"
              href="https://github.com/mamtakurdia808-code"
              aria-label="Mamta Kurdia"
              rel="noreferrer"
              target="_blank"
            >
              <GithubIcon />
              <span className="footer-profile-name">Mamta Kurdia</span>
            </a>
          </div>
        </div>

        <div>
          <h3>Github Repo</h3>
          <a
            className="footer-icon-link github repo-link"
            href="https://github.com/Bhavesh-Karki/MenuCard"
            aria-label="View project on GitHub"
            rel="noreferrer"
            target="_blank"
          >
            <GithubIcon />
            <span className="footer-profile-name">View on GitHub</span>
          </a>
        </div>
        

        <div>
          <h3>Social</h3>
          <div className="social-links" aria-label="Social media links">
            <a className="instagram" href="#instagram" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a className="facebook" href="#facebook" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a className="x-twitter" href="#x-twitter" aria-label="X">
              <XIcon />
            </a>
            <a className="whatsapp" href="#whatsapp" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
