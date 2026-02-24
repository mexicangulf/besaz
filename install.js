
import { execSync } from "child_process";
import { existsSync, rmSync, readdirSync, readFileSync, writeFileSync} from "fs";
import inquirer from "inquirer";

const REPO_URL = "https://github.com/mexicangulf/besaz";
const CLONE_DIR = "besaz";

function run(cmd, options = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
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

try {
main();
} catch(err) {
  console.error(err);
  process.exit(1);
} finally {
    
  process.chdir(".."); // move out of the cloned folder

  const pkgPath = "./package.json";
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

  pkg.peerDependencies = pkg.peerDependencies || {};

  pkg.peerDependencies["besaz"] = "^1.0.0";

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log("Added besaz as a peerDependency in package.json");

    if (existsSync(CLONE_DIR)) {
      console.log("\nCleaning up temporary folder...");
      rmSync(CLONE_DIR, { recursive: true, force: true });
      console.log("Cleanup complete.");
    }

};