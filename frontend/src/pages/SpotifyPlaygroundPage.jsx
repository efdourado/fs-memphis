import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare, faMagnifyingGlass, faRotateRight } from "@fortawesome/free-solid-svg-icons";

import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getSpotifyStatus, searchSpotifyTracks } from "../services/spotifyService";
import { formatDuration } from "../utils/duration";

const SpotifyTrackCard = ({ track }) => {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const image = track.album.image;

  return (
    <article className="spotify-track-card">
      <a className="spotify-track-card__art" href={track.externalUrl} target="_blank" rel="noreferrer">
        {image ? (
          <img src={image} alt={track.album.name} />
        ) : (
          <span aria-hidden>
            <FontAwesomeIcon icon={faSpotify} />
          </span>
        )}
      </a>
      <div className="spotify-track-card__body">
        <div>
          <h2>{track.name}</h2>
          <p>{artistNames}</p>
          <p>{track.album.name}</p>
        </div>
        <div className="spotify-track-card__meta">
          <span>{formatDuration(track.durationMs / 1000)}</span>
          {track.explicit && <span>Explicit</span>}
          {Number.isFinite(track.popularity) && <span>{track.popularity}%</span>}
        </div>
        <a className="spotify-track-card__link" href={track.externalUrl} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faSpotify} />
          <span>Spotify</span>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
      </div>
    </article>
  );
};

const SpotifyPlaygroundPage = () => {
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [query, setQuery] = useState("music theory");
  const [submittedQuery, setSubmittedQuery] = useState("music theory");
  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadStatus = async () => {
      try {
        setStatusLoading(true);
        const { data } = await getSpotifyStatus();
        if (!cancelled) setStatus(data);
      } catch (err) {
        if (!cancelled) {
          setStatus(null);
          if (![401, 409].includes(err.response?.status)) {
            setError(err.response?.data?.message || "Could not connect to Spotify.");
          }
        }
      } finally {
        if (!cancelled) setStatusLoading(false);
      }
    };

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!status?.connected || !submittedQuery) return;
    let cancelled = false;

    const loadTracks = async () => {
      try {
        setLoadingTracks(true);
        setError("");
        const { data } = await searchSpotifyTracks(submittedQuery, { limit: 12 });
        if (!cancelled) setTracks(data.items || []);
      } catch (err) {
        if (!cancelled) {
          setTracks([]);
          setError(err.response?.data?.message || "Could not search Spotify.");
        }
      } finally {
        if (!cancelled) setLoadingTracks(false);
      }
    };

    loadTracks();
    return () => {
      cancelled = true;
    };
  }, [status?.connected, submittedQuery]);

  const accountLabel = useMemo(() => {
    if (!status) return "";
    return [status.displayName, status.product].filter(Boolean).join(" · ");
  }, [status]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) setSubmittedQuery(trimmed);
  };

  if (statusLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <main className="spotify-page">
      <section className="spotify-page__header">
        <div className="spotify-page__title-block">
          <FontAwesomeIcon icon={faSpotify} className="spotify-page__brand-mark" />
          <div>
            <p className="spotify-page__eyebrow">Spotify Playground</p>
            <h1>Connected catalog</h1>
          </div>
        </div>

        {status?.connected ? (
          <a className="login-btn always-hover create-btn" href={status.externalUrl} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faSpotify} />
            <span>{accountLabel}</span>
          </a>
        ) : (
          <a href="/api/auth/spotify" className="login-btn always-hover create-btn">
            <FontAwesomeIcon icon={faSpotify} />
            <span>Connect Spotify</span>
          </a>
        )}
      </section>

      {error && <ErrorMessage message={error} />}

      {!status?.connected ? (
        <section className="spotify-page__empty">
          <Link to="/discover" className="login-btn create-btn">
            <FontAwesomeIcon icon={faRotateRight} />
            <span>Memphis Discover</span>
          </Link>
        </section>
      ) : (
        <>
          <form className="spotify-search" onSubmit={handleSubmit}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Spotify tracks"
              spellCheck="false"
            />
            <button type="submit" className="login-btn always-hover create-btn">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <span>Search</span>
            </button>
          </form>

          {loadingTracks ? (
            <LoadingSpinner />
          ) : (
            <section className="spotify-track-grid" aria-label="Spotify tracks">
              {tracks.map((track) => (
                <SpotifyTrackCard key={track.id} track={track} />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default SpotifyPlaygroundPage;
