#!/usr/bin/env node
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import OpenAI from "openai";
import { execSync } from "child_process";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function run() {
  try {
    const diff = execSync("git diff --cached", { encoding: "utf8" });
    if (!diff.trim()) {
      console.log("No staged changes found!");
      return;
    }

    // Ask AI to summarize into a Conventional Commit
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4.1 if available
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that writes commit messages."
        },
        {
          role: "user",
          content: `Generate a concise Conventional Commit message for this diff:\n\n${diff}`
        }
      ],
      max_tokens: 100
    });

    const suggestion = completion.choices[0].message?.content?.trim();

    if (!suggestion) {
      console.log("AI failed to generate commit message.");
      return;
    }

    console.log(`\nSuggested commit: ${suggestion}`);

    // Commit directly
    execSync(`git commit -m "${suggestion}"`, { stdio: "inherit" });

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
