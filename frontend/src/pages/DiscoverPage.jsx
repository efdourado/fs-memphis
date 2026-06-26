import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faShuffle } from "@fortawesome/free-solid-svg-icons";

import { fetchRecommendations, fetchShuffleQueue } from "../services/collectionService";
import { usePlayer } from "../hooks/usePlayer";
import List from "../components/ui/List";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

const activities = ["focus", "study", "workout", "party", "relaxation", "creativity"];
const shuffleModes = ["balanced", "discovery", "favorites", "classic"];

const labelize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const DiscoverPage = () => {
  const [activity, setActivity] = useState("focus");
  const [mode, setMode] = useState("balanced");
  const [recommendations, setRecommendations] = useState([]);
  const [shuffleData, setShuffleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { startPlayback } = usePlayer();

  useEffect(() => {
    let cancelled = false;

    const loadDiscovery = async () => {
      try {
        setLoading(true);
        setError("");
        const [recommendedResponse, shuffleResponse] = await Promise.all([
          fetchRecommendations({ activity, mode, limit: 12 }),
          fetchShuffleQueue({ activity, mode, limit: 24 }),
        ]);
        if (!cancelled) {
          setRecommendations(recommendedResponse.data || []);
          setShuffleData(shuffleResponse.data || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load recommendations.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDiscovery();
    return () => {
      cancelled = true;
    };
  }, [activity, mode]);

  const topSong = recommendations[0];
  const factors = useMemo(() => Object.entries(topSong?.recommendation?.factors || {}), [topSong]);

  const handlePlayShuffle = () => {
    const queue = shuffleData?.queue || [];
    if (queue.length > 0) {
      startPlayback(queue, { type: "shuffle", label: `${mode}:${activity}` });
    }
  };

  return (
    <main className="discover-page">
      <section className="discover-page__toolbar">
        <div className="discover-segment" aria-label="Activity">
          {activities.map((nextActivity) => (
            <button
              key={nextActivity}
              className={nextActivity === activity ? "is-active" : ""}
              onClick={() => setActivity(nextActivity)}
            >
              {labelize(nextActivity)}
            </button>
          ))}
        </div>

        <div className="discover-segment" aria-label="Shuffle mode">
          {shuffleModes.map((nextMode) => (
            <button
              key={nextMode}
              className={nextMode === mode ? "is-active" : ""}
              onClick={() => setMode(nextMode)}
            >
              {labelize(nextMode)}
            </button>
          ))}
        </div>
      </section>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <section className="discover-page__grid">
          <div className="discover-page__queue">
            <div className="discover-section-heading">
              <h1>Recommended for {activity}</h1>
              <button className="login-btn always-hover create-btn" onClick={handlePlayShuffle}>
                <FontAwesomeIcon icon={faShuffle} />
                <span>Play {labelize(mode)}</span>
              </button>
            </div>
            <List
              items={recommendations}
              type="song"
              showHeader={false}
              showImage
              showAlbum
              showDuration
              showPlays
              displayAll
            />
          </div>

          <aside className="discover-page__math">
            <div className="discover-math-heading">
              <FontAwesomeIcon icon={faChartLine} />
              <h2>Shuffle Math</h2>
            </div>
            <p className="discover-formula">{shuffleData?.formula}</p>
            {topSong && (
              <div className="discover-factor-list">
                <h3>{topSong.title}</h3>
                {factors.map(([name, value]) => (
                  <div key={name} className="discover-factor-row">
                    <span>{labelize(name)}</span>
                    <strong>{Math.round(value * 100)}%</strong>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </section>
      )}
    </main>
  );
};

export default DiscoverPage;
