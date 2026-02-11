import chalk from "chalk";
import { ConfigManager } from "../utils/config";
import { FileUtils } from "../utils/files";
import { GitUtils } from "../utils/git";
import { GhostCrypto } from "../core/crypto";

export async function pushCommand(options: any) {
  console.log(chalk.cyan("👻 Ghosting your secrets..."));
  console.log();

  const configManager = new ConfigManager();

  // Verifica se ghost.yaml existe
  if (!(await configManager.exists())) {
    console.log(chalk.red("✗ No ghost.yaml found"));
    console.log(chalk.dim("  Run 'ghost init' first"));
    process.exit(1);
  }

  // Carrega configuração
  const config = await configManager.load();
  if (!config) {
    console.log(chalk.red("✗ Failed to load configuration"));
    process.exit(1);
  }

  // Verifica se há recipients
  if (config.recipients.length === 0) {
    console.log(chalk.yellow("⚠ No recipients found"));
    console.log(chalk.dim("  Add team members first: ") + chalk.cyan("ghost invite @username"));
    process.exit(1);
  }

  // Define arquivos
  const envFile = config.settings?.envFile || ".env";
  const outputFile = config.settings?.outputFile || ".env.ghost";

  // Verifica se .env existe
  if (!(await FileUtils.exists(envFile))) {
    console.log(chalk.red(`✗ File ${envFile} not found`));
    process.exit(1);
  }

  try {
    // Lê o arquivo .env
    const envContent = await FileUtils.read(envFile);
    if (!envContent) {
      console.log(chalk.red(`✗ Failed to read ${envFile}`));
      process.exit(1);
    }

    console.log(chalk.dim(`  Reading ${envFile}...`));
    const lines = envContent.split("\n").filter((l) => l.trim().length > 0);
    console.log(chalk.dim(`  Found ${lines.length} environment variable(s)`));

    // Obtém as chaves públicas
    const publicKeys = await configManager.getPublicKeys();
    console.log(
      chalk.dim(`  Encrypting for ${publicKeys.length} recipient(s)...`)
    );

    // Encripta
    const envelope = await GhostCrypto.encrypt(envContent, publicKeys);

    // Salva o envelope como JSON
    await Bun.write(outputFile, JSON.stringify(envelope, null, 2));

    console.log(chalk.green(`✓ Created ${outputFile}`));

    // Adiciona ao Git automaticamente se --no-add não foi passado
    if (!options.noAdd) {
      const added = await GitUtils.add(outputFile);
      if (added) {
        console.log(chalk.green(`✓ Staged ${outputFile} for commit`));
      }
    }

    console.log();
    console.log(chalk.bold("🎉 Your secrets are encrypted!"));
    console.log();
    console.log(chalk.dim("Next steps:"));
    console.log(
      chalk.dim("  1. Commit: ") + chalk.cyan(`git commit -m "Update secrets"`)
    );
    console.log(
      chalk.dim("  2. Push:   ") + chalk.cyan("git push")
    );
    console.log();
    console.log(
      chalk.dim(`Recipients (${config.recipients.length}):`)
    );
    config.recipients.forEach((r) => {
      const display = r.github ? `@${r.github}` : r.name;
      console.log(chalk.dim(`  • ${display}`));
    });
  } catch (error) {
    console.log(chalk.red("✗ Encryption failed"));
    if (error instanceof Error) {
      console.log(chalk.dim(`  ${error.message}`));
    }
    process.exit(1);
  }
}
