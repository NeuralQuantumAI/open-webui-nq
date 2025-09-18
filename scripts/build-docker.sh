#!/bin/bash

# VibeCaaS UI - Docker Build Script
# This script builds the Docker image for VibeCaaS UI

set -e

echo "🐳 Building VibeCaaS UI Docker image..."

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

# Default values
IMAGE_NAME="vibecaas-ui"
TAG="latest"
PLATFORM="linux/amd64"
USE_CUDA="false"
USE_OLLAMA="false"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --cuda)
            USE_CUDA="true"
            shift
            ;;
        --ollama)
            USE_OLLAMA="true"
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --name NAME      Docker image name (default: vibecaas-ui)"
            echo "  --tag TAG        Docker image tag (default: latest)"
            echo "  --platform PLAT  Target platform (default: linux/amd64)"
            echo "  --cuda           Enable CUDA support"
            echo "  --ollama         Enable Ollama support"
            echo "  --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

print_status "Building Docker image: ${FULL_IMAGE_NAME}"
print_status "Platform: ${PLATFORM}"
print_status "CUDA: ${USE_CUDA}"
print_status "Ollama: ${USE_OLLAMA}"

# Build the Docker image
docker build \
    --platform="${PLATFORM}" \
    --build-arg="USE_CUDA=${USE_CUDA}" \
    --build-arg="USE_OLLAMA=${USE_OLLAMA}" \
    --build-arg="BUILD_HASH=$(git rev-parse HEAD 2>/dev/null || echo 'dev-build')" \
    -t "${FULL_IMAGE_NAME}" \
    .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully! 🎉"
    print_status "Image: ${FULL_IMAGE_NAME}"
    print_status "To run the container:"
    print_status "  docker run -p 8080:8080 ${FULL_IMAGE_NAME}"
else
    print_error "Docker build failed!"
    exit 1
fi