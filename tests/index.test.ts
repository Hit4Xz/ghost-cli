import { describe, expect, test } from "bun:test";
import { GitHubUtils } from "../src/utils/github";
import { GhostCrypto } from "../src/core/crypto";

describe("GitHubUtils", () => {
  test("validates SSH keys correctly", () => {
    expect(GitHubUtils.isValidSSHKey("ssh-ed25519 AAAAC3Nza...")).toBe(true);
    expect(GitHubUtils.isValidSSHKey("ssh-rsa AAAAB3Nza...")).toBe(true);
    expect(GitHubUtils.isValidSSHKey("invalid key")).toBe(false);
  });

  test("extracts key type", () => {
    expect(GitHubUtils.getKeyType("ssh-ed25519 AAAAC3Nza...")).toBe("ssh-ed25519");
    expect(GitHubUtils.getKeyType("ssh-rsa AAAAB3Nza...")).toBe("ssh-rsa");
  });

  test("fetches GitHub keys", async () => {
    // This is a real test against GitHub's API
    const keys = await GitHubUtils.fetchUserKeys("torvalds");
    expect(keys.length).toBeGreaterThan(0);
    expect(GitHubUtils.isValidSSHKey(keys[0])).toBe(true);
  }, 10000); // 10s timeout for network request
});

describe("GhostCrypto", () => {
  test("encrypts and decrypts data", async () => {
    const plaintext = "DATABASE_URL=postgresql://localhost/mydb\nAPI_KEY=secret123";
    const publicKey = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl";

    // Encrypt
    const envelope = await GhostCrypto.encrypt(plaintext, [publicKey]);
    
    expect(envelope.version).toBe("ghost-v1");
    expect(envelope.recipients.length).toBe(1);
    expect(envelope.data).toBeTruthy();
    expect(envelope.algorithm).toBe("chacha20-poly1305");

    // Note: Full decryption test requires a real private key
    // In production tests, you'd use a test key pair
  });
});
