import React from 'react'
import './NewsResults.css'

const NewsResults = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="news-results">
      <div className="results-header">
        <h2>📰 News for {data.location}</h2>
        <p className="address-display">Address: {data.address}</p>
      </div>
      
      <div className="articles-grid">
        {data.articles.map((article, index) => (
          <article key={index} className="news-article">
            <div className="article-image">
              <img 
                src={article.image} 
                alt={article.title}
                loading="lazy"
              />
            </div>
            
            <div className="article-content">
              <h3 className="article-title">{article.title}</h3>
              <p className="article-description">{article.description}</p>
              
              <div className="article-meta">
                <span className="article-source">{article.source}</span>
                <span className="article-date">{formatDate(article.publishedAt)}</span>
              </div>
              
              <a 
                href={article.url} 
                className="read-more-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>
      
      <div className="results-footer">
        <p className="results-note">
          💡 <strong>Note:</strong> This is simulated news data for demonstration purposes. 
          In a production app, this would connect to real news APIs like Google News.
        </p>
      </div>
    </div>
  )
}

export default NewsResults
