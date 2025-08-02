# Development Guide

This guide outlines the development setup, coding standards, and tools for this monorepo.

## 🛠️ Prerequisites

- **Node.js**: v20 or higher
- **pnpm**: v9.4.0 or higher (use exact version: `npm install -g pnpm@9.4.0`)
- **Git**: Latest version

## 🚀 Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd payload-nextjs-supabase-bootstrapper
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   First, you'll need to obtain the required environment values:
   
   **🔐 Getting Environment Values:**
   - **From your team:** Ask a team lead or DevOps engineer for the latest environment values
   - **From 1Password:** Check the shared vault for "Payload Next.js Bootstrap - Dev Environment" 
   - **From password manager:** Look for entries tagged with this project name
   - **From secure document sharing:** Team may share via secure platforms like Bitwarden, LastPass, etc.

   **📝 Setting up the files:**
   
   The project uses centralized environment management. Run the setup script to create the environment files:
   
   ```bash
   pnpm setup-env development
   ```
   
   This creates individual `.env.development` files for each package. You'll need to populate the empty values:
   
   **🗂️ Files created:**
   - `packages/api/.env.development` - API and database configurations
   - `packages/web/.env.development` - Web app configurations  
   - `packages/web-demo/.env.development` - Demo app configurations
   - `packages/db/.env.development` - Database credentials
   
   **⚠️ Important Environment Variables to Configure:**
   ```bash
   # Database (MongoDB/PostgreSQL)
   DATABASE_URI=mongodb://admin:password@localhost:27017/mongodb
   
   # Supabase (Authentication & Database)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # Payload CMS
   PAYLOAD_SECRET=your-payload-secret-key
   
   # External APIs (if used)
   NEXT_PUBLIC_MAPBOX_API_KEY=your-mapbox-key
   ```
   
   **🚨 Security Notes:**
   - Never commit real environment values to git
   - The `.env*` files are already in `.gitignore`
   - Always use development/staging values for local development
   - Ask your team lead before using production credentials locally

4. **Start development servers**
   ```bash
   pnpm dev
   ```

## 📋 Code Standards

### Code Style

- **Quotes**: Always use single quotes (`'`) for strings
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Always include semicolons
- **Line width**: 100 characters maximum
- **Object spacing**: Spaces around braces `{ key: value }`

### Import Conventions

```typescript
// ✅ Good - Single quotes, organized imports
import type { ReactNode } from 'react';

import { useState, useEffect } from 'react';
import { NextRouter } from 'next/router';

import { formatDate } from '../utils/date';
import { Button } from './Button';

// ❌ Bad - Double quotes, mixed import styles
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
```

### TypeScript Guidelines

- Use `type` imports when importing only types
- Prefer explicit return types for functions
- Use proper TypeScript types instead of `any`
- Use consistent naming: PascalCase for components, camelCase for variables

## 🔧 Required VS Code Extensions

Install these extensions for the best development experience:

### Essential

- **ESLint** (`dbaeumer.vscode-eslint`) - Code linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **TypeScript** (`ms-vscode.vscode-typescript-next`) - Enhanced TS support

### Recommended

- **GitLens** (`eamodio.gitlens`) - Git integration
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`) - HTML/JSX tag renaming
- **Bracket Pair Colorizer** (`CoenraadS.bracket-pair-colorizer-2`) - Visual brackets
- **Path Intellisense** (`christian-kohler.path-intellisense`) - File path completion
- **Thunder Client** (`rangav.vscode-thunder-client`) - API testing
- **MongoDB** (`mongodb.mongodb-vscode`) - Database integration

### Installation

```bash
# Install all recommended extensions at once
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension eamodio.gitlens
```

## 🎯 Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev                    # Start all services (db, api, web)
pnpm dev-with-demo         # Start all services including web-demo

# Code Quality
pnpm lint                  # Run ESLint across all packages
pnpm lint:check           # Check linting without fixing
pnpm format               # Format code with Prettier
pnpm format:check         # Check formatting without fixing

# Building
pnpm build                # Build all packages
pnpm clean                # Clean all build artifacts

# Environment
pnpm setup-env development  # Set up development environment
pnpm setup-env production   # Set up production environment
```

