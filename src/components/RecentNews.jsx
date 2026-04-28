import { useEffect, useState } from "react";

function RecentNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://newsdata.io/api/1/news?apikey=pub_494c70500dfe4625ae9fea98e79cd0ce&country=in&language=en&category=top"
        );

        const data = await res.json();
        console.log("News API response:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch news");
        }

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("No news results found");
        }

        setArticles(data.results.slice(0, 5));
      } catch (err) {
        console.error("News error:", err);
        setError(err.message || "News load hoyni");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="news-card">Loading news...</div>;
  }

  if (error) {
    return <div className="news-card error-text">{error}</div>;
  }

  return (
    <div className="news-card">
      <h3>Recent News</h3>
      {articles.length === 0 ? (
        <p>No news found</p>
      ) : (
        <ul className="news-list">
          {articles.map((item, index) => (
            <li key={index} className="news-item">
              <a href={item.link} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentNews;