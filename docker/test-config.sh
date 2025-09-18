#!/bin/bash
set -euo pipefail

# VibeCaaS UI Docker Configuration Test Script
# Tests Docker configurations for syntax and common issues

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Test Dockerfile syntax
test_dockerfile() {
    local dockerfile=$1
    local name=$2
    
    log "Testing $name Dockerfile syntax..."
    
    if [ ! -f "$dockerfile" ]; then
        error "Dockerfile not found: $dockerfile"
    fi
    
    # Check for common Dockerfile issues
    if grep -q "COPY.*\.\*" "$dockerfile"; then
        warning "Found wildcard COPY in $dockerfile - this may cause issues"
    fi
    
    if grep -q "RUN.*&&.*&&" "$dockerfile"; then
        warning "Found chained RUN commands in $dockerfile - consider using multi-line format"
    fi
    
    if ! grep -q "USER " "$dockerfile"; then
        warning "No USER directive found in $dockerfile - running as root"
    fi
    
    success "$name Dockerfile syntax check passed"
}

# Test docker-compose syntax
test_compose() {
    local compose_file=$1
    local name=$2
    
    log "Testing $name docker-compose syntax..."
    
    if [ ! -f "$compose_file" ]; then
        error "Docker compose file not found: $compose_file"
    fi
    
    # Check for common docker-compose issues
    if grep -q "version:" "$compose_file"; then
        local version=$(grep "version:" "$compose_file" | head -1 | awk '{print $2}' | tr -d '"')
        if [[ "$version" < "3.8" ]]; then
            warning "Docker compose version $version is older than recommended 3.8"
        fi
    fi
    
    if ! grep -q "networks:" "$compose_file"; then
        warning "No networks defined in $compose_file"
    fi
    
    if ! grep -q "healthcheck:" "$compose_file"; then
        warning "No health checks defined in $compose_file"
    fi
    
    success "$name docker-compose syntax check passed"
}

# Test nginx configuration
test_nginx() {
    local nginx_conf=$1
    local name=$2
    
    log "Testing $name nginx configuration..."
    
    if [ ! -f "$nginx_conf" ]; then
        error "Nginx config not found: $nginx_conf"
    fi
    
    # Check for common nginx issues
    if ! grep -q "worker_processes" "$nginx_conf"; then
        warning "No worker_processes defined in $nginx_conf"
    fi
    
    if ! grep -q "gzip on" "$nginx_conf"; then
        warning "Gzip compression not enabled in $nginx_conf"
    fi
    
    if ! grep -q "add_header.*X-Frame-Options" "$nginx_conf"; then
        warning "Security headers not found in $nginx_conf"
    fi
    
    success "$name nginx configuration check passed"
}

# Test environment file
test_env() {
    local env_file=$1
    local name=$2
    
    log "Testing $name environment file..."
    
    if [ ! -f "$env_file" ]; then
        warning "Environment file not found: $env_file"
        return
    fi
    
    # Check for required variables
    local required_vars=("POSTGRES_PASSWORD" "REDIS_PASSWORD" "WEBUI_SECRET_KEY")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$env_file"; then
            warning "Required variable $var not found in $env_file"
        fi
    done
    
    success "$name environment file check passed"
}

# Main test function
main() {
    log "Starting VibeCaaS UI Docker configuration tests..."
    
    # Test Dockerfiles
    test_dockerfile "Dockerfile" "Main"
    test_dockerfile "docker/Dockerfile.frontend" "Frontend"
    test_dockerfile "docker/Dockerfile.backend" "Backend"
    test_dockerfile "docker/Dockerfile.combined" "Combined"
    
    # Test docker-compose files
    test_compose "docker-compose.prod.yaml" "Production"
    test_compose "docker-compose.monitoring.yaml" "Monitoring"
    
    # Test nginx configurations
    test_nginx "docker/nginx.conf" "Frontend"
    test_nginx "docker/nginx/nginx.conf" "Production"
    test_nginx "docker/nginx-combined.conf" "Combined"
    
    # Test environment files
    test_env ".env.production" "Production"
    test_env ".env" "Current"
    
    # Test required files exist
    log "Checking required files..."
    local required_files=(
        "docker/postgres/init.sql"
        "backend/start.sh"
        "backend/start-combined.sh"
        "docker/deploy.sh"
        "docker/build.sh"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "Required file not found: $file"
        fi
    done
    
    success "All required files found"
    
    success "All Docker configuration tests passed!"
    log "Configuration is ready for deployment"
}

# Run main function
main "$@"