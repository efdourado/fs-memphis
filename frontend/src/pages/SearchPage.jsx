import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as searchService from '../services/searchService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import List from '../components/ui/List';
import Card from '../components/ui/Card';
import ComingSoonPage from './ComingSoonPage';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setResults(null);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await searchService.search(query);
        setResults(data);
      } catch (err) {
        setError('Failed to perform search. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
    } };

    performSearch();
  }, [query]);

  if (!query) return <ComingSoonPage />;
  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;

  const noResults = results && !results.songs?.length && !results.artists?.length && !results.albums?.length;

  return (
    <div className="library-page">
      <div className="search-page">
        <div className="carousel__header">
          {query && <h1 className="carousel__title">Results for "{query}"</h1>}
        </div>

        {noResults && <p>We looked everywhere... but found nothing for "{query}" 😕. Maybe it's hiding? Try searching again!</p>}  
      </div>

      {results?.songs?.length > 0 && (
        <>
          <div className="carousel__header">
            <h1 className="carousel__title">Songs</h1>
          </div>

          <section className="search-results-section">

            <List
              items={results.songs}
              type="song"
              showImage={true}
              displayAll={true}
              showAlbum={true}
              showDuration={true}
            />
          </section>
        </>
      )}

      {results?.albums?.length > 0 && (
        <>
          <div className="carousel__header">
            <h1 className="carousel__title">Albums</h1>
          </div>
          
          <section className="search-results-section">
            <div className="results-grid">
              {results.albums.map(item => <Card key={item._id} item={item} type="album" />)}
            </div>
          </section>
        </>
      )}

      {results?.artists?.length > 0 && (
        <>
          <div className="carousel__header">
            <h1 className="carousel__title">Artists</h1>
          </div>
          
          <section className="search-results-section">
            <div className="results-grid">
              {results.artists.map(item => <Card key={item._id} item={item} type="artist" />)}
            </div>
          </section>
        </>
      )}
    </div>
); };

export default SearchPage;