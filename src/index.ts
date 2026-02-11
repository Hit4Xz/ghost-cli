#!/usr/bin/env bun
import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init";
import { inviteCommand } from "./commands/invite";
import { pushCommand } from "./commands/push";
import { pullCommand } from "./commands/pull";
import { listCommand } from "./commands/list";
import { removeCommand } from "./commands/remove";
import { hookCommand } from "./commands/hook";

const program = new Command();

// ASCII Art Banner
const banner = `
   ____  _               _   
  / ___|| |__   ___  ___| |_ 
 | |  _ | '_ \\ / _ \\/ __| __|
 | |_| || | | | (_) \\__ \\ |_ 
  \\____||_| |_|\\___/|___/\\__|
                              
 Git-native encrypted secrets
`;

program
  .name("ghost")
  .description(chalk.dim("Git-native encrypted environment variables"))
  .version("0.1.0")
  .addHelpText("beforeAll", chalk.cyan(banner));

// ghost init
program
  .command("init")
  .description("Initialize Ghost in this repository")
  .action(initCommand);

// ghost invite
program
  .command("invite <username>")
  .description("Invite a GitHub user (fetches their SSH keys automatically)")
  .option("-n, --name <name>", "Custom display name")
  .action(inviteCommand);

// ghost push
program
  .command("push")
  .description("Encrypt .env and create .env.ghost")
  .option("--no-add", "Don't stage .env.ghost automatically")
  .action(pushCommand);

// ghost pull
program
  .command("pull")
  .description("Decrypt .env.ghost to .env")
  .option("-k, --key <path>", "Path to SSH private key")
  .action(pullCommand);

// ghost list
program
  .command("list")
  .alias("ls")
  .description("List all recipients")
  .action(listCommand);

// ghost remove
program
  .command("remove <username>")
  .alias("rm")
  .description("Remove a recipient")
  .action(removeCommand);

// ghost hook
program
  .command("hook <action>")
  .description("Install or uninstall Git hooks")
  .action(hookCommand);

// Custom help
program.addHelpText(
  "after",
  `
${chalk.bold("Examples:")}
  ${chalk.dim("$")} ghost init
  ${chalk.dim("$")} ghost invite @octocat
  ${chalk.dim("$")} ghost push
  ${chalk.dim("$")} ghost pull
  ${chalk.dim("$")} ghost hook install

${chalk.bold("Learn more:")}
  ${chalk.cyan("https://github.com/ghostcli/ghost")}
`
);

// Handle no command
program.action(() => {
  program.help();
});

program.parse();
