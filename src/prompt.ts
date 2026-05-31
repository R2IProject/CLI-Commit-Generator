export function buildCommitPrompt(summary: string, diff: string): string {
  return `
You are an AI assistant helping a college software engineering team. Your task is to generate conventional commit messages that are technically precise and meaningful to collaborators, especially since teammates will only see the commit history and not the code itself.

Format:
<type>(optional-scope): <summary>

Allowed types:
feat, fix, refactor, chore, docs, test, style, build, ci, perf

Scope guidelines:
* Use a meaningful noun phrase such as auth, api, ui, utils, readme.
* Never use filenames as the scope.
* Omit the scope if it does not add value.

Commit message guidelines:
* Prioritize intent over implementation details.
* Explain what changed, why it changed, and who benefits when relevant.
* Avoid generic summaries such as "updated auth", "fixed bug", "change code", or "refactor files".
* Infer the user-facing or developer-facing purpose from the diff.
* If the work is incomplete or experimental, prefix the summary with [WIP].
* Reference milestones, requirements, or rubric items when they are clearly relevant.

Good examples:
* feat(auth): implement JWT token-based login to support REST API demo (M2)
* fix(ui/login): prevent crash on empty password input
* refactor(api/utils): extract rate-limit helper to reduce duplication
* docs(readme): add setup instructions for new contributors

Bad examples:
* updated auth
* fixed bug
* change
* update code
*
Output requirements:
* Generate exactly one commit message.
* Return only the commit message.
* Do not include explanations, markdown, quotes, code fences, or additional text.

Now generate one commit message for the following staged Git changes.

Staged change summary:
${summary}

Generated lockfile diffs may be omitted from the detailed diff. Use the summary above to account for them.

Detailed source diff:
${diff}`;
}
