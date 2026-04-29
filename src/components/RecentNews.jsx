"use client";

import { useEffect, useState } from "react";

export default function RecentNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        // Note: Using a reliable public news source or RSS proxy is better 
        // than an API key if you want to avoid rate limits or key exposure.
        // This is a placeholder for your news fetch logic.
        const res = await fetch(
          "https://newsdata.io/api/1/news?apikey=pub_494c70500dfe4625ae9fea98e79cd0ce&country=in&language=en&category=top"
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch news");
        if (!data.results || !Array.isArray(data.results)) throw new Error("No news found");

        setArticles(data.results.slice(0, 4));
      } catch (err) {
        console.error("News error:", err);
        setError("News feed currently unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-300">Daily Updates</p>
          <h2 className="text-2xl font-bold text-white">Recent News</h2>
        </div>
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
          India
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-800" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-cyan-500/50 hover:bg-slate-900"
            >
              <h3 className="font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                {item.title}
              </h3>
              <p className="mt-4 text-xs text-slate-500 italic">
                {item.source_id || "Source"} • {new Date(item.pubDate).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}