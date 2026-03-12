import { build } from "esbuild";
import { Environment } from "@marginal-card/backend-framework";

import fs from "fs";

import packageJson from "../../../package.json";
import { execute } from "../execute";

type Dependencies = (typeof packageJson)["dependencies"];
type SomeDependencies = Partial<Dependencies>;
type PickedDependencies = Array<keyof (typeof packageJson)["dependencies"]>;

const EXTERNAL_DEPS: PickedDependencies = ["@hono/node-server", "hono"];

const env = fs.readFileSync("./.env", "utf-8");

async function main() {
  const buildDest = Environment.get("BUILD_DEST");

  await build({
    entryPoints: ["./src/server.ts"],
    outfile: `${buildDest}/app.js`,
    bundle: true,
    platform: "node",
    target: ["node20"],
    format: "cjs",
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: EXTERNAL_DEPS,
  });

  const minimalPackage = {
    name: packageJson.name,
    version: packageJson.version,
    main: "app.js",
    dependencies: (
      Object.keys(packageJson.dependencies) as PickedDependencies
    ).reduce<SomeDependencies>((acc, currentValue) => {
      if (EXTERNAL_DEPS.includes(currentValue)) {
        acc[currentValue] = packageJson.dependencies[currentValue];
      }
      return acc;
    }, {}),
  };

  fs.writeFileSync(
    `${buildDest}/package.json`,
    JSON.stringify(minimalPackage, null, 2),
  );
  fs.writeFileSync(`${buildDest}/.env`, env);
}

execute(main);
