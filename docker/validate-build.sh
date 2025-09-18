#!/bin/bash
set -euo pipefail

# VibeCaaS UI Docker Build Validation Script
# Validates that Docker images can be built successfully

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

# Check if Docker is available
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH"
    fi
    success "Docker is available"
}

# Test Docker build
test_build() {
    local dockerfile=$1
    local image_name=$2
    local context=${3:-.}
    local additional_args=${4:-""}
    
    log "Testing build of $image_name from $dockerfile..."
    
    # Build with minimal args to test syntax
    if docker build \
        -f "$dockerfile" \
        -t "test-$image_name" \
        --build-arg BUILD_HASH=test-build \
        --build-arg UID=1001 \
        --build-arg GID=1001 \
        --build-arg USERNAME=vibecaas \
        $additional_args \
        "$context" > /tmp/docker-build.log 2>&1; then
        success "Build test passed for $image_name"
        # Clean up test image
        docker rmi "test-$image_name" > /dev/null 2>&1 || true
    else
        error "Build test failed for $image_name. Check /tmp/docker-build.log for details"
    fi
}

# Test docker-compose validation
test_compose_validation() {
    local compose_file=$1
    local name=$2
    
    log "Testing $name docker-compose validation..."
    
    if [ ! -f "$compose_file" ]; then
        error "Docker compose file not found: $compose_file"
    fi
    
    # Test if docker-compose can parse the file
    if command -v docker-compose &> /dev/null; then
        if docker-compose -f "$compose_file" config > /dev/null 2>&1; then
            success "$name docker-compose validation passed"
        else
            error "$name docker-compose validation failed"
        fi
    elif docker compose version &> /dev/null; then
        if docker compose -f "$compose_file" config > /dev/null 2>&1; then
            success "$name docker-compose validation passed"
        else
            error "$name docker-compose validation failed"
        fi
    else
        warning "Neither docker-compose nor docker compose available for validation"
    fi
}

# Main validation function
main() {
    log "Starting VibeCaaS UI Docker build validation..."
    
    check_docker
    
    # Test Dockerfile builds (syntax only, not full build)
    log "Testing Dockerfile syntax validation..."
    
    # Test main Dockerfile
    test_build "Dockerfile" "main" "." ""
    
    # Test frontend Dockerfile
    test_build "docker/Dockerfile.frontend" "frontend" "." ""
    
    # Test backend Dockerfile
    test_build "docker/Dockerfile.backend" "backend" "." ""
    
    # Test combined Dockerfile
    test_build "docker/Dockerfile.combined" "combined" "." ""
    
    # Test docker-compose files
    test_compose_validation "docker-compose.prod.yaml" "Production"
    test_compose_validation "docker-compose.monitoring.yaml" "Monitoring"
    
    # Test environment file
    if [ ! -f ".env" ]; then
        warning ".env file not found, creating from template"
        cp .env.production .env
    fi
    
    success "All Docker build validations passed!"
    log "Docker configurations are ready for deployment"
    
    # Show next steps
    echo ""
    log "Next steps:"
    echo "1. Configure your .env file with proper values"
    echo "2. Run: ./docker/deploy.sh deploy"
    echo "3. Or build specific images: ./docker/build.sh [image_type]"
}

# Run main function
main "$@"