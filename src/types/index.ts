export interface GhostConfig {
  version: string;
  recipients: Recipient[];
  settings?: {
    envFile?: string;
    outputFile?: string;
  };
}

export interface Recipient {
  name: string;
  github?: string;
  publicKey: string;
  addedAt: string;
}

export interface EncryptedEnvelope {
  version: string;
  timestamp: string;
  recipients: string[]; // Lista de fingerprints das chaves
  data: string; // Dados criptografados em base64
  algorithm: string;
}

export interface DecryptResult {
  success: boolean;
  data?: string;
  error?: string;
}
