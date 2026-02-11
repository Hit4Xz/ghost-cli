import { join } from "path";
import { homedir } from "os";

export class FileUtils {
  /**
   * Verifica se um arquivo existe
   */
  static async exists(path: string): Promise<boolean> {
    try {
      const file = Bun.file(path);
      return await file.exists();
    } catch {
      return false;
    }
  }

  /**
   * Lê conteúdo de arquivo
   */
  static async read(path: string): Promise<string | null> {
    try {
      const file = Bun.file(path);
      if (!(await file.exists())) return null;
      return await file.text();
    } catch {
      return null;
    }
  }

  /**
   * Escreve conteúdo em arquivo
   */
  static async write(path: string, content: string): Promise<boolean> {
    try {
      await Bun.write(path, content);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém o caminho da chave SSH privada padrão
   */
  static getDefaultSSHKeyPath(): string {
    const home = homedir();
    return join(home, ".ssh", "id_rsa");
  }

  /**
   * Obtém o caminho da chave SSH pública padrão
   */
  static getDefaultSSHPubKeyPath(): string {
    const home = homedir();
    return join(home, ".ssh", "id_rsa.pub");
  }

  /**
   * Lê a chave SSH pública do usuário
   */
  static async readLocalPublicKey(): Promise<string | null> {
    const pubKeyPath = this.getDefaultSSHPubKeyPath();
    return await this.read(pubKeyPath);
  }

  /**
   * Verifica se o arquivo .env existe
   */
  static async hasEnvFile(): Promise<boolean> {
    return await this.exists(".env");
  }

  /**
   * Cria um arquivo .gitignore se não existir
   */
  static async ensureGitignore(entries: string[]): Promise<void> {
    const gitignorePath = ".gitignore";
    let content = "";

    if (await this.exists(gitignorePath)) {
      content = (await this.read(gitignorePath)) || "";
    }

    const lines = content.split("\n");
    let modified = false;

    for (const entry of entries) {
      if (!lines.includes(entry)) {
        lines.push(entry);
        modified = true;
      }
    }

    if (modified) {
      await this.write(gitignorePath, lines.join("\n"));
    }
  }

  /**
   * Obtém o tamanho do arquivo em bytes
   */
  static async getFileSize(path: string): Promise<number> {
    try {
      const file = Bun.file(path);
      return file.size;
    } catch {
      return 0;
    }
  }
}
