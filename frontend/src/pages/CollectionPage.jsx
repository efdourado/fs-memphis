import React, { useEffect, useState, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faEllipsis, faUserCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";

import * as collectionService from "../services/collectionService";
import { deletePlaylist, followArtist, removeSongFromPlaylist, unfollowArtist } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useSongModal } from "../context/SongModalContext";
import { usePlayer } from "../hooks/usePlayer";
import { normalizeDataForPage } from "../utils/syncer";

import Carousel from "../components/ui/Carousel";
import List from "../components/ui/List";
import PlaylistModal from "../components/playlists/PlaylistModal";
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
  const { currentUser, updateCurrentUser } = useAuth();
  const { openMenu } = useSongModal();
  const { startPlayback, playContext, isPlaying, togglePlayPause } = usePlayer();

  const [rawData, setRawData] = useState(null);
  const [normalizedData, setNormalizedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const isOwner = currentUser && rawData && type === "playlist" && currentUser._id === rawData.owner?._id;
  const isFollowingArtist = type === "artist" && currentUser?.following?.some((artistId) => {
    const normalizedId = artistId?._id || artistId;
    return normalizedId?.toString() === id;
  });

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

  const handleToggleFollowArtist = useCallback(async () => {
    if (type !== "artist") return;
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    if (isFollowingArtist) {
      await unfollowArtist(id);
      updateCurrentUser({
        following: (currentUser.following || []).filter((artistId) => {
          const normalizedId = artistId?._id || artistId;
          return normalizedId?.toString() !== id;
        }),
      });
      return;
    }

    await followArtist(id);
    updateCurrentUser({
      following: [...(currentUser.following || []), id],
    });
  }, [currentUser, id, isFollowingArtist, navigate, type, updateCurrentUser]);

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
    profile,
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
              <span className="prototype-label">Design archive · optional playback</span>
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
              {type === "artist" && (
                <button className="login-btn always-hover create-btn" onClick={handleToggleFollowArtist}>
                  <FontAwesomeIcon icon={isFollowingArtist ? faUserCheck : faUserPlus} />
                  <span>{isFollowingArtist ? "Following" : "Follow"}</span>
                </button>
              )}

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

          {type === "artist" && profile && (
            <section className="artist-archive-profile" aria-label="Artist notes">
              {(profile.country || profile.genres?.length > 0) && (
                <div className="artist-archive-profile__facts">
                  {profile.country && <span>{profile.country}</span>}
                  {(profile.genres || []).map((genre) => <span key={genre}>{genre}</span>)}
                </div>
              )}
              {profile.curatedNotes && (
                <div className="artist-archive-profile__notes">
                  <p className="artist-archive-profile__eyebrow">Curiosities & notes</p>
                  <p>{profile.curatedNotes}</p>
                </div>
              )}
              {Object.entries(profile.socials || {}).some(([, url]) => Boolean(url)) && (
                <div className="artist-archive-profile__links">
                  {Object.entries(profile.socials).filter(([, url]) => Boolean(url)).map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>
                  ))}
                </div>
              )}
            </section>
          )}
          
          {mainContent?.items?.length > 0 ? (
            <section className="entity-content-section list-container">
              <div className="carousel__header">
                <h2 className="carousel__title">{mainContent.title}</h2>
              </div>
              <List
                items={mainContent.items}
                type={mainContent.type}
                showHeader={false}
                showNumber={true}
                showImage={type !== 'artist'}
                onMenuClick={handleOpenMenuForSong}
                initialItems={3}
                {...(type !== 'artist' ? { displayAll: true } : {})}
              />
            </section>
          ) : (
            type === 'artist' && <p>This artist has no songs yet</p>
          )}
          
          {subContent?.items?.length > 0 ? (
            <section className="entity-content-section">
              <Carousel
                title={subContent.title}
                items={subContent.items}
                type={subContent.type}
                displayArtistName={type !== 'artist'}
              />
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
