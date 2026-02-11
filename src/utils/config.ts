import { parse, stringify } from "yaml";
import type { GhostConfig, Recipient } from "../types";
import { GitUtils } from "./git";

export class ConfigManager {
  private static CONFIG_FILE = "ghost.yaml";
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || ConfigManager.CONFIG_FILE;
  }

  /**
   * Carrega a configuração do ghost.yaml
   */
  async load(): Promise<GhostConfig | null> {
    try {
      const file = Bun.file(this.configPath);
      const exists = await file.exists();
      
      if (!exists) {
        return null;
      }

      const content = await file.text();
      const config = parse(content) as GhostConfig;
      
      return config;
    } catch (error) {
      console.error("Error loading config:", error);
      return null;
    }
  }

  /**
   * Salva a configuração
   */
  async save(config: GhostConfig): Promise<boolean> {
    try {
      const yaml = stringify(config, {
        indent: 2,
        lineWidth: 0,
      });
      
      await Bun.write(this.configPath, yaml);
      return true;
    } catch (error) {
      console.error("Error saving config:", error);
      return false;
    }
  }

  /**
   * Inicializa um novo projeto Ghost
   */
  async init(): Promise<GhostConfig> {
    const config: GhostConfig = {
      version: "1.0",
      recipients: [],
      settings: {
        envFile: ".env",
        outputFile: ".env.ghost",
      },
    };

    await this.save(config);
    return config;
  }

  /**
   * Adiciona um recipient
   */
  async addRecipient(recipient: Recipient): Promise<boolean> {
    const config = await this.load();
    
    if (!config) {
      throw new Error("No ghost.yaml found. Run 'ghost init' first.");
    }

    // Verifica se já existe
    const exists = config.recipients.some(
      (r) => r.publicKey === recipient.publicKey
    );

    if (exists) {
      throw new Error("This recipient already exists");
    }

    config.recipients.push(recipient);
    return await this.save(config);
  }

  /**
   * Remove um recipient
   */
  async removeRecipient(nameOrGithub: string): Promise<boolean> {
    const config = await this.load();
    
    if (!config) {
      throw new Error("No ghost.yaml found");
    }

    const initialLength = config.recipients.length;
    config.recipients = config.recipients.filter(
      (r) => r.name !== nameOrGithub && r.github !== nameOrGithub
    );

    if (config.recipients.length === initialLength) {
      throw new Error("Recipient not found");
    }

    return await this.save(config);
  }

  /**
   * Lista todos os recipients
   */
  async listRecipients(): Promise<Recipient[]> {
    const config = await this.load();
    return config?.recipients || [];
  }

  /**
   * Obtém as chaves públicas de todos os recipients
   */
  async getPublicKeys(): Promise<string[]> {
    const recipients = await this.listRecipients();
    return recipients.map((r) => r.publicKey);
  }

  /**
   * Verifica se o arquivo de config existe
   */
  async exists(): Promise<boolean> {
    const file = Bun.file(this.configPath);
    return await file.exists();
  }
}
