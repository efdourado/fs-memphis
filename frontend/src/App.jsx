import React, { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import { PlayerProvider } from './context/PlayerContext';

import AppShell from './product/shell/AppShell';
import { NotebookProvider } from './product/listening/NotebookContext';
import ListeningRoomPage from './product/pages/ListeningRoomPage';
import NotebookPage from './product/pages/NotebookPage';
import ConnectionPage from './product/pages/ConnectionPage';
import { LibraryProvider } from './product/LibraryContext';
import SongsPage from './product/pages/SongsPage';
import UnheardPage from './product/pages/UnheardPage';
import SongPage from './product/pages/SongPage';
import PersonPage from './product/pages/PersonPage';
import ComparePage from './product/pages/ComparePage';
import ProductSearchPage from './product/pages/SearchPage';
import UpdatesPage from './product/pages/UpdatesPage';
import SavedPage from './product/pages/SavedPage';
import SignInPage from './product/pages/SignInPage';
import AboutPage from './product/pages/AboutPage';
import NotFoundPage from './product/pages/NotFoundPage';

const UnifiedAuthPage = lazy(() => import('./pages/Auth/UnifiedAuthPage'));
const LegacyShell = lazy(() => import('./components/layout/LegacyShell'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const LegacySongPage = lazy(() => import('./pages/SongPage'));
const DiscoverLabPage = lazy(() => import('./pages/DiscoverPage'));
const SpotifyPlaygroundPage = lazy(() => import('./pages/SpotifyPlaygroundPage'));
const MemphisArchivePage = lazy(() => import('./pages/MemphisArchivePage'));
const PostPage = lazy(() => import('./pages/PostPage'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));
const LibraryLayout = lazy(() => import('./pages/library/LibraryLayout'));
const LibraryHomePage = lazy(() => import('./pages/library/LibraryHomePage'));
const LibraryPlaylistsPage = lazy(() => import('./pages/library/LibraryPlaylistsPage'));
const LibrarySongsPage = lazy(() => import('./pages/library/LibrarySongsPage'));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'));
const TodayPage = lazy(() => import('./pages/TodayPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const SessionDetailPage = lazy(() => import('./pages/SessionDetailPage'));
const PatternsPage = lazy(() => import('./pages/PatternsPage'));
const ReferencesPage = lazy(() => import('./pages/ReferencesPage'));
const DesignArchivePage = lazy(() => import('./pages/DesignArchivePage'));
const AuthCallbackPage = lazy(() => import('./pages/Auth/AuthCallbackPage'));

const KnowledgeHubPage = lazy(() => import('./pages/knowledge/KnowledgeHubPage'));
const SongDossierPage = lazy(() => import('./pages/knowledge/SongDossierPage'));
const PersonDetailPage = lazy(() => import('./pages/knowledge/PersonDetailPage'));
const GenreDetailPage = lazy(() => import('./pages/knowledge/GenreDetailPage'));
const StoryDetailPage = lazy(() => import('./pages/knowledge/StoryDetailPage'));
const MemphisPicksPage = lazy(() => import('./pages/knowledge/MemphisPicksPage'));
const ComparisonPage = lazy(() => import('./pages/knowledge/ComparisonPage'));
const CreativeTechnologyPage = lazy(() => import('./pages/knowledge/CreativeTechnologyPage'));
const SourceLedgerPage = lazy(() => import('./pages/knowledge/SourceLedgerPage'));

const App = () => (
  <PlayerProvider>
    <LibraryProvider>
      <NotebookProvider>
      <Routes>
        {/* Memphis: the song experience */}
        <Route element={<AppShell />}>
          <Route path="/" element={<SongsPage />} />
          <Route path="/listen/:slug" element={<ListeningRoomPage />} />
          <Route path="/notebook" element={<NotebookPage />} />
          <Route path="/connections" element={<Navigate to="/connections/make-space" replace />} />
          <Route path="/connections/:id" element={<ConnectionPage />} />
          <Route path="/unheard" element={<UnheardPage />} />
          <Route path="/search" element={<ProductSearchPage />} />
          <Route path="/songs/:slug" element={<SongPage />} />
          <Route path="/people/:slug" element={<PersonPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/you" element={<Navigate to="/saved" replace />} />
          <Route path="/auth" element={<SignInPage />} />
          <Route path="/signin" element={<Navigate to="/auth" replace />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Design Archive: the original interface and the first knowledge prototype */}
        <Route element={<Suspense fallback={null}><LegacyShell /></Suspense>}>
          <Route path="/design-archive" element={<DesignArchivePage />} />
          <Route path="/archive/home" element={<HomePage />} />
          <Route path="/archive/search" element={<SearchPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/archive/auth" element={<UnifiedAuthPage />} />

          <Route path="/artist/:id" element={<CollectionPage type="artist" />} />
          <Route path="/playlist/:id" element={<CollectionPage type="playlist" />} />
          <Route path="/album/:id" element={<CollectionPage type="album" />} />
          <Route path="/song/:id" element={<LegacySongPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/discover" element={<DiscoverLabPage />} />
          <Route path="/spotify" element={<SpotifyPlaygroundPage />} />
          <Route path="/archives" element={<MemphisArchivePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/help" element={<ComingSoonPage />} />
          <Route path="/settings" element={<ComingSoonPage />} />
          <Route path="/feedback" element={<ComingSoonPage />} />

          <Route path="/atlas" element={<KnowledgeHubPage />} />
          <Route path="/atlas/song/die-young" element={<SongDossierPage />} />
          <Route path="/atlas/people/benny-blanco" element={<PersonDetailPage />} />
          <Route path="/genres/pop" element={<GenreDetailPage />} />
          <Route path="/stories/pop-youth" element={<StoryDetailPage />} />
          <Route path="/picks" element={<MemphisPicksPage />} />
          <Route path="/comparisons/breakthrough" element={<ComparisonPage />} />
          <Route path="/technology/ai-and-art" element={<CreativeTechnologyPage />} />
          <Route path="/sources" element={<SourceLedgerPage />} />

          <Route path="/today" element={<ProtectedRoute><TodayPage /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
          <Route path="/session/:id" element={<ProtectedRoute><SessionDetailPage /></ProtectedRoute>} />
          <Route path="/patterns" element={<ProtectedRoute><PatternsPage /></ProtectedRoute>} />
          <Route path="/references" element={<ProtectedRoute><ReferencesPage /></ProtectedRoute>} />

          <Route path="/library" element={<ProtectedRoute><LibraryLayout /></ProtectedRoute>}>
            <Route index element={<LibraryHomePage />} />
            <Route path="playlists" element={<LibraryPlaylistsPage />} />
            <Route path="songs" element={<LibrarySongsPage />} />
          </Route>

          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Route>
      </Routes>
    </NotebookProvider>
    </LibraryProvider>
  </PlayerProvider>
);

export default App;
