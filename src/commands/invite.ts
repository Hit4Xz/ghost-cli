import chalk from "chalk";
import { ConfigManager } from "../utils/config";
import { GitHubUtils } from "../utils/github";
import type { Recipient } from "../types";

export async function inviteCommand(username: string, options: any) {
  console.log(chalk.cyan(`👻 Inviting ${username}...`));
  console.log();

  const configManager = new ConfigManager();

  // Verifica se ghost.yaml existe
  if (!(await configManager.exists())) {
    console.log(chalk.red("✗ No ghost.yaml found"));
    console.log(chalk.dim("  Run 'ghost init' first"));
    process.exit(1);
  }

  try {
    // Remove @ se o usuário colocou
    const cleanUsername = username.replace(/^@/, "");

    // Busca as chaves do GitHub
    console.log(chalk.dim(`  Fetching SSH keys from GitHub...`));
    const keys = await GitHubUtils.fetchUserKeys(cleanUsername);

    console.log(chalk.green(`✓ Found ${keys.length} SSH key(s)`));
    console.log();

    // Mostra as chaves encontradas
    keys.forEach((key, index) => {
      const keyType = GitHubUtils.getKeyType(key);
      const fingerprint = GitHubUtils.getKeyFingerprint(key);
      console.log(
        chalk.dim(`  ${index + 1}. `) +
          chalk.cyan(keyType) +
          chalk.dim(` ${fingerprint}...`)
      );
    });

    console.log();

    // Por padrão, usa a primeira chave (geralmente a principal)
    const selectedKey = keys[0];

    // Cria o recipient
    const recipient: Recipient = {
      name: options.name || cleanUsername,
      github: cleanUsername,
      publicKey: selectedKey,
      addedAt: new Date().toISOString(),
    };

    // Adiciona ao config
    await configManager.addRecipient(recipient);

    console.log(chalk.green("✓ Added to ghost.yaml"));
    console.log();
    console.log(chalk.bold("What's next?"));
    console.log(
      chalk.dim("  • Run ") +
        chalk.cyan("ghost push") +
        chalk.dim(" to encrypt .env for all recipients")
    );
    console.log(
      chalk.dim("  • ") +
        chalk.cyan(`@${cleanUsername}`) +
        chalk.dim(" can now run ") +
        chalk.cyan("ghost pull") +
        chalk.dim(" to decrypt")
    );
  } catch (error) {
    console.log(chalk.red("✗ Failed to invite user"));
    if (error instanceof Error) {
      console.log(chalk.dim(`  ${error.message}`));
    }
    process.exit(1);
  }
}
