#!/bin/bash

# VS Code Extensions Installer for Payload Next.js Supabase Bootstrapper
# Run this script to install all recommended VS Code extensions

echo "🚀 Installing VS Code Extensions for better development experience..."
echo

# Check if VS Code CLI is available
if ! command -v code &> /dev/null; then
    echo "❌ VS Code CLI not found. Please install VS Code and ensure 'code' command is available."
    echo "   In VS Code: Ctrl+Shift+P → 'Shell Command: Install code command in PATH'"
    exit 1
fi

# Essential extensions
echo "📦 Installing essential extensions..."
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next

# React/Next.js development
echo "⚛️  Installing React/Next.js extensions..."
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
code --install-extension formulahendry.auto-close-tag
code --install-extension ms-vscode.vscode-json

# Git and collaboration
echo "🔄 Installing Git extensions..."
code --install-extension eamodio.gitlens

# Productivity extensions
echo "⚡ Installing productivity extensions..."
code --install-extension christian-kohler.path-intellisense
code --install-extension christian-kohler.npm-intellisense
code --install-extension yzhang.markdown-all-in-one
code --install-extension aaron-bond.better-comments

# Development tools
echo "🛠️  Installing development tools..."
code --install-extension mikestead.dotenv
code --install-extension rangav.vscode-thunder-client
code --install-extension ms-azuretools.vscode-docker
code --install-extension mongodb.mongodb-vscode

echo
echo "✅ All extensions installed successfully!"
echo
echo "🔄 Please restart VS Code to ensure all extensions are properly loaded."
echo "📖 See SETUP-GUIDE.md for verification steps and troubleshooting."
echo
echo "💡 To verify the setup:"
echo "   1. Open any .ts/.tsx file"
echo "   2. Make some changes and save (Ctrl+S)"
echo "   3. Code should auto-format with single quotes and proper spacing"