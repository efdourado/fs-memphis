import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from './api';

const LibraryContext = createContext(null);

// What the signed-in listener keeps, shared by every Save and Follow button,
// plus the count of unseen updates shown in the navigation.
export function LibraryProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(() => new Set());
  const [following, setFollowing] = useState(() => new Set());
  const [unseen, setUnseen] = useState(0);

  const applyState = (state) => {
    setSaved(new Set(state.saved));
    setFollowing(new Set(state.following));
  };

  const refreshUpdates = useCallback(() => {
    if (!isAuthenticated) {
      setUnseen(0);
      return;
    }
    api.updates().then((result) => setUnseen(result.unseen)).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSaved(new Set());
      setFollowing(new Set());
      setUnseen(0);
      return;
    }
    api.libraryState().then(applyState).catch(() => {});
    refreshUpdates();
  }, [isAuthenticated, refreshUpdates]);

  const requireAccount = useCallback(() => {
    if (isAuthenticated) return true;
    navigate('/signin', { state: { from: location.pathname + location.hash } });
    return false;
  }, [isAuthenticated, navigate, location]);

  const toggle = useCallback(async (set, setSet, slug, add, remove) => {
    if (!requireAccount()) return;
    const had = set.has(slug);
    setSet((previous) => {
      const next = new Set(previous);
      if (had) next.delete(slug); else next.add(slug);
      return next;
    });
    try {
      applyState(await (had ? remove(slug) : add(slug)));
      refreshUpdates();
    } catch {
      setSet((previous) => {
        const next = new Set(previous);
        if (had) next.add(slug); else next.delete(slug);
        return next;
      });
    }
  }, [requireAccount, refreshUpdates]);

  const value = useMemo(() => ({
    saved,
    following,
    unseen,
    setUnseen,
    refreshUpdates,
    requireAccount,
    toggleSave: (slug) => toggle(saved, setSaved, slug, api.save, api.unsave),
    toggleFollow: (slug) => toggle(following, setFollowing, slug, api.follow, api.unfollow),
  }), [saved, following, unseen, refreshUpdates, requireAccount, toggle]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => useContext(LibraryContext);
