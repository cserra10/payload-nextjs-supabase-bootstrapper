# 🚀 Developer Setup Guide

## Quick Setup for New Developers

### 1. Install VS Code Extensions

**Method 1: Using VS Code Extensions View**

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "@recommended"
4. Install all recommended extensions for this workspace

**Method 2: Command Line (Faster)**

```bash
# Essential extensions
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next

# Recommended extensions
code --install-extension eamodio.gitlens
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension christian-kohler.npm-intellisense
code --install-extension mikestead.dotenv
code --install-extension rangav.vscode-thunder-client
```

### 2. Configure VS Code Settings

The workspace settings are already configured in `.vscode/settings.json`. These will:

- Format code automatically on save
- Use single quotes for all strings
- Use 2 spaces for indentation
- Run ESLint fixes on save
- Organize imports automatically

### 3. Verify Setup

After installing extensions:

1. **Test Prettier formatting:**
   - Open any `.ts` or `.tsx` file
   - Make some formatting changes (add extra spaces, change quotes)
   - Save the file (Ctrl+S)
   - The file should auto-format with single quotes and proper spacing

2. **Test ESLint:**
   - Write some code with issues (unused variables, double quotes)
   - You should see red squiggles indicating problems
   - Save the file and many issues should auto-fix

3. **Test import organization:**
   - Add some imports in random order
   - Save the file
   - Imports should reorganize automatically

## 🎯 Code Standards Enforced

### Automatic Formatting (Prettier)

✅ Single quotes: `'hello'` not `"hello"`  
✅ Semicolons: Always included  
✅ 2 space indentation  
✅ 100 character line width  
✅ Trailing commas in objects/arrays  
✅ Spaces around braces: `{ key: value }`

### Linting Rules (ESLint)

✅ No unused variables (with `_` prefix exception)  
✅ Consistent import ordering  
✅ TypeScript best practices  
✅ React/Next.js specific rules

## 🔧 Manual Commands

If automatic formatting isn't working:

```bash
# Format all files
pnpm format

# Check formatting without fixing
pnpm format:check

# Run linting with auto-fix
pnpm lint

# Check linting without fixing
pnpm lint:check
```

## ⚠️ Troubleshooting

**"Prettier not working"**

- Restart VS Code (Ctrl+Shift+P → "Reload Window")
- Check if Prettier extension is enabled
- Verify the file is in workspace folder

**"ESLint showing errors"**

- Make sure you're in the project root directory
- Run `pnpm install` to ensure dependencies are installed
- Check ESLint output panel for detailed errors

**"Auto-format not happening on save"**

- Check VS Code settings: File → Preferences → Settings
- Search for "format on save" and ensure it's enabled
- Verify Prettier is set as default formatter

## 📋 Checklist for New Developers

- [ ] VS Code installed
- [ ] Essential extensions installed (Prettier, ESLint, TypeScript)
- [ ] Project dependencies installed (`pnpm install`)
- [ ] Environment setup (`pnpm setup-env development`)
- [ ] Auto-formatting working (test by saving a file)
- [ ] ESLint showing inline errors/warnings
- [ ] Development server starts (`pnpm dev`)

---

**Need help?** Check the full [README.md](./README.md) guide or ask the team!
