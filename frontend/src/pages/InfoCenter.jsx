import React, { useState, useEffect } from "react";
import { RefreshCw, Twitter, Calendar, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const InfoCenter = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentQuote, setCurrentQuote] = useState({ text: "Loading...", author: "Loading..." });
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState({ quote: false, news: false });
  const [newsError, setNewsError] = useState(null);
  const navigate = useNavigate();

  const NEWS_API_KEY = '3859bb0d37bd442dbcf572c7bae0ef1a';

  const getNewQuote = async () => {
    setIsLoading(prev => ({ ...prev, quote: true }));
    try {
      const res = await fetch("http://api.quotable.io/random");
      const data = await res.json();
      setCurrentQuote({ text: data.content, author: data.author });
    } catch (error) {
      setCurrentQuote({ text: "Failed to fetch quote.", author: "API Error" });
    }
    setIsLoading(prev => ({ ...prev, quote: false }));
  };

  const fetchNews = async () => {
    setIsLoading(prev => ({ ...prev, news: true }));
    setNewsError(null);
    try {
      const response = await fetch(`http://newsapi.org/v2/everything?q=ethiopian&pageSize=5&apiKey=${NEWS_API_KEY}`);
      const data = await response.json();
      if (data.status === "ok") {
        setNews(data.articles);
      } else {
        throw new Error(data.message || "Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsError(error.message);
      setNews([
        {
          title: "News API limit reached or error occurred",
          publishedAt: new Date().toISOString(),
          source: { name: "System" }
        }
      ]);
    }
    setIsLoading(prev => ({ ...prev, news: false }));
  };

  useEffect(() => {
    getNewQuote();
    fetchNews();
  }, []);

  const tweet = () => {
    const tweetText = `"${currentQuote.text}" — ${currentQuote.author}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, "Tweet Window", "width=700,height=500");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Info <span className="text-amber-600">Center</span>
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Quote of the day
              </h3>
              <motion.button
                onClick={getNewQuote}
                disabled={isLoading.quote}
                className="p-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw
                  className={`h-5 w-5 text-amber-800 ${
                    isLoading.quote ? "animate-spin" : ""
                  }`}
                />
              </motion.button>
            </div>

            <motion.div
              key={currentQuote.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <blockquote className="text-lg text-gray-700 italic mb-4">
                "{currentQuote.text}"
              </blockquote>
              <cite className="text-amber-800 font-semibold">
                — {currentQuote.author}
              </cite>
            </motion.div>

            <div className="flex space-x-3">
              <button
                onClick={getNewQuote}
                disabled={isLoading.quote}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                New Quote
              </button>
              <button
                onClick={tweet}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-300 flex items-center space-x-2"
              >
                <Twitter className="h-4 w-4" />
                <span>Tweet</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 bg-gradient-to-r from-amber-800 to-amber-900 text-white p-6 rounded-xl"
            >
              <h4 className="text-xl font-bold mb-3">Daily Quotes</h4>
              <p className="text-amber-100">{currentQuote.text}</p>
            </motion.div>
          </motion.div>

          {/* News Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Today's News</h3>
              <motion.button
                onClick={fetchNews}
                disabled={isLoading.news}
                className="p-2 bg-amber-100 hover:bg-amber-200 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className={`h-5 w-5 text-amber-800 ${isLoading.news ? "animate-spin" : ""}`} />
              </motion.button>
            </div>

            {newsError && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">{newsError}</div>
            )}

            <div className="space-y-4">
              {isLoading.news ? (
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                news.map((article, index) => (
                  <motion.div
                    key={index}
                    onClick={() => navigate("/news", { state: { article } })}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="cursor-pointer border-l-4 border-amber-600 pl-4 py-2 hover:bg-gray-50 group"
                  >
                    <h4 className="font-semibold text-gray-900 group-hover:text-amber-800 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Newspaper className="h-4 w-4" />
                        <span>{article.source?.name}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
              <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full bg-gradient-to-r from-amber-800 to-amber-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            onClick={() => navigate("/blog", { state: { articles: news } })}
>
              View All Blog
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoCenter;
