import React, { useEffect, useState } from "react";
import { Calendar, Tag, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const NEWS_API_KEY = "3859bb0d37bd442dbcf572c7bae0ef1a";

function Blog() {
  const location = useLocation();
  const [articles, setArticles] = useState(location.state?.articles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=ethiopian&pageSize=12&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        throw new Error(data.message || "News loading failed");
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!location.state?.articles) {
      fetchNews();
    }
  }, [location.state]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ethiopian News & Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest Ethiopian events, culture, and insights.
          </p>
        </motion.div>

        {isLoading && (
          <p className="text-center text-gray-600 mb-8">Loading news...</p>
        )}
        {error && (
          <p className="text-center text-red-600 mb-8">{error}</p>
        )}

        {articles.length > 0 && (
          <>
            {/* Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={articles[0].urlToImage || "/default-news.jpg"}
                      alt={articles[0].title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {articles[0].source?.name || "Unknown"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {articles[0].title}
                    </h2>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {articles[0].description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                      <Newspaper className="h-4 w-4 mr-1" />
                      <span className="mr-4">{articles[0].source?.name}</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(articles[0].publishedAt)}</span>
                    </div>
                    <a
                      href={articles[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Read Full Article
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Other Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={article.urlToImage || "/default-news.jpg"}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {article.source?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Newspaper className="h-4 w-4 mr-1" />
                        <span>{article.source?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block text-center border border-amber-600 text-amber-600 py-2 rounded-lg hover:bg-amber-600 hover:text-white transition-colors"
                    >
                      Read More
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Blog;
