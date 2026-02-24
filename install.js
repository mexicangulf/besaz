
import { execSync } from "child_process";
import { existsSync, rmSync, readdirSync } from "fs";

const REPO_URL = "https://github.com/mexicangulf/besaz";
const CLONE_DIR = "besaz";

function run(cmd, options = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
}

async function ensureInquirer() {
  try {
    return (await import("inquirer")).default;
  } catch {
    console.log("Installing inquirer...");
    run("npm install inquirer");
    return (await import("inquirer")).default;
  }
}

async function main() {
  console.log("Downloading library source...");

  if (existsSync(CLONE_DIR)) {
    console.log("Removing existing build directory...");
    rmSync(CLONE_DIR, { recursive: true, force: true });
  }

  run(`git clone ${REPO_URL} ${CLONE_DIR}`);
  process.chdir(CLONE_DIR);

  console.log("Installing dependencies...");
  run("npm install");

  const inquirer = await ensureInquirer();

  console.log("\nFeature Configuration");
  console.log("---------------------");

  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "disableScripting",
      message: "Disable scripting system?",
      default: false,
    },
  ]);

  // Set ENV vars for Rollup
  process.env.ENABLE_SCRIPTING = answers.disableScripting ? "false" : "true";

  console.log("\nBuilding library with selected features...");
  run("npm run build");

  console.log("\nPacking library...");
  run("npm pack");

  const tgzFiles = readdirSync(".").filter((f) => f.endsWith(".tgz"));
  if (!tgzFiles.length) {
    throw new Error("No .tgz file found after packing!");
  }

  const packageFile = tgzFiles[0];

  console.log("\nInstalling locally...");
  run(`npm install "./${packageFile}"`);

  console.log("\nBuild complete!");
  console.log(`Installed package: ${packageFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});