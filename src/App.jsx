import React, { useState, useEffect } from 'react'
import AddressForm from './components/AddressForm'
import NewsResults from './components/NewsResults'
import { addressAPI, healthCheck } from './services/api'
import './App.css'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [serverStatus, setServerStatus] = useState('checking')
  const [searchStats, setSearchStats] = useState(null)

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus()
  }, [])

  const checkServerStatus = async () => {
    try {
      await healthCheck()
      setServerStatus('connected')
    } catch (err) {
      setServerStatus('disconnected')
      console.warn('Backend server not available, using mock data')
    }
  }

  const handleAddressSubmit = async (address) => {
    setLoading(true)
    setError(null)
    
    try {
      if (serverStatus === 'connected') {
        // Use real API
        const response = await addressAPI.search(address)
        setNewsData(response.news)
        setSearchStats(response.searchStats)
      } else {
        // Fallback to mock data
        const mockNewsData = await simulateNewsSearch(address)
        setNewsData(mockNewsData)
      }
    } catch (err) {
      setError('Failed to fetch news. Please try again.')
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
    }
  }

  // Simulate news search - fallback when backend is not available
  const simulateNewsSearch = async (address) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Extract city/state from address for demo purposes
    const addressParts = address.split(',').map(part => part.trim())
    const city = addressParts[0] || 'Unknown City'
    const state = addressParts[1] || 'Unknown State'
    
    return {
      address: address,
      location: `${city}, ${state}`,
      articles: [
        {
          title: `Local Development Plans Announced for ${city}`,
          description: `City officials have announced new development plans that will transform the downtown area of ${city}.`,
          source: 'Local News',
          publishedAt: new Date().toISOString(),
          url: '#',
          image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop'
        },
        {
          title: `${city} Community Center Receives State Grant`,
          description: `The ${city} Community Center has been awarded a significant state grant for facility improvements.`,
          source: 'State News',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          url: '#',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop'
        },
        {
          title: `New Business District Opens in ${city}`,
          description: `A new business district featuring local shops and restaurants has opened in the heart of ${city}.`,
          source: 'Business News',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          url: '#',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop'
        }
      ]
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📍 Address News Finder</h1>
        <p>Enter an address to find related local news and updates</p>
      </header>
      
      <main className="app-main">
        <AddressForm onSubmit={handleAddressSubmit} />
        
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching for news...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        
        {newsData && !loading && (
          <NewsResults data={newsData} />
        )}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <p>Powered by React • {serverStatus === 'connected' ? 'Connected to PostgreSQL Database' : 'Using simulated data'}</p>
          {serverStatus === 'connected' && searchStats && (
            <div className="search-stats">
              <span>Search count: {searchStats.searchCount}</span>
              <span>Results: {searchStats.resultsCount}</span>
              <span>Duration: {searchStats.duration}ms</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

export default App
