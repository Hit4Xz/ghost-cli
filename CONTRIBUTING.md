# Contributing to Ghost CLI

Thanks for your interest in contributing! 🎉

## Development Setup

```bash
# Clone the repo
git clone https://github.com/ghostcli/ghost
cd ghost

# Install dependencies
bun install

# Run in dev mode
bun run dev

# Run tests
bun test

# Build binary
bun run build
```

## Project Structure

```
src/
├── commands/       # CLI command implementations
│   ├── init.ts    # ghost init
│   ├── invite.ts  # ghost invite
│   ├── push.ts    # ghost push
│   ├── pull.ts    # ghost pull
│   └── ...
├── core/          # Core crypto logic
│   └── crypto.ts
├── utils/         # Helper utilities
│   ├── config.ts  # ghost.yaml management
│   ├── git.ts     # Git integration
│   ├── github.ts  # GitHub API
│   └── files.ts   # File operations
├── types/         # TypeScript types
└── index.ts       # Main CLI entry
```

## Guidelines

1. **TypeScript**: Use strict typing
2. **Tests**: Add tests for new features
3. **Formatting**: Use `bun fmt` before committing
4. **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)

## Testing

```bash
# Run all tests
bun test

# Run specific test
bun test tests/crypto.test.ts

# Watch mode
bun test --watch
```

## Building

```bash
# Build for current platform
bun run build

# The binary will be in dist/ghost
./dist/ghost --help
```

## Pull Request Process

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Add tests
5. Run tests: `bun test`
6. Commit: `git commit -m "feat: add amazing feature"`
7. Push: `git push origin feat/amazing-feature`
8. Open a Pull Request

## Code Style

We use Bun's built-in formatter:

```bash
bun fmt
```

## Questions?

Open an issue or join our Discord: [discord.gg/ghost](https://discord.gg/ghost)
