import React, { createContext, useState, useContext } from 'react';

const SongModalContext = createContext();

export const useSongModal = () => useContext(SongModalContext);

export const SongModalProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [song, setSong] = useState(null);
  const [menuContext, setMenuContext] = useState(null);
  
  const openMenu = (selectedSong, context = null) => {
    setSong(selectedSong);
    setMenuContext(context);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setSong(null);
    setMenuContext(null);
  };

  const value = {
    isMenuOpen,
    song,
    menuContext,
    openMenu,
    closeMenu,
  };

  return (
    <SongModalContext.Provider value={value}>
      {children}
    </SongModalContext.Provider>
); };