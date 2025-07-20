import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { usePlayer } from '../../hooks/usePlayer';
import logo from '/memphis-logo-grey.png';

const mainNavLinks = ["About Us", "Help Center", "Community", "Contact Us"];
const legalLinks = ["Privacy", "Cookies", "Terms"];

const Footer = ({ companyName = "Memphis", year = new Date().getFullYear() }) => {
  const { currentTrack } = usePlayer();
  const footerClassName = `footer ${currentTrack ? 'with-player' : ''}`;

  const handleSocialClick = (e, appUrl, webUrl) => {
    e.preventDefault();

    const clickedAt = new Date().getTime();

    window.location.href = appUrl;

    setTimeout(() => {
      if (new Date().getTime() - clickedAt < 2000) {
        window.location.href = webUrl;
  } }, 1500); };

  return (
    <footer className={footerClassName}>
      <div className="footer-container">
        
        <div className="footer-main">

          <div className="header-logo">
            <img src={logo} alt={`${companyName} logo`} className="logo-img" />
            <span className="logo-name">
              {companyName}
            </span>
          </div>

          <nav className="footer-nav">
            {mainNavLinks.map((link) => (
              <a key={link} href="#" className="footer-nav-link">{link}</a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span className="copyright-text">&copy; {year} {companyName}. All rights reserved.</span>
            <div className="legal-links">
              {legalLinks.map((item) => (
                <a key={item} href="#" className="legal-item">{item}</a>
              ))}
            </div>
          </div>
          <div className="footer-socials">
            <a
              href="https://github.com/efdourado"
              onClick={(e) => handleSocialClick(e, 'github://user/efdourado', 'https://github.com/efdourado')}
              aria-label="GitHub"
              className="social-link"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>

            <a
              href="https://instagram.com/efdourado"
              onClick={(e) => handleSocialClick(e, 'instagram://user?username=efdourado', 'https://instagram.com/efdourado')}
              aria-label="Instagram"
              className="social-link"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
); };

Footer.propTypes = {
  companyName: PropTypes.string,
  year: PropTypes.number,
};

export default Footer;