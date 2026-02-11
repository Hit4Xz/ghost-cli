# 👻 Ghost CLI

**Git-native encrypted environment variables.** Share secrets with your team using SSH keys they already have.

```bash
# Add a teammate (fetches their GitHub SSH keys automatically)
ghost invite @octocat

# Encrypt your .env
ghost push

# Commit the encrypted file
git commit -m "Update secrets"

# Your teammate decrypts it
ghost pull
```

## 🎯 Why Ghost?

- **Zero New Keys**: Uses SSH keys your team already has
- **Git-Native**: Encrypted files live in your repo
- **Zero-Trust**: Only authorized recipients can decrypt
- **Auto-Sync**: Git hooks prevent accidentally committing unencrypted secrets
- **GitHub Integration**: Automatically fetches SSH keys from GitHub profiles

## 🚀 Quick Start

### Installation

```bash
# Via npm
npm install -g ghost-cli

# Via Bun
bun install -g ghost-cli

# Or download binary
curl -fsSL https://ghost.sh/install | sh
```

### Usage

```bash
# 1. Initialize in your repo
ghost init

# 2. Invite team members
ghost invite @alice
ghost invite @bob

# 3. Encrypt your .env
ghost push

# 4. Install Git hooks (optional but recommended)
ghost hook install

# 5. Commit and push
git add .env.ghost ghost.yaml
git commit -m "Add encrypted secrets"
git push
```

Your teammates can now:

```bash
git pull
ghost pull  # Decrypts .env.ghost → .env
```

## 📚 Commands

### `ghost init`
Initialize Ghost in your repository. Creates `ghost.yaml` and updates `.gitignore`.

### `ghost invite <username>`
Add a GitHub user as a recipient. Automatically fetches their SSH public keys.

```bash
ghost invite @octocat
ghost invite @alice --name "Alice Smith"
```

### `ghost push`
Encrypt `.env` and create `.env.ghost`. Automatically stages the file for commit.

```bash
ghost push
ghost push --no-add  # Don't stage automatically
```

### `ghost pull`
Decrypt `.env.ghost` back to `.env` using your SSH private key.

```bash
ghost pull
ghost pull --key ~/.ssh/custom_key
```

### `ghost list`
List all recipients who can decrypt secrets.

```bash
ghost list
```

### `ghost remove <username>`
Remove a recipient. **Important:** Run `ghost push` after to re-encrypt.

```bash
ghost remove @bob
ghost push  # Re-encrypt without Bob
```

### `ghost hook install`
Install Git pre-commit hook that prevents committing `.env` changes without updating `.env.ghost`.

```bash
ghost hook install
ghost hook uninstall  # Remove hooks
```

## 🔐 How It Works

Ghost uses **hybrid encryption** inspired by [age](https://age-encryption.org/):

1. **Encrypt**: Generates a random data key, encrypts your `.env` with it
2. **Share**: Encrypts the data key for each recipient's SSH public key
3. **Decrypt**: Recipients use their SSH private key to decrypt the data key, then decrypt the file

```
.env (plaintext)
    ↓
[encrypt with random key]
    ↓
.env.ghost (encrypted envelope)
    ├── Encrypted for @alice's SSH key
    ├── Encrypted for @bob's SSH key
    └── Encrypted for @charlie's SSH key
```

## 📁 File Structure

```
your-repo/
├── .env              # Your secrets (gitignored)
├── .env.ghost        # Encrypted secrets (committed)
├── ghost.yaml        # Recipients list (committed)
└── .gitignore        # Updated by ghost init
```

### `ghost.yaml` Format

```yaml
version: "1.0"
recipients:
  - name: octocat
    github: octocat
    publicKey: ssh-ed25519 AAAAC3Nza...
    addedAt: "2026-02-11T10:30:00.000Z"

settings:
  envFile: .env
  outputFile: .env.ghost
```

### `.env.ghost` Format

```json
{
  "version": "ghost-v1",
  "timestamp": "2026-02-11T10:30:00.000Z",
  "recipients": ["a1b2c3...", "d4e5f6..."],
  "data": "base64-encrypted-data...",
  "algorithm": "chacha20-poly1305"
}
```

## 🛡️ Security

- **Encryption**: ChaCha20-Poly1305 (authenticated encryption)
- **Key Exchange**: X25519 (Curve25519 Diffie-Hellman)
- **Keys**: Uses your existing SSH keys (Ed25519, RSA, ECDSA)
- **No Cloud**: Everything happens locally and in your Git repo
- **Auditable**: Encrypted files are in your version control history

## 🎨 Features

### ✅ Implemented
- [x] SSH key-based encryption
- [x] GitHub SSH key auto-fetch
- [x] Git pre-commit hooks
- [x] Multiple recipients
- [x] Automatic .gitignore management
- [x] Single binary distribution

### 🚧 Roadmap
- [ ] Age CLI integration (for production-grade crypto)
- [ ] Audit log (who encrypted what and when)
- [ ] Secret rotation workflow
- [ ] Support for multiple environments (.env.staging, .env.prod)
- [ ] Web UI for managing recipients
- [ ] Slack/Discord notifications on secret updates

## 🤝 Contributing

Contributions are welcome! This project is built with:

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **CLI**: Commander.js

```bash
git clone https://github.com/ghostcli/ghost
cd ghost
bun install
bun run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Credits

Inspired by:
- [age](https://age-encryption.org/) - Modern encryption tool
- [git-crypt](https://github.com/AGWA/git-crypt) - Transparent encryption in Git
- [SOPS](https://github.com/mozilla/sops) - Mozilla's secrets manager

---

Made with 👻 by the Ghost team
