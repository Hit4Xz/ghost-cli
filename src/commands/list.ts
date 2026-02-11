import chalk from "chalk";
import { ConfigManager } from "../utils/config";
import { GitHubUtils } from "../utils/github";

export async function listCommand() {
  console.log(chalk.cyan("👻 Team Members"));
  console.log();

  const configManager = new ConfigManager();

  if (!(await configManager.exists())) {
    console.log(chalk.red("✗ No ghost.yaml found"));
    console.log(chalk.dim("  Run 'ghost init' first"));
    process.exit(1);
  }

  const recipients = await configManager.listRecipients();

  if (recipients.length === 0) {
    console.log(chalk.yellow("No recipients yet"));
    console.log();
    console.log(chalk.dim("Add team members:"));
    console.log(chalk.cyan("  ghost invite @username"));
    return;
  }

  console.log(chalk.bold(`${recipients.length} recipient(s):`));
  console.log();

  recipients.forEach((recipient, index) => {
    const number = chalk.dim(`${index + 1}.`);
    const name = recipient.github
      ? chalk.cyan(`@${recipient.github}`)
      : chalk.cyan(recipient.name);
    const keyType = GitHubUtils.getKeyType(recipient.publicKey);
    const fingerprint = GitHubUtils.getKeyFingerprint(recipient.publicKey);
    const added = new Date(recipient.addedAt).toLocaleDateString();

    console.log(`${number} ${name}`);
    console.log(chalk.dim(`   Key: ${keyType} ${fingerprint}...`));
    console.log(chalk.dim(`   Added: ${added}`));
    console.log();
  });
}
