import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faMagnet, faFlask, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import Bias from './Bias';
import fallbackImage from '/fb.jpg';

const Hero = ({ title, subtitle, talents = [], bgImage, songs = [], playlists = [] }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeFeatureTab, setActiveFeatureTab] = useState('songs');

  const heroStyle = {
    backgroundImage: `linear-gradient(to right, var(--hero-gradient-start), var(--hero-gradient-end)), url(${bgImage})`,
  };

  const renderFeatureContent = () => {
    switch (activeFeatureTab) {
      case 'songs':
        return (
          <div className="feature-card top-songs-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faFire} /> Songs</h4>
            <p className="feature-description">
              Here, we share more than just songs.
              From raw demos to final versions, Echo reveals the creative process, the inspo, and the memories tied to each release.
              It's a growing archive. Whether you're here to vibe, learn, or connect — welcome to the echo of our work!
            </p>
            <div className="feature-bias">
              {songs.slice(0, 3).map((song) => (
                <Bias key={song._id} item={song} type="song" />
              ))}
            </div>
            <button type="button" className="cta-button" onClick={() => navigate('/discover')}>
              View Popular Songs
            </button>
          </div>
        );

      case 'playlists':
        return (
          <div className="feature-card featured-playlist-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faMagnet} /> Playlists</h4>
            <p className="feature-description">
              Or paths.
              We're weaving new flows — from unexpected blends to deeper groupings, guiding you through what you didn't know you needed.
              Welcome to a new way of organizing feeling.
            </p>
            <div className="feature-bias">
              {playlists.slice(0, 2).map((playlist) => (
                <Bias key={playlist._id} item={playlist} type="playlist" />
              ))}
            </div>
            <button type="button" className="cta-button secondary-cta" onClick={() => navigate('/discover')}>
              Discover New Playlists
            </button>
          </div>
        );

      case 'lab':
        return (
          <div className="feature-card explore-genres-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faFlask} /> Lab</h4>
            <p className="feature-description">
              Where it all begins.
              This is our creative nucleus — a playground of raw sketches, evolving loops, and whispers.
              It's messy, real, dynamic. Explore and create with our tools!
            </p>
            <button type="button" className="cta-button secondary-cta">
              Open Lab
            </button>
          </div>
        );
      default:
        return null;
  } };

  return (
    <div className="music-hero" style={heroStyle}>
      <div className="hero-content">
        <aside className="hero-talents">
          <h4 className="talents-title">Talents</h4>
          <ul className="talents-list">
            {talents.map((talent) => (
              <li key={talent._id} className="talent-item">
                <Link to={`/artist/${talent._id}`}>
                  <img
                    src={talent.profilePic || fallbackImage}
                    alt={talent.name}
                    title={talent.name}
                    onError={(e) => { e.target.src = fallbackImage; }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="hero-main">
          <div className="text-content">
            <h1 className="title">{title}</h1>
            <p className="subtitle">{subtitle}</p>
          </div>
          <div className="hero-quick-links">
            <button 
              className="cta-button secondary-cta" 
              onClick={() => navigate(isAuthenticated ? '/discover' : '/register')}
            >
              {isAuthenticated ? 'Explore' : 'Join Us'}
            </button>
            <button className="cta-button primary-cta" onClick={() => navigate('/artists')}>
              What's New?
              <FontAwesomeIcon icon={faFireFlameCurved} style={{ marginLeft: '10px' }}/>
            </button>
          </div>
          <div className="hero-tabs-nav">
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'songs' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('songs')}
            >
              Songs
            </button>
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'playlists' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('playlists')}
            >
              Playlists
            </button>
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'lab' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('lab')}
            >
              Lab
            </button>
          </div>
        </main>
        
        <aside className="hero-feature-section">
          {renderFeatureContent()}
        </aside>
      </div>
    </div>
); };

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  bgImage: PropTypes.string,
  talents: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  })),
  songs: PropTypes.array,
  playlists: PropTypes.array,
};

export default Hero;