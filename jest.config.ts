import type { Config } from "jest";
import type { WorkspaceInfos } from "workspace-tools";
import { getPnpmWorkspaces, getWorkspaceManagerRoot } from "workspace-tools";

export const config = (workspace: WorkspaceInfos[number]) =>
  ({
    displayName: workspace.name,
    rootDir: `${workspace.path}/src`,
    testEnvironment: "node",
    globals: {
      CURRENT_WORKSPACE: workspace.name,
      CURRENT_WORKSPACE_PATH: workspace.path,
      CURRENT_WORKSPACE_PRETEST: workspace.packageJson.scripts?.pretest,
      CURRENT_WORKSPACE_POSTTEST: workspace.packageJson.scripts?.posttest,
      CURRENT_WORKSPACE_WAIT: workspace.packageJson.scripts?.wait,
    },
    testMatch: ["**/*.spec.ts"],
    transform: {
      "^.+\\.(t|j)sx?$": [
        `${getWorkspaceManagerRoot(process.cwd())}/node_modules/@swc/jest`,
        {
          jsc: {
            parser: {
              syntax: "typescript",
              decorators: true,
            },
          },
          module: {
            type: "commonjs",
          },
        },
      ],
    },
  }) satisfies Config;

const workspaces = getPnpmWorkspaces(process.cwd());
const ignore: string[] = [];
const toTest = workspaces.filter((w) => !ignore.includes(w.name));

export default {
  coverageReporters: ["json"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  projects: toTest.map(config),
};
