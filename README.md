# 📍 Address News Finder

A modern React web application that allows users to input an address and find related local news. Built with React, Vite, and modern CSS for a beautiful user experience.

## ✨ Features

- **Clean, Modern UI**: Beautiful gradient design with glassmorphism effects
- **Address Input**: Simple form to enter any address
- **Example Addresses**: Quick access to sample addresses for testing
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Loading States**: Smooth loading animations and user feedback
- **Error Handling**: Graceful error handling with user-friendly messages

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose** (for PostgreSQL database)

### Quick Setup (Recommended)

1. **Clone or download** this project to your local machine

2. **Run the automated setup**:
   ```bash
   ./setup.sh
   ```
   
   This will:
   - Check prerequisites
   - Start PostgreSQL database
   - Install all dependencies
   - Set up the database schema
   - Optionally start all services

### Manual Setup

1. **Start the database**:
   ```bash
   docker-compose up -d postgres
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**:
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your database credentials if needed
   cd ..
   ```

5. **Set up database schema**:
   ```bash
   cd server
   npm run db:setup
   cd ..
   ```

6. **Start the services**:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

7. **Open your browser** and navigate to `http://localhost:3000`

## 🛠️ Available Scripts

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally

### Backend
- `cd server && npm run dev` - Start backend development server
- `cd server && npm start` - Start backend production server
- `cd server && npm run db:setup` - Set up database schema

### Database
- `docker-compose up -d postgres` - Start PostgreSQL database
- `docker-compose down` - Stop PostgreSQL database
- `docker-compose up -d` - Start all services (including pgAdmin)

### Development
- `./setup.sh` - Automated setup script
- `./start-dev.sh` - Quick start for development

## 🎯 How to Use

1. **Enter an Address**: Type any address in the input field (e.g., "123 Main St, New York, NY")
2. **Click "Find News"**: Submit the form to search for related news
3. **View Results**: Browse through the news articles related to that location
4. **Try Examples**: Use the example address buttons for quick testing

## 🔧 Current Implementation

This application now includes a **full-stack implementation** with:

### Frontend
- React-based user interface
- Address input form with validation
- Beautiful news display with responsive design
- Real-time connection status to backend

### Backend
- Express.js REST API server
- PostgreSQL database for data persistence
- Address search tracking and history
- Search statistics and analytics

### Database
- **users**: User management (currently demo user)
- **addresses**: Stored addresses with search counts
- **search_history**: Individual search queries and results

### Data Flow
1. User submits address → Frontend calls backend API
2. Backend parses address → Stores in PostgreSQL
3. News search performed → Results returned to frontend
4. Search history recorded → Analytics updated

## 🚀 Production Deployment

To deploy this application with real news data, you would need to:

1. **Set up a backend API** that interfaces with news services like:
   - Google News API
   - NewsAPI.org
   - Bing News Search API

2. **Replace the mock data** in `App.jsx` with actual API calls

3. **Add environment variables** for API keys and endpoints

4. **Deploy to your preferred hosting service** (Vercel, Netlify, AWS, etc.)

## 🎨 Customization

The application is built with modern CSS and is highly customizable:

- **Colors**: Modify the gradient colors in CSS variables
- **Layout**: Adjust grid layouts and spacing
- **Components**: Add new features or modify existing ones
- **Styling**: Update the design system to match your brand

## 📱 Responsive Design

The application is fully responsive and includes:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly buttons and inputs
- Optimized typography for all screen sizes

## 🛡️ Error Handling

The application includes comprehensive error handling:
- Form validation
- API error handling
- User-friendly error messages
- Graceful fallbacks

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## 📞 Support

If you have any questions or need help with the application, please open an issue in the project repository.

---

**Note**: This is a demonstration application. For production use, you'll need to integrate with real news APIs and implement proper backend services.
