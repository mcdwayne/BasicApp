#!/bin/bash

echo "🚀 Setting up Address News Finder with PostgreSQL Database"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Start PostgreSQL with Docker
start_database() {
    print_status "Starting PostgreSQL database with Docker..."
    
    if docker-compose up -d postgres; then
        print_success "PostgreSQL started successfully"
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        # Check if database is healthy
        if docker-compose exec postgres pg_isready -U postgres; then
            print_success "Database is ready"
        else
            print_warning "Database might not be ready yet, continuing..."
        fi
    else
        print_error "Failed to start PostgreSQL"
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend server..."
    
    cd server
    
    # Install dependencies
    if npm install; then
        print_success "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Create .env file
    if [ ! -f .env ]; then
        cp env.example .env
        print_success "Created .env file"
    else
        print_warning ".env file already exists"
    fi
    
    # Setup database
    print_status "Setting up database schema..."
    if npm run db:setup; then
        print_success "Database schema created successfully"
    else
        print_warning "Database setup failed, but continuing..."
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Install dependencies
    if npm install; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start backend in background
    print_status "Starting backend server..."
    cd server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a bit for backend to start
    sleep 3
    
    # Start frontend in background
    print_status "Starting frontend..."
    npm run dev &
    FRONTEND_PID=$!
    
    print_success "Services started!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔌 Backend: http://localhost:5000"
    echo "🗄️  Database: localhost:5432"
    echo "📊 pgAdmin: http://localhost:5050 (admin@example.com / admin)"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Cleanup function
cleanup() {
    print_status "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "Services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Main setup
main() {
    echo ""
    print_status "Checking prerequisites..."
    check_docker
    check_node
    
    echo ""
    print_status "Starting database..."
    start_database
    
    echo ""
    print_status "Setting up backend..."
    setup_backend
    
    echo ""
    print_status "Setting up frontend..."
    setup_frontend
    
    echo ""
    print_success "Setup completed successfully!"
    echo ""
    
    # Ask user if they want to start services
    read -p "Do you want to start the services now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_services
    else
        print_status "To start services later, run:"
        echo "  # Terminal 1: cd server && npm run dev"
        echo "  # Terminal 2: npm run dev"
        echo ""
        print_status "To start database: docker-compose up -d"
    fi
}

# Run main function
main
