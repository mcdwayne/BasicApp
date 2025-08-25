const pool = require('../database/config');

class SearchHistory {
  // Create a new search history record
  static async create(userId, addressId, searchData) {
    const {
      searchQuery,
      resultsCount,
      searchDurationMs
    } = searchData;

    try {
      const query = `
        INSERT INTO search_history (
          user_id, address_id, search_query, results_count, search_duration_ms
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        userId, addressId, searchQuery, resultsCount, searchDurationMs
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating search history:', error);
      throw error;
    }
  }

  // Get search history for a user
  static async findByUserId(userId, limit = 50) {
    try {
      const query = `
        SELECT 
          sh.*,
          a.address_text,
          a.city,
          a.state
        FROM search_history sh
        JOIN addresses a ON sh.address_id = a.id
        WHERE sh.user_id = $1
        ORDER BY sh.created_at DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error finding search history by user ID:', error);
      throw error;
    }
  }

  // Get search history for a specific address
  static async findByAddressId(addressId, limit = 20) {
    try {
      const query = `
        SELECT * FROM search_history 
        WHERE address_id = $1 
        ORDER BY created_at DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [addressId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error finding search history by address ID:', error);
      throw error;
    }
  }

  // Get search statistics for a user
  static async getStats(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_searches,
          AVG(results_count) as avg_results,
          AVG(search_duration_ms) as avg_duration,
          MIN(created_at) as first_search,
          MAX(created_at) as last_search
        FROM search_history 
        WHERE user_id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting search history stats:', error);
      throw error;
    }
  }

  // Get recent searches (last 7 days)
  static async getRecentSearches(userId, days = 7) {
    try {
      const query = `
        SELECT 
          sh.*,
          a.address_text,
          a.city,
          a.state
        FROM search_history sh
        JOIN addresses a ON sh.address_id = a.id
        WHERE sh.user_id = $1 
          AND sh.created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY sh.created_at DESC
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting recent searches:', error);
      throw error;
    }
  }

  // Delete old search history (cleanup)
  static async deleteOldRecords(daysOld = 90) {
    try {
      const query = `
        DELETE FROM search_history 
        WHERE created_at < NOW() - INTERVAL '${daysOld} days'
      `;
      
      const result = await pool.query(query);
      return result.rowCount;
    } catch (error) {
      console.error('Error deleting old search history:', error);
      throw error;
    }
  }
}

module.exports = SearchHistory;
