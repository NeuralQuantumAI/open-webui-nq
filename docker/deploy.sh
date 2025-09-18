#!/bin/bash
set -euo pipefail

# VibeCaaS UI Production Deployment Script
# This script handles the complete deployment process

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yaml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
LOG_DIR="./logs"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH"
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed or not in PATH"
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file $ENV_FILE not found. Please copy .env.production to .env and configure it."
    fi
    
    success "Prerequisites check passed"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    mkdir -p "$BACKUP_DIR" "$LOG_DIR" "docker/ssl" "docker/logs"
    success "Directories created"
}

# Generate secrets if not provided
generate_secrets() {
    log "Checking and generating secrets..."
    
    if ! grep -q "your_secure_postgres_password_here" "$ENV_FILE"; then
        success "Database passwords are configured"
    else
        warning "Please update the database passwords in $ENV_FILE"
    fi
    
    if ! grep -q "your_webui_secret_key_here" "$ENV_FILE"; then
        success "WebUI secret key is configured"
    else
        warning "Please update the WebUI secret key in $ENV_FILE"
    fi
}

# Build images
build_images() {
    log "Building Docker images..."
    
    if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache; then
        success "Images built successfully"
    else
        error "Failed to build images"
    fi
}

# Deploy services
deploy_services() {
    log "Deploying services..."
    
    # Stop existing services
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --remove-orphans
    
    # Start services
    if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d; then
        success "Services deployed successfully"
    else
        error "Failed to deploy services"
    fi
}

# Wait for services to be healthy
wait_for_services() {
    log "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps | grep -q "unhealthy"; then
            log "Attempt $attempt/$max_attempts: Some services are still starting..."
            sleep 10
            ((attempt++))
        else
            success "All services are healthy"
            return 0
        fi
    done
    
    warning "Some services may not be fully healthy yet. Check with: docker-compose -f $COMPOSE_FILE ps"
}

# Show deployment status
show_status() {
    log "Deployment Status:"
    echo ""
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    echo ""
    log "Service URLs:"
    echo "  Frontend: http://localhost"
    echo "  Backend API: http://localhost/api"
    echo "  Ollama: http://localhost:11434"
    echo ""
    log "Useful commands:"
    echo "  View logs: docker-compose -f $COMPOSE_FILE logs -f [service_name]"
    echo "  Stop services: docker-compose -f $COMPOSE_FILE down"
    echo "  Restart service: docker-compose -f $COMPOSE_FILE restart [service_name]"
}

# Main deployment function
main() {
    log "Starting VibeCaaS UI deployment..."
    
    check_prerequisites
    create_directories
    generate_secrets
    build_images
    deploy_services
    wait_for_services
    show_status
    
    success "Deployment completed successfully!"
    log "Your VibeCaaS UI is now running at http://localhost"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        log "Stopping services..."
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
        success "Services stopped"
        ;;
    "restart")
        log "Restarting services..."
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart
        success "Services restarted"
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f "${2:-}"
        ;;
    "status")
        show_status
        ;;
    "backup")
        log "Creating backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec postgres pg_dump -U vibecaas vibecaas > "$BACKUP_DIR/backup_$timestamp.sql"
        success "Backup created: $BACKUP_DIR/backup_$timestamp.sql"
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|logs|status|backup}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the application (default)"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show logs (optionally specify service name)"
        echo "  status  - Show deployment status"
        echo "  backup  - Create database backup"
        exit 1
        ;;
esac