import chalk from "chalk";
import { ConfigManager } from "../utils/config";

export async function removeCommand(username: string) {
  console.log(chalk.cyan(`👻 Removing ${username}...`));
  console.log();

  const configManager = new ConfigManager();

  if (!(await configManager.exists())) {
    console.log(chalk.red("✗ No ghost.yaml found"));
    console.log(chalk.dim("  Run 'ghost init' first"));
    process.exit(1);
  }

  try {
    // Remove @ se tiver
    const cleanUsername = username.replace(/^@/, "");

    await configManager.removeRecipient(cleanUsername);

    console.log(chalk.green("✓ Removed from ghost.yaml"));
    console.log();
    console.log(chalk.yellow("⚠ Important:"));
    console.log(
      chalk.dim("  Run ") +
        chalk.cyan("ghost push") +
        chalk.dim(" to re-encrypt secrets without this user")
    );
  } catch (error) {
    console.log(chalk.red("✗ Failed to remove user"));
    if (error instanceof Error) {
      console.log(chalk.dim(`  ${error.message}`));
    }
    process.exit(1);
  }
}
