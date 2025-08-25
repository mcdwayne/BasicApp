const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const SearchHistory = require('../models/SearchHistory');

// Helper function to parse address components
function parseAddress(addressText) {
  const parts = addressText.split(',').map(part => part.trim());
  
  return {
    addressText: addressText,
    city: parts[0] || null,
    state: parts[1] || null,
    country: parts[2] || 'USA',
    postalCode: parts[3] || null,
    latitude: null, // Could be enhanced with geocoding service
    longitude: null
  };
}

// POST /api/addresses/search - Search for news by address
router.post('/search', async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.body.userId || 1; // Default to demo user for now
    
    if (!address || !address.trim()) {
      return res.status(400).json({ 
        error: 'Address is required' 
      });
    }

    const startTime = Date.now();
    
    // Parse address components
    const addressData = parseAddress(address.trim());
    
    // Store/update address in database
    const savedAddress = await Address.create(userId, addressData);
    
    // Simulate news search (replace with actual news API call)
    const newsResults = await simulateNewsSearch(addressData);
    
    const searchDuration = Date.now() - startTime;
    
    // Record search history
    await SearchHistory.create(userId, savedAddress.id, {
      searchQuery: address,
      resultsCount: newsResults.articles.length,
      searchDurationMs: searchDuration
    });
    
    // Return results with database info
    res.json({
      success: true,
      address: savedAddress,
      news: newsResults,
      searchStats: {
        duration: searchDuration,
        resultsCount: newsResults.articles.length,
        searchCount: savedAddress.search_count
      }
    });
    
  } catch (error) {
    console.error('Error in address search:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/addresses - Get all addresses for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 1; // Default to demo user
    
    const addresses = await Address.findByUserId(userId);
    
    res.json({
      success: true,
      addresses: addresses
    });
    
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/addresses/:id - Get specific address
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const address = await Address.findById(id);
    
    if (!address) {
      return res.status(404).json({ 
        error: 'Address not found' 
      });
    }
    
    res.json({
      success: true,
      address: address
    });
    
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/addresses/stats - Get search statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.query.userId || 1; // Default to demo user
    
    const addressStats = await Address.getSearchStats(userId);
    const searchStats = await SearchHistory.getStats(userId);
    
    res.json({
      success: true,
      stats: {
        addresses: addressStats,
        searches: searchStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/addresses/history - Get search history
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId || 1; // Default to demo user
    const limit = parseInt(req.query.limit) || 50;
    
    const history = await SearchHistory.findByUserId(userId, limit);
    
    res.json({
      success: true,
      history: history
    });
    
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// DELETE /api/addresses/:id - Delete address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAddress = await Address.delete(id);
    
    if (!deletedAddress) {
      return res.status(404).json({ 
        error: 'Address not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Address deleted successfully',
      address: deletedAddress
    });
    
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Simulate news search (replace with actual news API)
async function simulateNewsSearch(addressData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const city = addressData.city || 'Unknown City';
  const state = addressData.state || 'Unknown State';
  
  return {
    address: addressData.addressText,
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
  };
}

module.exports = router;
