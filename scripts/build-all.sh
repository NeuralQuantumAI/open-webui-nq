#!/bin/bash

# VibeCaaS UI - Build All Platforms Script
# This script builds the web app, iOS app, and Android app

set -e

echo "🚀 Building VibeCaaS UI for all platforms..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build web application
print_status "Building web application..."
npm run build
print_success "Web application built successfully!"

# Sync Capacitor
print_status "Syncing Capacitor..."
npx cap sync
print_success "Capacitor synced successfully!"

# Build iOS app (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_status "Building iOS app..."
    npm run ios:build
    print_success "iOS app built successfully!"
else
    print_warning "Skipping iOS build (not on macOS)"
fi

# Build Android app
print_status "Building Android app..."
npm run android:build
print_success "Android app built successfully!"

print_success "All platforms built successfully! 🎉"
print_status "Web app: ./build/"
print_status "iOS app: ./ios/App/"
print_status "Android app: ./android/app/build/outputs/apk/"