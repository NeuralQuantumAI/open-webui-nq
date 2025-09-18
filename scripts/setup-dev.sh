#!/bin/bash

# VibeCaaS UI - Development Setup Script
# This script sets up the development environment for VibeCaaS UI

set -e

echo "🛠️ Setting up VibeCaaS UI development environment..."

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
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    print_status "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Initialize Capacitor (if not already initialized)
if [ ! -d "ios" ] || [ ! -d "android" ]; then
    print_status "Initializing Capacitor..."
    npx cap init "VibeCaaS UI" "com.vibecaas.ui"
    npx cap add ios
    npx cap add android
    print_success "Capacitor initialized!"
else
    print_status "Capacitor already initialized"
fi

# Sync Capacitor
print_status "Syncing Capacitor..."
npx cap sync

# Check for iOS development tools (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcodebuild &> /dev/null; then
        print_success "Xcode found: $(xcodebuild -version | head -n1)"
    else
        print_warning "Xcode not found. iOS development requires Xcode."
        print_status "Install from: https://developer.apple.com/xcode/"
    fi
else
    print_warning "iOS development requires macOS"
fi

# Check for Android development tools
if command -v adb &> /dev/null; then
    print_success "Android SDK found"
else
    print_warning "Android SDK not found. Android development requires Android Studio."
    print_status "Install from: https://developer.android.com/studio"
fi

# Create development scripts
print_status "Creating development scripts..."

# Web development script
cat > scripts/dev-web.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting VibeCaaS UI web development server..."
npm run dev
EOF

# iOS development script
cat > scripts/dev-ios.sh << 'EOF'
#!/bin/bash
echo "🍎 Starting VibeCaaS UI iOS development..."
npm run build
npx cap sync ios
npx cap open ios
EOF

# Android development script
cat > scripts/dev-android.sh << 'EOF'
#!/bin/bash
echo "🤖 Starting VibeCaaS UI Android development..."
npm run build
npx cap sync android
npx cap open android
EOF

# Make scripts executable
chmod +x scripts/dev-web.sh
chmod +x scripts/dev-ios.sh
chmod +x scripts/dev-android.sh

print_success "Development environment setup complete! 🎉"
print_status ""
print_status "Available commands:"
print_status "  npm run dev          - Start web development server"
print_status "  npm run build        - Build web application"
print_status "  npm run ios:open     - Open iOS project in Xcode"
print_status "  npm run android:open - Open Android project in Android Studio"
print_status "  npm run mobile:sync  - Sync mobile apps"
print_status ""
print_status "Development scripts:"
print_status "  ./scripts/dev-web.sh     - Start web development"
print_status "  ./scripts/dev-ios.sh     - Start iOS development"
print_status "  ./scripts/dev-android.sh - Start Android development"
print_status "  ./scripts/build-all.sh   - Build all platforms"
print_status "  ./scripts/build-docker.sh - Build Docker image"