### Package-Specific Commands

```bash
# API package
pnpm api:dev              # Start API in development
pnpm api:build            # Build API package

# Web package
pnpm web:dev              # Start web app in development
pnpm web:build            # Build web package

# Web Demo package
pnpm web-demo:dev         # Start demo app in development
pnpm web-demo:build       # Build demo package

# Database
pnpm db:dev               # Start development database
pnpm db:prod              # Start production database
pnpm db:stop              # Stop database containers
```

## 🔍 Code Quality Tools

### Linting (ESLint)

- Configuration: `eslint.config.mjs` (root) and package-specific configs
- Rules enforce single quotes, proper imports, TypeScript best practices
- Auto-fixes available issues when possible

### Formatting (Prettier)

- Configuration: `prettier.config.mjs` (shared across all packages)
- Enforces consistent code style automatically
- Integrates with VS Code for format-on-save

### Editor Configuration

- `.editorconfig` ensures consistent settings across editors
- `.vscode/settings.json` provides VS Code-specific configuration
- Auto-formatting on save and paste enabled

## 🏗️ Project Structure

```
payload-nextjs-supabase-bootstrapper/
├── packages/
│   ├── api/              # Payload CMS backend
│   ├── db/               # Database configuration  
│   ├── web/              # Main Next.js frontend
│   └── web-demo/         # Demo Next.js application
├── .vscode/              # VS Code workspace settings
├── scripts/              # Setup and utility scripts
├── prettier.config.mjs   # Shared Prettier configuration
├── eslint.config.mjs     # Shared ESLint configuration
├── .editorconfig         # Editor configuration
├── setup-env.sh          # Environment setup script
├── master-env.example    # Template for environment values
└── README.md             # This file
```

### Environment Management

The project uses a centralized environment system:

- **`master-env.example`** - Template showing all required environment variables
- **`setup-env.sh`** - Script that distributes environment variables to packages
- **`.master-env.development`** - Local development values (not in git)
- **`.master-env.production`** - Local production values (not in git)
- **Individual `.env.*` files** - Generated per package (not in git)

**Workflow:**
1. Get environment values from team/1Password
2. Create `.master-env.development` based on the example
3. Run `pnpm setup-env development` to distribute values
4. All packages automatically get their required environment variables

## 💡 Development Tips

### Code Formatting

- **Auto-format**: Files are automatically formatted on save
- **Manual format**: Use `Shift + Alt + F` in VS Code
- **Check formatting**: Run `pnpm format:check` before committing

### Linting

- **Auto-fix**: Most linting issues are fixed automatically on save
- **Manual check**: Run `pnpm lint` to see all issues
- **VS Code integration**: Issues shown inline with red squiggles

### Git Workflow

- Always run `pnpm lint` and `pnpm format:check` before committing
- Use conventional commit messages
- Pre-commit hooks will run automatically (if configured)

### Import Organization

ESLint automatically organizes imports in this order:

1. Type imports
2. External packages (npm modules)
3. Internal utilities
4. Relative imports (same directory/parent)

## 🐛 Troubleshooting

### Common Issues

**"Prettier not formatting"**

- Ensure Prettier extension is installed and enabled
- Check that `prettier.requireConfig` is true in VS Code settings
- Restart VS Code window (`Ctrl+Shift+P` → "Reload Window")

**"ESLint not working"**

- Verify ESLint extension is installed
- Check the ESLint output panel for errors
- Ensure you're in the correct working directory

**"Import not found"**

- Check TypeScript path mapping in `tsconfig.json`
- Verify file extensions are correct
- Use relative paths for local imports

### Getting Help

1. Check the VS Code Problems panel (`Ctrl+Shift+M`)
2. Look at ESLint/Prettier output panels
3. Run `pnpm lint` and `pnpm format:check` in terminal
4. Review this guide and package.json scripts

## 🔄 Updating Dependencies

```bash
# Update all dependencies
pnpm update -r

# Update specific package
pnpm update <package-name> --filter <workspace>

# Check outdated packages
pnpm outdated -r
```

---

**Happy coding! 🎉**

For questions or issues, please refer to the project README or create an issue in the repository.
