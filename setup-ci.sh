#!/bin/bash
set -euo pipefail

# VibeCaaS UI CI Setup Script
# Installs all dependencies needed for CI/CD pipeline

echo "🚀 Setting up VibeCaaS UI CI/CD environment..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd backend
pip install -e .
pip install --group dev -e .
cd ..

# Verify installations
echo "✅ Verifying installations..."

# Check Node.js tools
echo "Checking Node.js tools..."
npx prettier --version
npx eslint --version
npx vitest --version

# Check Python tools
echo "Checking Python tools..."
cd backend
python -c "import black; print(f'Black: {black.__version__}')"
python -c "import isort; print(f'isort: {isort.__version__}')"
python -c "import ruff; print(f'Ruff: {ruff.__version__}')"
python -c "import mypy; print(f'MyPy: {mypy.__version__}')"
cd ..

echo "🎉 CI/CD setup complete!"
echo ""
echo "Available commands:"
echo "  make check        - Run all quality checks"
echo "  make test         - Run all tests"
echo "  make ci-all       - Run all CI checks"
echo "  make docker-build - Build Docker images"