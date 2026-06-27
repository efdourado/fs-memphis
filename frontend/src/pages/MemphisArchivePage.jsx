import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { fetchPosts } from "../services/collectionService";

const typeLabels = {
  behind_scenes: "Bastidores",
  interview: "Interviews",
  event: "Events",
  diary: "Diaries",
  analysis: "Analysis",
  story: "Stories",
  tutorial: "Guides",
  podcast_notes: "Notes",
  news: "News",
};

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const excerpt = (content = "") => {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 180 ? `${normalized.slice(0, 180)}...` : normalized;
};

const MemphisArchivePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await fetchPosts();
        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError("Could not load Memphis archives.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = posts[0];
  const groupedPosts = useMemo(() => {
    return posts.reduce((groups, post) => {
      const key = post.type || "story";
      return {
        ...groups,
        [key]: [...(groups[key] || []), post],
      };
    }, {});
  }, [posts]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="memphis-archive-page">
      <section className="memphis-archive-hero">
        <p className="memphis-archive-hero__eyebrow">Memphis Archives</p>
        <h1>Bastidores, diaries, interviews, events.</h1>
        {featured ? (
          <Link to={`/post/${featured.slug}`} className="memphis-archive-feature">
            <span>{typeLabels[featured.type] || "Story"}</span>
            <strong>{featured.title}</strong>
            <p>{featured.subtitle || excerpt(featured.content)}</p>
          </Link>
        ) : (
          <p className="memphis-archive-empty">
            No published pieces yet. Admin Studio is ready for the first one.
          </p>
        )}
      </section>

      {Object.entries(groupedPosts).map(([type, items]) => (
        <section key={type} className="memphis-archive-section">
          <div className="memphis-archive-section__header">
            <h2>{typeLabels[type] || type}</h2>
            <span>{items.length}</span>
          </div>
          <div className="memphis-archive-list">
            {items.map((post) => (
              <Link key={post._id} to={`/post/${post.slug}`} className="memphis-archive-row">
                <div>
                  <strong>{post.title}</strong>
                  <p>{post.subtitle || excerpt(post.content)}</p>
                </div>
                <time>{formatDate(post.createdAt)}</time>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default MemphisArchivePage;
