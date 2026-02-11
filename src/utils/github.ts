/**
 * GitHub Keys Fetcher
 * Busca chaves públicas SSH diretamente do GitHub
 */

export interface GitHubKey {
  id: number;
  key: string;
}

export class GitHubUtils {
  private static GITHUB_KEYS_URL = "https://github.com";

  /**
   * Busca as chaves públicas SSH de um usuário do GitHub
   * Endpoint: https://github.com/username.keys
   */
  static async fetchUserKeys(username: string): Promise<string[]> {
    try {
      const url = `${this.GITHUB_KEYS_URL}/${username}.keys`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user '${username}' not found`);
        }
        throw new Error(`Failed to fetch keys: ${response.statusText}`);
      }

      const text = await response.text();
      
      // As chaves vêm uma por linha
      const keys = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (keys.length === 0) {
        throw new Error(`User '${username}' has no public SSH keys`);
      }

      return keys;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch GitHub keys");
    }
  }

  /**
   * Busca a primeira chave pública de um usuário
   * (útil para auto-invite)
   */
  static async fetchPrimaryKey(username: string): Promise<string> {
    const keys = await this.fetchUserKeys(username);
    return keys[0];
  }

  /**
   * Valida se uma string parece uma chave SSH válida
   */
  static isValidSSHKey(key: string): boolean {
    // Chaves SSH começam com: ssh-rsa, ssh-ed25519, ecdsa-sha2-nistp256, etc
    const validPrefixes = [
      "ssh-rsa",
      "ssh-ed25519",
      "ecdsa-sha2-nistp256",
      "ecdsa-sha2-nistp384",
      "ecdsa-sha2-nistp521",
      "sk-ssh-ed25519",
      "sk-ecdsa-sha2-nistp256",
    ];

    return validPrefixes.some((prefix) => key.startsWith(prefix));
  }

  /**
   * Extrai o tipo da chave SSH
   */
  static getKeyType(key: string): string {
    const match = key.match(/^([\w-]+)\s/);
    return match ? match[1] : "unknown";
  }

  /**
   * Gera um fingerprint legível da chave
   */
  static getKeyFingerprint(key: string): string {
    // Pega os primeiros 16 caracteres depois do tipo
    const parts = key.split(" ");
    if (parts.length < 2) return "invalid";
    
    const keyData = parts[1];
    return keyData.slice(0, 16);
  }
}
