import { Link } from 'react-router-dom';

const entries = [
  { to: '/', title: 'Original Home', note: 'Hero, Bias, collections and the first product language.' },
  { to: '/discover', title: 'Discovery', note: 'Explainable recommendations and shuffle experiments.' },
  { to: '/artists', title: 'Artists', note: 'Profiles, releases and the visual archive.' },
  { to: '/library', title: 'Library', note: 'Songs, playlists and personal collection flows.' },
  { to: '/spotify', title: 'Spotify Playground', note: 'The external integration prototype.' },
];

const DesignArchivePage = () => <main className="design-archive-page"><header><p>Memphis Design Archive</p><h1>Nothing was thrown away.</h1><span>The complete music interface remains as a record of the first direction and the frontend system built by hand.</span></header><div className="design-archive-grid">{entries.map((entry, index) => <Link to={entry.to} key={entry.to} className="design-archive-card"><span>0{index + 1}</span><h2>{entry.title}</h2><p>{entry.note}</p></Link>)}</div></main>;

export default DesignArchivePage;
