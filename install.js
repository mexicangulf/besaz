
import { execSync } from "child_process";
import { existsSync, rmSync, readdirSync,
   readFileSync,
   writeFileSync,
   mkdirSync,
   copyFileSync} from "fs";
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
  process.chdir("..");
  run(`npm install "./${CLONE_DIR}/${packageFile}"`);

  console.log("\nBuild complete!");
  console.log(`Installed package: ${packageFile}`);

  const another = await inquirer.prompt([
  {
    type: "confirm",
    name: "removeBesazFolder",
    message: "remove the artifact library folder?",
    default: false,
  },
  ]);

  

  if(another.removeBesazFolder) {
    if (existsSync(CLONE_DIR)) {
      console.log("\nCleaning up temporary folder...");
      rmSync(CLONE_DIR, { recursive: true, force: true });
      console.log("Cleanup complete.");
    }
  };

}

try {
main();
} catch(err) {
  
  console.error(err);
  process.exit(1);

}