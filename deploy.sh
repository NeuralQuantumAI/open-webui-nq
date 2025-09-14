#!/bin/bash

# VibeCaaS iOS - GitHub Pages Deployment Script

echo "🚀 VibeCaaS iOS - GitHub Pages Deployment"
echo "========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: VibeCaaS iOS PWA"
fi

# Get GitHub username
echo "Please enter your GitHub username:"
read username

# Get repository name
echo "Please enter your repository name (default: vibecaas-ios):"
read reponame
reponame=${reponame:-vibecaas-ios}

# Add remote origin
echo ""
echo "📎 Setting up remote repository..."
git remote add origin "https://github.com/$username/$reponame.git" 2>/dev/null || git remote set-url origin "https://github.com/$username/$reponame.git"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/$username/$reponame/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Select 'main' branch and '/ (root)' folder"
echo "4. Click 'Save'"
echo ""
echo "🌐 Your app will be available at:"
echo "   https://$username.github.io/$reponame/"
echo ""
echo "⏰ Note: Initial deployment may take 10-20 minutes"
echo ""
echo "📱 To install as PWA:"
echo "   iOS: Safari → Share → Add to Home Screen"
echo "   Android: Chrome → Menu → Add to Home Screen"
echo ""
echo "🎉 Deployment script complete!"