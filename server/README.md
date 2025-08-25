# 🗄️ Address News Finder - Backend Server

A Node.js/Express backend server with PostgreSQL database for storing user address searches and search history.

## ✨ Features

- **PostgreSQL Database**: Stores user addresses, search history, and statistics
- **RESTful API**: Clean endpoints for address operations
- **Search Tracking**: Records every search with timing and result counts
- **User Management**: Supports multiple users (currently demo user)
- **Security**: Rate limiting, CORS, and Helmet security headers
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Quick Start

### Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** (version 16 or higher)
3. **npm** or **yarn**

### Installation

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=address_news_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=5000
   ```

4. **Set up the database**:
   ```bash
   npm run db:setup
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Tables

- **users**: User information (currently demo user)
- **addresses**: Stored addresses with search counts and metadata
- **search_history**: Individual search queries and results

### Key Features

- **Automatic timestamps**: Created/updated timestamps
- **Search counting**: Tracks how many times each address was searched
- **Geographic data**: Stores city, state, country, and coordinates
- **Performance indexes**: Optimized for fast queries

## 🔌 API Endpoints

### Address Search
- `POST /api/addresses/search` - Search for news by address

### Address Management
- `GET /api/addresses` - Get all addresses for a user
- `GET /api/addresses/:id` - Get specific address
- `DELETE /api/addresses/:id` - Delete address

### Analytics
- `GET /api/addresses/stats` - Get search statistics
- `GET /api/addresses/history` - Get search history

### Health Check
- `GET /health` - Server health status

## 📊 Data Flow

1. **User submits address** → Frontend calls `/api/addresses/search`
2. **Address parsed** → City, state, country extracted
3. **Database updated** → Address stored/updated with search count
4. **News search** → Simulated news API call (replace with real API)
5. **Search recorded** → Search history entry created
6. **Results returned** → News data + database statistics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `address_news_db` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

### Database Connection

The server uses connection pooling for optimal performance:
- **Max connections**: 20
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds

## 🛡️ Security Features

- **Rate limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domains
- **Helmet**: Security headers
- **Input validation**: Address validation and sanitization
- **Error handling**: No sensitive information leaked

## 📈 Performance

- **Database indexes** on frequently queried fields
- **Connection pooling** for database efficiency
- **Request logging** for monitoring
- **Graceful shutdown** handling

## 🚀 Production Deployment

1. **Set production environment**:
   ```env
   NODE_ENV=production
   ```

2. **Update CORS origins** in `server.js`

3. **Set secure JWT secret**:
   ```env
   JWT_SECRET=your_secure_secret_here
   ```

4. **Use PM2 or similar** for process management

5. **Set up reverse proxy** (Nginx/Apache)

## 🔍 Monitoring

- **Health check endpoint**: `/health`
- **Request logging**: All API requests logged
- **Error logging**: Comprehensive error tracking
- **Database connection status**: Automatic connection monitoring

## 🧪 Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Search for address
curl -X POST http://localhost:5000/api/addresses/search \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, New York, NY"}'

# Get search history
curl http://localhost:5000/api/addresses/history?userId=1
```

## 🔄 Future Enhancements

- **Real news API integration** (Google News, NewsAPI.org)
- **User authentication** with JWT
- **Geocoding service** for coordinates
- **Caching layer** (Redis)
- **Analytics dashboard** for search patterns
- **Email notifications** for new news
- **Mobile app API** support

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**:
   - Check PostgreSQL is running
   - Verify credentials in `.env`
   - Ensure database exists

2. **Port already in use**:
   - Change `PORT` in `.env`
   - Kill existing process on port 5000

3. **CORS errors**:
   - Check frontend URL in CORS config
   - Verify server is running on correct port

### Logs

Check server logs for detailed error information:
```bash
npm run dev
```

## 📚 Dependencies

- **Express**: Web framework
- **pg**: PostgreSQL client
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **dotenv**: Environment variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see main README for details
