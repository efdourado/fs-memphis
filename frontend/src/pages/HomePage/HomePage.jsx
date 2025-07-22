import React, { useMemo } from "react";

import { useAuth } from "../../context/AuthContext";
import { useHomePageData } from "../../hooks/useHomePageData";

import Hero from "../../components/ui/Hero.jsx";
import Carousel from "./components/Carousel.jsx";
import Collection from "./components/Collection.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import ErrorMessage from "../../components/ui/ErrorMessage.jsx";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { songs, artists, albums, playlists, loading, error } = useHomePageData();

  const featuredContent = useMemo(() => {
    if (loading || error) return { featuredPlaylistId: null, featuredAlbumId: null };
    
    const featuredPlaylistId = playlists[8]?._id || null;
    const featuredAlbumId = albums.length > 3 ? albums[2]._id : albums[1]?._id || null;

    return { featuredPlaylistId, featuredAlbumId };
  }, [playlists, albums, loading, error]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="home-content">
      <Hero
        title={isAuthenticated ? "You're home" : "Join Us"}
        subtitle="Music, reimagined — Memphis is a web application designed to provide a seamless, modern music listening experience. Users can build and manage personal playlists, and align new perspectives through sound."
        talents={artists.slice(0, 4)}
        bgImage="/hero-bg.jpg"
        songs={songs}
        playlists={playlists}
      />

      {playlists.length > 0 && (
        <Carousel
          title="Recommended Playlists"
          items={playlists}
          type="playlist"
        />
      )}
      
      {featuredContent.featuredPlaylistId && (
        <div className="home-featured-collection">
          <Collection collectionId={featuredContent.featuredPlaylistId} type="playlist" />
        </div>
      )}

      {artists.length > 0 && (
        <Carousel title="Selected Artists" items={artists} type="artist" />
      )}

      {albums.length > 0 && (
        <Carousel
          title="Popular Albums"
          items={albums}
          type="album"
        />
      )}

      {featuredContent.featuredAlbumId && (
        <div className="home-featured-collection">
          <Collection collectionId={featuredContent.featuredAlbumId} type="album" />
        </div>
      )}
    </div>
); };

export default HomePage;