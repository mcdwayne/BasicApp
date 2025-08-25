#!/bin/bash

echo "🚀 Starting Address News Finder Development Environment"
echo "======================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if database is running
check_database() {
    if ! docker-compose ps postgres | grep -q "Up"; then
        print_status "Starting PostgreSQL database..."
        docker-compose up -d postgres
        sleep 5
    else
        print_success "PostgreSQL is already running"
    fi
}

# Start backend
start_backend() {
    print_status "Starting backend server..."
    cd server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    sleep 3
}

# Start frontend
start_frontend() {
    print_status "Starting frontend..."
    npm run dev &
    FRONTEND_PID=$!
}

# Main execution
main() {
    # Check and start database
    check_database
    
    # Start backend
    start_backend
    
    # Start frontend
    start_frontend
    
    echo ""
    print_success "All services started!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔌 Backend: http://localhost:5000"
    echo "🗄️  Database: localhost:5432"
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

# Run main function
main
