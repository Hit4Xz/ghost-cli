import chalk from "chalk";
import { ConfigManager } from "../utils/config";
import { GitUtils } from "../utils/git";
import { FileUtils } from "../utils/files";

export async function initCommand() {
  console.log(chalk.cyan("👻 Initializing Ghost..."));
  console.log();

  // Verifica se estamos em um repo Git
  const isGit = await GitUtils.isGitRepo();
  if (!isGit) {
    console.log(chalk.red("✗ Not a Git repository"));
    console.log(chalk.dim("  Run 'git init' first"));
    process.exit(1);
  }

  // Verifica se já existe ghost.yaml
  const configManager = new ConfigManager();
  const exists = await configManager.exists();

  if (exists) {
    console.log(chalk.yellow("⚠ ghost.yaml already exists"));
    console.log(chalk.dim("  Use 'ghost invite' to add recipients"));
    return;
  }

  // Cria ghost.yaml
  const config = await configManager.init();
  console.log(chalk.green("✓ Created ghost.yaml"));

  // Adiciona .env ao .gitignore se não estiver
  await FileUtils.ensureGitignore([".env", ".env.local", ".env.*.local"]);
  console.log(chalk.green("✓ Updated .gitignore"));

  console.log();
  console.log(chalk.bold("Next steps:"));
  console.log(chalk.dim("  1. Add team members: ") + chalk.cyan("ghost invite @username"));
  console.log(chalk.dim("  2. Encrypt your .env: ") + chalk.cyan("ghost push"));
  console.log(chalk.dim("  3. Install Git hooks:  ") + chalk.cyan("ghost hook install"));
  console.log();
  console.log(
    chalk.dim("Your secrets are now ready to be shared securely! 🔐")
  );
}
