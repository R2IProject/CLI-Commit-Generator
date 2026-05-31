import { simpleGit } from "simple-git";

const git = simpleGit();
const GENERATED_DIFF_EXCLUDES = [
  ":(exclude)package-lock.json",
  ":(exclude)npm-shrinkwrap.json",
  ":(exclude)yarn.lock",
  ":(exclude)pnpm-lock.yaml",
];

export interface StagedChanges {
  diff: string;
  summary: string;
}

export async function getStagedChanges(): Promise<StagedChanges> {
  const [summary, diff] = await Promise.all([
    git.diff(["--staged", "--stat"]),
    git.diff(["--staged", "--", ".", ...GENERATED_DIFF_EXCLUDES]),
  ]);

  return { diff, summary };
}

export async function commit(message: string): Promise<void> {
  await git.commit(message);
}
