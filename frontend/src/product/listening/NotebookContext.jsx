import { createContext, useContext, useEffect, useState } from 'react';
import { NOTEBOOK_KEY, sanitizeNotebook, empty } from './notebook';
import { sanitizeDiscoveries } from './connections';

const NotebookContext = createContext(null);
export function NotebookProvider({ children }) {
  const [notebook, setNotebook] = useState(() => {
    try { return sanitizeNotebook(JSON.parse(localStorage.getItem(NOTEBOOK_KEY))); } catch { return empty; }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(notebook)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [notebook]);
  const toggleIdea = id => setNotebook(previous => ({ ...previous, saved: previous.saved.includes(id) ? previous.saved.filter(item => item !== id) : [...previous.saved, id] }));
  const note = (slug, text) => setNotebook(previous => ({ ...previous, notes: { ...previous.notes, [slug]: text } }));
  const progress = (slug, step) => setNotebook(previous => ({ ...previous, progress: { ...previous.progress, [slug]: Math.max(previous.progress[slug] || 0, step) } }));
  const saveDiscovery = discovery => setNotebook(previous => ({ ...previous, discoveries: sanitizeDiscoveries([...previous.discoveries.filter(item => item.id !== discovery.id), discovery]) }));
  const removeDiscovery = id => setNotebook(previous => ({ ...previous, discoveries: previous.discoveries.filter(item => item.id !== id) }));
  return <NotebookContext.Provider value={{ notebook, toggleIdea, note, progress, saveDiscovery, removeDiscovery, storageError }}>{children}</NotebookContext.Provider>;
}
export const useNotebook = () => useContext(NotebookContext);
export function KeepIdea({ slug, index }) {
  const { notebook, toggleIdea } = useNotebook();
  const id = `${slug}:${index}`;
  const saved = notebook.saved.includes(id);
  return <button className={`p-btn p-btn--small ${saved ? 'p-btn--fill' : ''}`} aria-pressed={saved} onClick={() => toggleIdea(id)}>{saved ? '✓ In your notebook' : '+ Keep this idea'}</button>;
}
