#!/usr/bin/env node
import simpleGit from "simple-git";
import inquirer from "inquirer";

const git = simpleGit();

async function generateCommitMessage() {
  try {
    // Get staged changes
    const diff = await git.diff(["--staged"]);
    if (!diff.trim()) {
      console.log("⚠️  No staged changes found.");
      return;
    }

    console.log("🧠 Generating commit message...");

    // Prepare your prompt
    const prompt = `
You are an AI that writes concise, conventional commit messages for Git.
Use the format: <type>(optional-scope): <short summary>
Types: feat, fix, refactor, chore, docs, test, style, build, ci, perf.

Analyze the staged git diff below and produce ONE clear, meaningful commit message.
Focus on intent and not filenames. Avoid generic words like "update" or "change".

Git diff:
${diff}
`;

    // Call Ollama API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-v3.1:671b-cloud", // or "codellama" if you prefer code-focused model
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const suggested = (data.response || "").trim();

    console.log("\n✅ Suggested commit message:\n", suggested, "\n");

    // Ask what to do next
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: ["Accept & commit", "Edit message", "Cancel"],
      },
    ]);

    let finalMessage = suggested;

    if (action === "Edit message") {
      const { edited } = await inquirer.prompt([
        {
          type: "input",
          name: "edited",
          message: "Edit your commit message:",
          default: suggested,
        },
      ]);
      finalMessage = edited;
    }

    if (action === "Accept & commit" || action === "Edit message") {
      await git.commit(finalMessage);
      console.log("✅ Commit created successfully!");
    } else {
      console.log("❌ Commit cancelled.");
    }
  } catch (error: any) {
    console.error("❌ Error generating commit message:", error.message);
  }
}

generateCommitMessage();
