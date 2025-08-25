const pool = require('../database/config');

class Address {
  // Create a new address search
  static async create(userId, addressData) {
    const {
      addressText,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude
    } = addressData;

    try {
      // Check if address already exists for this user
      const existingAddress = await this.findByUserAndText(userId, addressText);
      
      if (existingAddress) {
        // Update search count and last searched time
        const updateQuery = `
          UPDATE addresses 
          SET search_count = search_count + 1, 
              last_searched_at = CURRENT_TIMESTAMP,
              city = COALESCE($1, city),
              state = COALESCE($2, state),
              country = COALESCE($3, country),
              postal_code = COALESCE($4, postal_code),
              latitude = COALESCE($5, latitude),
              longitude = COALESCE($6, longitude)
          WHERE id = $7
          RETURNING *
        `;
        
        const result = await pool.query(updateQuery, [
          city, state, country, postalCode, latitude, longitude, existingAddress.id
        ]);
        
        return result.rows[0];
      } else {
        // Create new address record
        const insertQuery = `
          INSERT INTO addresses (
            user_id, address_text, city, state, country, postal_code, latitude, longitude
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        
        const result = await pool.query(insertQuery, [
          userId, addressText, city, state, country, postalCode, latitude, longitude
        ]);
        
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error creating/updating address:', error);
      throw error;
    }
  }

  // Find address by user ID and address text
  static async findByUserAndText(userId, addressText) {
    try {
      const query = `
        SELECT * FROM addresses 
        WHERE user_id = $1 AND LOWER(address_text) = LOWER($2)
      `;
      
      const result = await pool.query(query, [userId, addressText]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding address:', error);
      throw error;
    }
  }

  // Get all addresses for a user
  static async findByUserId(userId) {
    try {
      const query = `
        SELECT * FROM addresses 
        WHERE user_id = $1 
        ORDER BY last_searched_at DESC
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error finding addresses by user ID:', error);
      throw error;
    }
  }

  // Get address by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM addresses WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding address by ID:', error);
      throw error;
    }
  }

  // Update address
  static async update(id, updateData) {
    try {
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);
      
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const query = `UPDATE addresses SET ${setClause} WHERE id = $1 RETURNING *`;
      
      const result = await pool.query(query, [id, ...values]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Delete address
  static async delete(id) {
    try {
      const query = 'DELETE FROM addresses WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  // Get search statistics
  static async getSearchStats(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_searches,
          SUM(search_count) as total_queries,
          MAX(last_searched_at) as last_search,
          COUNT(DISTINCT city) as unique_cities,
          COUNT(DISTINCT state) as unique_states
        FROM addresses 
        WHERE user_id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting search stats:', error);
      throw error;
    }
  }
}

module.exports = Address;
