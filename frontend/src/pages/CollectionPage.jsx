import React, { useEffect, useState, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import * as collectionService from "../services/collectionService";
import { deletePlaylist, removeSongFromPlaylist } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useSongModal } from "../context/SongModalContext";
import { usePlayer } from "../hooks/usePlayer";
import { normalizeDataForPage } from "../utils/syncer";

import SongList from "../components/songs/SongList";
import PlaylistModal from "../components/playlists/PlaylistModal";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import fallbackImage from "/fb.jpg";

const fetchers = {
  artist: collectionService.fetchArtistById,
  album: collectionService.fetchAlbumById,
  playlist: collectionService.fetchPlaylistById,
};

const CollectionPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { openMenu } = useSongModal();
  const { startPlayback, playContext, isPlaying, togglePlayPause } = usePlayer();

  const [rawData, setRawData] = useState(null);
  const [normalizedData, setNormalizedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const isOwner = currentUser && rawData && type === "playlist" && currentUser._id === rawData.owner?._id;

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const fetcher = fetchers[type];
      if (!fetcher) throw new Error(`Invalid page type: ${type}`);

      const { data } = await fetcher(id);
      if (!data) throw new Error("Could not load data for this page.");
      
      setRawData(data);
      setNormalizedData(normalizeDataForPage(type, data));
    } catch (err) {
      setError(err.message || `Failed to load ${type} data.`);
      console.error(`Failed to load ${type} data:`, err);
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleDelete = useCallback(async () => {
    if (!isOwner) return;
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await deletePlaylist(id);
        navigate("/library");
      } catch (err) {
        setError("Failed to delete playlist.");
    } }
  }, [id, isOwner, navigate]);

  const handlePlaylistUpdated = useCallback((updatedData) => {
    setRawData(prev => ({ ...prev, ...updatedData }));
    setNormalizedData(normalizeDataForPage(type, { ...rawData, ...updatedData }));
    setEditModalOpen(false);
  }, [type, rawData]);

  const handleRemoveSong = useCallback(async (songIdToRemove) => {
    try {
      await removeSongFromPlaylist(id, songIdToRemove);
      loadPageData();
    } catch (error) {
      setError("Failed to remove song from playlist.");
    }
  }, [id, loadPageData]);

  const handleOpenMenuForSong = useCallback((song) => {
    const context = isOwner ? { source: "playlist", onRemove: () => handleRemoveSong(song._id) } : null;
    openMenu(song, context);
  }, [isOwner, handleRemoveSong, openMenu]);

  const handlePlayMainContent = useCallback(() => {
    const isMainContentPlaying = playContext?.type === `${type}-main` && playContext?.id === id;
    if (isMainContentPlaying) {
      togglePlayPause();
    } else if (normalizedData?.mainContent?.items?.length > 0) {
      startPlayback(normalizedData.mainContent.items, { type: `${type}-main`, id });
    }
  }, [playContext, id, type, normalizedData, startPlayback, togglePlayPause]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!normalizedData) return null;

  const {
    title,
    description,
    backgroundImage,
    mainContent,
    subContent,
    stats,
  } = normalizedData;

  const isMainContentPlaying = playContext?.type === `${type}-main` && playContext?.id === id;

  return (
    <>
      <div className="collection-page">
        <aside
          className="collection-page__left-column"
          style={{ backgroundImage: `url(${backgroundImage || fallbackImage})` }}
        >
          <div className="collection-page__metadata">
            <h1 className="collection-page__title">{title}</h1>
            <p className="collection-page__description">{description}</p>
          </div>
        </aside>

        <main className="collection-page__right-column">
          <div className="collection-page__actions">
            <div className="actions-left">
              {stats && (
                <div className="collection-page__stats">
                  {stats.map((stat, index) => (
                    <React.Fragment key={index}>
                      {`${stat.value} ${stat.label}`}
                      {index < stats.length - 1 && <span className="stat-separator"> • </span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            <div className="actions-right">
              {isOwner && (
                <button className="action-btn menu" onClick={() => setEditModalOpen(true)}>
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
              )}

              <button className="action-btn play" onClick={handlePlayMainContent}>
                <FontAwesomeIcon icon={isMainContentPlaying && isPlaying ? faPause : faPlay} />
              </button>
            </div>
          </div>
          
          {mainContent?.items?.length > 0 ? (
            <section className="entity-content-section">
              <div className="carousel__header">
                <h2 className="carousel__title">{mainContent.title}</h2>
              </div>
              <SongList
                songs={mainContent.items}
                showHeader={false}
                displayAll={true}
                showNumber={true}
                showImage={type !== 'artist'}
                onMenuClick={handleOpenMenuForSong}
              />
            </section>
          ) : (
            type === 'artist' && <p>This artist has no songs yet</p>
          )}

          {subContent?.items?.length > 0 ? (
            <section className="entity-content-section">
              <div className="carousel__header">
                <h2 className="carousel__title">
                  {subContent.title}
                </h2>
              </div>

              <div className="playlists-grid">
                {subContent.items.map((item) => (
                  <Card key={item._id} item={item} type={subContent.type} />
                ))}
              </div>
            </section>
          ) : (
            type === 'artist' && <p>This artist has no albums yet</p>
          )}
        </main>
      </div>

      {isOwner && rawData && (
        <PlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          playlist={rawData}
          onPlaylistUpdated={handlePlaylistUpdated}
          onDelete={handleDelete}
        />
      )}
    </>
); };

CollectionPage.propTypes = {
  type: PropTypes.oneOf(["artist", "album", "playlist"]).isRequired,
};

export default memo(CollectionPage);