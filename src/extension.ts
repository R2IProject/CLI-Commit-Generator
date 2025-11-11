import * as vscode from "vscode";
import { execSync } from "child_process";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "commit-gen.generateMessage",
    async () => {
      try {
        const diff = execSync("git diff --cached", { encoding: "utf8" });

        if (!diff.trim()) {
          vscode.window.showInformationMessage("No staged changes found!");
          return;
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // or gpt-4.1 if you prefer
          messages: [
            {
              role: "system",
              content: "You are an assistant that writes Conventional Commit messages."
            },
            {
              role: "user",
              content: `Generate a concise Conventional Commit message for this diff:\n\n${diff}`
            }
          ],
          max_tokens: 100
        });

        const suggestion = completion.choices[0].message?.content?.trim();

        if (suggestion) {
          const choice = await vscode.window.showQuickPick(
            [suggestion, "Cancel"],
            { placeHolder: "Use this commit message?" }
          );

          if (choice === suggestion) {
            await vscode.env.clipboard.writeText(suggestion);
            vscode.window.showInformationMessage(`Copied: ${suggestion}`);
          }
        } else {
          vscode.window.showErrorMessage("AI did not return a commit message.");
        }
      } catch (err: any) {
        vscode.window.showErrorMessage("Error: " + err.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
