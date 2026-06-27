import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { fetchPostBySlug } from "../services/collectionService";

const typeLabels = {
  behind_scenes: "Bastidores",
  interview: "Interview",
  event: "Event",
  diary: "Diary",
  analysis: "Analysis",
  story: "Story",
  tutorial: "Guide",
  podcast_notes: "Notes",
  news: "News",
};

const PostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await fetchPostBySlug(slug);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled) setError("Could not load this archive piece.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return null;

  return (
    <main className="post-page">
      <article className="post-page__article">
        <Link to="/archives" className="post-page__back">Archives</Link>
        <p className="post-page__eyebrow">{typeLabels[post.type] || "Story"}</p>
        <h1>{post.title}</h1>
        {post.subtitle && <p className="post-page__subtitle">{post.subtitle}</p>}
        <div className="post-page__meta">
          <span>{post.author?.name || "Memphis"}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="post-page__content">
          {post.content.split("\n").filter(Boolean).map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 16)}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
};

export default PostPage;
