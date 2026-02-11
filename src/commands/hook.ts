import chalk from "chalk";
import { GitUtils } from "../utils/git";
import { ConfigManager } from "../utils/config";

const PRE_COMMIT_HOOK = `#!/bin/sh
# Ghost Pre-commit Hook
# Prevents committing .env changes without updating .env.ghost

set -e

# Colors
RED='\\033[0;31m'
YELLOW='\\033[1;33m'
GREEN='\\033[0;32m'
NC='\\033[0m' # No Color

# Check if .env was modified
if git diff --cached --name-only | grep -q "^\\.env$"; then
  # Check if .env.ghost is also modified
  if ! git diff --cached --name-only | grep -q "^\\.env\\.ghost$"; then
    echo "\${RED}✗ Error: .env was modified but .env.ghost was not updated\${NC}"
    echo ""
    echo "\${YELLOW}You need to encrypt your secrets:\${NC}"
    echo "  \${GREEN}ghost push\${NC}"
    echo ""
    echo "Then stage the changes:"
    echo "  \${GREEN}git add .env.ghost\${NC}"
    echo ""
    exit 1
  fi
fi

# Check if .env.ghost exists but .env doesn't (sanity check)
if git diff --cached --name-only | grep -q "^\\.env\\.ghost$"; then
  if [ ! -f .env ]; then
    echo "\${YELLOW}⚠ Warning: .env.ghost exists but .env doesn't\${NC}"
    echo "  This is unusual. Run 'ghost pull' to restore .env"
  fi
fi

exit 0
`;

export async function hookCommand(action: string) {
  if (action === "install") {
    await installHook();
  } else if (action === "uninstall") {
    await uninstallHook();
  } else {
    console.log(chalk.red("✗ Unknown action"));
    console.log(chalk.dim("  Usage: ghost hook [install|uninstall]"));
    process.exit(1);
  }
}

async function installHook() {
  console.log(chalk.cyan("👻 Installing Git hooks..."));
  console.log();

  // Verifica se estamos em um repo Git
  const isGit = await GitUtils.isGitRepo();
  if (!isGit) {
    console.log(chalk.red("✗ Not a Git repository"));
    process.exit(1);
  }

  // Verifica se ghost.yaml existe
  const configManager = new ConfigManager();
  if (!(await configManager.exists())) {
    console.log(chalk.yellow("⚠ No ghost.yaml found"));
    console.log(chalk.dim("  Run 'ghost init' first"));
    process.exit(1);
  }

  try {
    // Instala o hook de pre-commit
    const success = await GitUtils.installHook("pre-commit", PRE_COMMIT_HOOK);

    if (!success) {
      console.log(chalk.red("✗ Failed to install hook"));
      process.exit(1);
    }

    console.log(chalk.green("✓ Installed pre-commit hook"));
    console.log();
    console.log(chalk.bold("What does this do?"));
    console.log(
      chalk.dim("  • Prevents committing .env without updating .env.ghost")
    );
    console.log(
      chalk.dim("  • Reminds you to run 'ghost push' before committing")
    );
    console.log();
    console.log(chalk.green("Your secrets are now protected! 🔐"));
  } catch (error) {
    console.log(chalk.red("✗ Installation failed"));
    if (error instanceof Error) {
      console.log(chalk.dim(`  ${error.message}`));
    }
    process.exit(1);
  }
}

async function uninstallHook() {
  console.log(chalk.cyan("👻 Uninstalling Git hooks..."));
  console.log();

  const repoRoot = await GitUtils.getRepoRoot();
  if (!repoRoot) {
    console.log(chalk.red("✗ Not a Git repository"));
    process.exit(1);
  }

  try {
    const hookPath = `${repoRoot}/.git/hooks/pre-commit`;
    await Bun.$`rm -f ${hookPath}`;

    console.log(chalk.green("✓ Removed pre-commit hook"));
  } catch (error) {
    console.log(chalk.red("✗ Uninstallation failed"));
    if (error instanceof Error) {
      console.log(chalk.dim(`  ${error.message}`));
    }
    process.exit(1);
  }
}
