# 🚀 Quick Start Guide

## Installation

### Option 1: Via npm (Coming Soon)
```bash
npm install -g ghost-cli
```

### Option 2: Build from Source
```bash
# Clone the repository
git clone https://github.com/ghostcli/ghost
cd ghost

# Install dependencies
bun install

# Build the binary
bun run build

# The binary will be at: dist/ghost
# Optionally, move it to your PATH:
sudo mv dist/ghost /usr/local/bin/
```

### Option 3: Download Pre-built Binary
```bash
# Coming soon - check releases page
curl -fsSL https://ghost.sh/install | sh
```

## First Steps

### 1. Initialize Ghost in Your Project

```bash
cd your-project
ghost init
```

This creates:
- `ghost.yaml` - Configuration file
- Updates `.gitignore` to exclude `.env`

### 2. Invite Your Team

```bash
# Automatically fetches SSH keys from GitHub
ghost invite @alice
ghost invite @bob

# Or with a custom name
ghost invite @charlie --name "Charlie Brown"

# List all recipients
ghost list
```

### 3. Encrypt Your Secrets

```bash
# Make sure you have a .env file
echo "DATABASE_URL=postgresql://localhost/mydb" > .env
echo "API_KEY=secret_key_123" >> .env

# Encrypt it
ghost push
```

This creates `.env.ghost` which is safe to commit.

### 4. Commit to Git

```bash
git add ghost.yaml .env.ghost
git commit -m "Add encrypted environment variables"
git push
```

### 5. Your Teammates Decrypt

```bash
# On another machine
git clone your-repo
cd your-repo

# Decrypt
ghost pull
```

Now they have the `.env` file!

## Optional: Install Git Hooks

Prevent accidents by installing a pre-commit hook:

```bash
ghost hook install
```

This hook will:
- Block commits if `.env` changed but `.env.ghost` didn't
- Remind you to run `ghost push`

## Common Workflows

### Adding a New Secret

```bash
# Edit .env
echo "NEW_SECRET=value" >> .env

# Re-encrypt
ghost push

# Commit
git add .env.ghost
git commit -m "Add new secret"
git push
```

### Rotating Secrets

```bash
# Update .env with new values
vim .env

# Re-encrypt
ghost push

# Commit
git add .env.ghost
git commit -m "Rotate API keys"
git push

# Notify team to pull
# Team members run: ghost pull
```

### Removing a Team Member

```bash
# Remove from recipients
ghost remove @bob

# IMPORTANT: Re-encrypt without them
ghost push

# Commit
git add ghost.yaml .env.ghost
git commit -m "Remove Bob from recipients"
git push
```

### Multiple Environments

```bash
# In ghost.yaml
settings:
  envFile: .env.production
  outputFile: .env.production.ghost

# Then
ghost push
```

## Troubleshooting

### "Decryption failed"

Possible reasons:
1. You're not in the recipients list - ask to be invited
2. Wrong SSH key - specify with `ghost pull --key ~/.ssh/other_key`
3. Corrupted file - re-pull from Git

### "No ghost.yaml found"

Run `ghost init` first in your project root.

### "User has no public SSH keys"

The GitHub user needs to add SSH keys to their GitHub account:
https://github.com/settings/keys

## Security Best Practices

1. ✅ **DO** commit `.env.ghost` and `ghost.yaml`
2. ✅ **DO** keep `.env` in `.gitignore`
3. ✅ **DO** run `ghost push` after removing team members
4. ✅ **DO** install Git hooks with `ghost hook install`
5. ❌ **DON'T** commit `.env` files
6. ❌ **DON'T** share private SSH keys
7. ❌ **DON'T** skip re-encryption after removing someone

## Next Steps

- Read the [full documentation](README.md)
- Check out [examples](examples/)
- Join our [Discord](https://discord.gg/ghost)
- Star us on [GitHub](https://github.com/ghostcli/ghost) ⭐

---

Need help? Open an issue or ask in Discord!
