#!/bin/bash
set -euo pipefail

# VibeCaaS UI Docker Build Script
# Builds all Docker images for different deployment scenarios

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGISTRY=${DOCKER_REGISTRY:-""}
TAG=${DOCKER_TAG:-"latest"}
BUILD_HASH=${BUILD_HASH:-$(git rev-parse --short HEAD 2>/dev/null || echo "dev-build")}

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

# Build arguments
BUILD_ARGS="--build-arg BUILD_HASH=${BUILD_HASH}"

# Check if Docker is available
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH"
    fi
    success "Docker is available"
}

# Build function
build_image() {
    local dockerfile=$1
    local image_name=$2
    local context=${3:-.}
    local additional_args=${4:-""}
    
    log "Building $image_name from $dockerfile..."
    
    local full_image_name="${REGISTRY}${REGISTRY:+\/}${image_name}:${TAG}"
    
    if docker build \
        -f "$dockerfile" \
        -t "$full_image_name" \
        $BUILD_ARGS \
        $additional_args \
        "$context"; then
        success "Built $full_image_name"
    else
        error "Failed to build $image_name"
    fi
}

# Build all images
build_all() {
    log "Building all VibeCaaS UI Docker images..."
    
    # Main application (combined)
    build_image "docker/Dockerfile.combined" "vibecaas-ui" "." ""
    
    # Frontend only
    build_image "docker/Dockerfile.frontend" "vibecaas-ui-frontend" "." ""
    
    # Backend only
    build_image "docker/Dockerfile.backend" "vibecaas-ui-backend" "." ""
    
    # Original Dockerfile (for compatibility)
    build_image "Dockerfile" "vibecaas-ui-original" "." ""
    
    success "All images built successfully!"
}

# Build specific image
build_specific() {
    local image_type=$1
    
    case $image_type in
        "combined")
            build_image "docker/Dockerfile.combined" "vibecaas-ui" "." ""
            ;;
        "frontend")
            build_image "docker/Dockerfile.frontend" "vibecaas-ui-frontend" "." ""
            ;;
        "backend")
            build_image "docker/Dockerfile.backend" "vibecaas-ui-backend" "." ""
            ;;
        "original")
            build_image "Dockerfile" "vibecaas-ui-original" "." ""
            ;;
        *)
            error "Unknown image type: $image_type. Available: combined, frontend, backend, original"
            ;;
    esac
}

# Build with CUDA support
build_cuda() {
    local image_type=${1:-"combined"}
    local cuda_version=${2:-"cu128"}
    
    log "Building $image_type with CUDA support (version: $cuda_version)..."
    
    local additional_args="--build-arg USE_CUDA=true --build-arg USE_CUDA_VER=$cuda_version"
    
    case $image_type in
        "combined")
            build_image "docker/Dockerfile.combined" "vibecaas-ui-cuda" "." "$additional_args"
            ;;
        "backend")
            build_image "docker/Dockerfile.backend" "vibecaas-ui-backend-cuda" "." "$additional_args"
            ;;
        *)
            error "CUDA build only supported for: combined, backend"
            ;;
    esac
}

# Build with Ollama
build_ollama() {
    local image_type=${1:-"combined"}
    
    log "Building $image_type with Ollama support..."
    
    local additional_args="--build-arg USE_OLLAMA=true"
    
    case $image_type in
        "combined")
            build_image "docker/Dockerfile.combined" "vibecaas-ui-ollama" "." "$additional_args"
            ;;
        "backend")
            build_image "docker/Dockerfile.backend" "vibecaas-ui-backend-ollama" "." "$additional_args"
            ;;
        *)
            error "Ollama build only supported for: combined, backend"
            ;;
    esac
}

# Show help
show_help() {
    echo "VibeCaaS UI Docker Build Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  all                    Build all images (default)"
    echo "  combined              Build combined frontend+backend image"
    echo "  frontend              Build frontend-only image"
    echo "  backend               Build backend-only image"
    echo "  original              Build original Dockerfile image"
    echo "  cuda [TYPE] [VER]     Build with CUDA support (TYPE: combined|backend, VER: cu117|cu118|cu121|cu128)"
    echo "  ollama [TYPE]         Build with Ollama support (TYPE: combined|backend)"
    echo "  help                  Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DOCKER_REGISTRY       Docker registry prefix (e.g., ghcr.io/username)"
    echo "  DOCKER_TAG            Docker image tag (default: latest)"
    echo "  BUILD_HASH            Build hash (default: git commit hash)"
    echo ""
    echo "Examples:"
    echo "  $0 all                                    # Build all images"
    echo "  $0 combined                               # Build combined image"
    echo "  $0 cuda combined cu128                    # Build CUDA-enabled combined image"
    echo "  $0 ollama backend                         # Build Ollama-enabled backend image"
    echo "  DOCKER_TAG=v1.0.0 $0 all                 # Build with custom tag"
    echo "  DOCKER_REGISTRY=ghcr.io/user $0 all      # Build with registry prefix"
}

# Main execution
main() {
    check_docker
    
    case "${1:-all}" in
        "all")
            build_all
            ;;
        "combined"|"frontend"|"backend"|"original")
            build_specific "$1"
            ;;
        "cuda")
            build_cuda "${2:-combined}" "${3:-cu128}"
            ;;
        "ollama")
            build_ollama "${2:-combined}"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Unknown command: $1. Use '$0 help' for usage information."
            ;;
    esac
}

# Run main function
main "$@"