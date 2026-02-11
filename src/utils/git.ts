import { spawn } from "bun";

export class GitUtils {
  /**
   * Verifica se estamos em um repositório Git
   */
  static async isGitRepo(): Promise<boolean> {
    try {
      const proc = spawn(["git", "rev-parse", "--git-dir"], {
        stdout: "pipe",
        stderr: "pipe",
      });
      await proc.exited;
      return proc.exitCode === 0;
    } catch {
      return false;
    }
  }

  /**
   * Obtém o diretório raiz do repositório
   */
  static async getRepoRoot(): Promise<string | null> {
    try {
      const proc = spawn(["git", "rev-parse", "--show-toplevel"], {
        stdout: "pipe",
      });
      const output = await new Response(proc.stdout).text();
      await proc.exited;
      return proc.exitCode === 0 ? output.trim() : null;
    } catch {
      return null;
    }
  }

  /**
   * Adiciona arquivo ao staging area
   */
  static async add(file: string): Promise<boolean> {
    try {
      const proc = spawn(["git", "add", file], {
        stdout: "pipe",
        stderr: "pipe",
      });
      await proc.exited;
      return proc.exitCode === 0;
    } catch {
      return false;
    }
  }

  /**
   * Verifica se há mudanças não commitadas
   */
  static async hasUncommittedChanges(file: string): Promise<boolean> {
    try {
      const proc = spawn(["git", "diff", "--name-only", file], {
        stdout: "pipe",
      });
      const output = await new Response(proc.stdout).text();
      await proc.exited;
      return output.trim().length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Instala um Git hook
   */
  static async installHook(hookName: string, script: string): Promise<boolean> {
    try {
      const repoRoot = await this.getRepoRoot();
      if (!repoRoot) return false;

      const hookPath = `${repoRoot}/.git/hooks/${hookName}`;
      
      // Escreve o script do hook
      await Bun.write(hookPath, script);
      
      // Torna executável
      await Bun.spawn(["chmod", "+x", hookPath]).exited;
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica se um arquivo está no .gitignore
   */
  static async isIgnored(file: string): Promise<boolean> {
    try {
      const proc = spawn(["git", "check-ignore", file], {
        stdout: "pipe",
      });
      await proc.exited;
      return proc.exitCode === 0;
    } catch {
      return false;
    }
  }
}
