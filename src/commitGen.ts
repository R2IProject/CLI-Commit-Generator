import { execSync } from "child_process";

export interface CommitSuggestion {
  type: string;
  scope: string;
  message: string;
}

const TYPES = ["feat", "fix", "docs", "refactor", "test", "style", "chore"];

export function generateCommitMessage(): CommitSuggestion {
  const diff = execSync("git diff --cached", { encoding: "utf8" });

  if (!diff.trim()) {
    throw new Error("No staged changes found!");
  }

  // Naive classification (you can improve later)
  let type = "chore";
  if (diff.includes("function") || diff.includes("class")) {
    type = "feat";
  }
  if (diff.includes("console.log") || diff.includes("bug")) {
    type = "fix";
  }
  if (diff.includes("README")) {
    type = "docs";
  }
  if (diff.includes("test(") || diff.includes(".test")) {
    type = "test";
  }

  // Detect scope from folder path
  const scopeMatch = diff.match(/a\/src\/([^/]+)/);
  const scope = scopeMatch ? scopeMatch[1] : "core";

  return {
    type,
    scope,
    message: `${type}(${scope}): short description`,
  };
}
