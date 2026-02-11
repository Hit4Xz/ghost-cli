import chalk from "chalk";
import { ConfigManager } from "../utils/config";
import { FileUtils } from "../utils/files";
import { GhostCrypto } from "../core/crypto";
import type { EncryptedEnvelope } from "../types";

export async function pullCommand(options: any) {
  console.log(chalk.cyan("👻 Pulling secrets..."));
  console.log();

  const configManager = new ConfigManager();

  // Define arquivos
  const config = await configManager.load();
  const outputFile = config?.settings?.outputFile || ".env.ghost";
  const envFile = config?.settings?.envFile || ".env";

  // Verifica se .env.ghost existe
  if (!(await FileUtils.exists(outputFile))) {
    console.log(chalk.red(`✗ File ${outputFile} not found`));
    console.log(chalk.dim("  Run 'ghost push' first to create encrypted secrets"));
    process.exit(1);
  }

  try {
    // Lê o envelope criptografado
    const envelopeJson = await FileUtils.read(outputFile);
    if (!envelopeJson) {
      console.log(chalk.red(`✗ Failed to read ${outputFile}`));
      process.exit(1);
    }

    const envelope: EncryptedEnvelope = JSON.parse(envelopeJson);

    console.log(chalk.dim(`  Encrypted for ${envelope.recipients.length} recipient(s)`));
    console.log(chalk.dim(`  Encrypted at: ${new Date(envelope.timestamp).toLocaleString()}`));

    // Tenta descriptografar usando a chave privada SSH
    const privateKeyPath = options.key || FileUtils.getDefaultSSHKeyPath();
    
    console.log(chalk.dim(`  Attempting decryption...`));
    const result = await GhostCrypto.decrypt(envelope, privateKeyPath);

    if (!result.success) {
      console.log(chalk.red("✗ Decryption failed"));
      console.log(chalk.dim(`  ${result.error}`));
      console.log();
      console.log(chalk.yellow("Possible reasons:"));
      console.log(chalk.dim("  • You're not in the recipients list"));
      console.log(chalk.dim("  • Wrong SSH key"));
      console.log(chalk.dim("  • Corrupted .env.ghost file"));
      process.exit(1);
    }

    // Escreve o .env descriptografado
    await FileUtils.write(envFile, result.data!);

    console.log(chalk.green(`✓ Decrypted to ${envFile}`));

    // Conta variáveis
    const lines = result.data!.split("\n").filter((l) => l.trim().length > 0);
    console.log(chalk.dim(`  Restored ${lines.length} environment variable(s)`));

    console.log();
    console.log(chalk.bold("🎉 Secrets restored!"));
    console.log();
    console.log(chalk.dim("⚠ Remember: Don't commit your .env file!"));
  } catch (error) {
    console.log(chalk.red("✗ Pull failed"));
    if (error instanceof Error) {
      console.log(chalk.dim(`  ${error.message}`));
    }
    process.exit(1);
  }
}
