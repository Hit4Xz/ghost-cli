#!/usr/bin/env bun
/**
 * Ghost CLI Demo
 * 
 * This script demonstrates Ghost CLI functionality
 */

import chalk from "chalk";

const demo = `
${chalk.cyan.bold("👻 Ghost CLI Demo")}
${chalk.dim("━".repeat(50))}

${chalk.bold("1. Initialize Ghost")}
   ${chalk.dim("$")} ghost init
   ${chalk.green("✓")} Created ghost.yaml
   ${chalk.green("✓")} Updated .gitignore

${chalk.bold("2. Invite team members")}
   ${chalk.dim("$")} ghost invite @alice
   ${chalk.dim("  Fetching SSH keys from GitHub...")}
   ${chalk.green("✓")} Found 2 SSH key(s)
   ${chalk.dim("  1.")} ${chalk.cyan("ssh-ed25519")} ${chalk.dim("AAAAC3NzaC...")}
   ${chalk.green("✓")} Added to ghost.yaml

   ${chalk.dim("$")} ghost invite @bob
   ${chalk.green("✓")} Added to ghost.yaml

${chalk.bold("3. Encrypt your .env")}
   ${chalk.dim("$")} ghost push
   ${chalk.dim("  Reading .env...")}
   ${chalk.dim("  Found 12 environment variable(s)")}
   ${chalk.dim("  Encrypting for 2 recipient(s)...")}
   ${chalk.green("✓")} Created .env.ghost
   ${chalk.green("✓")} Staged .env.ghost for commit

${chalk.bold("4. Commit encrypted secrets")}
   ${chalk.dim("$")} git add ghost.yaml .env.ghost
   ${chalk.dim("$")} git commit -m "Add encrypted secrets"
   ${chalk.dim("$")} git push

${chalk.bold("5. Teammate pulls and decrypts")}
   ${chalk.dim("$")} git pull
   ${chalk.dim("$")} ghost pull
   ${chalk.dim("  Encrypted for 2 recipient(s)")}
   ${chalk.dim("  Attempting decryption...")}
   ${chalk.green("✓")} Decrypted to .env
   ${chalk.dim("  Restored 12 environment variable(s)")}

${chalk.bold("6. Install safety hooks")}
   ${chalk.dim("$")} ghost hook install
   ${chalk.green("✓")} Installed pre-commit hook
   ${chalk.dim("  Prevents committing .env without updating .env.ghost")}

${chalk.dim("━".repeat(50))}

${chalk.bold("Try it yourself:")}
   ${chalk.cyan("npm install -g ghost-cli")}
   ${chalk.cyan("ghost init")}

${chalk.dim("Learn more: https://github.com/ghostcli/ghost")}
`;

console.log(demo);
