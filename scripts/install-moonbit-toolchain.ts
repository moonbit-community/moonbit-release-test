import * as path from "node:path";
import * as process from "node:process";
import * as fs from "node:fs";
import { platform, arch } from "node:process";
import { execa, Result } from "execa";

enum Github_HOME_PATH {
  Linux = "/home/runner",
  Windows = "C:\\Users\\runneradmin",
  Darwin = "/Users/runner",
}

type moonbit_version = "stable" | "pre-release";

const WindowInstallVersionEnvVar = "MOONBIT_INSTALL_VERSION";

const install_moonbit = async (
  version: moonbit_version
): Promise<Result<{}>> => {
  if (platform === "win32") {
    if (version !== "stable") {
      process.env[WindowInstallVersionEnvVar] = version;
    }
    return await execa("pwsh", [
      "-c",
      `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; irm https://cli.moonbitlang.com/install/powershell.ps1 | iex`,
    ]);
  } else {
    if (version === "stable") {
      return await execa(`bash`, [
        `-c`,
        `curl -fsSL https://cli.moonbitlang.com/install/unix.sh | bash`,
      ]);
    } else {
      return await execa(`bash`, [
        `-c`,
        `curl -fsSL https://cli.moonbitlang.com/install/unix.sh | bash -s ${version}`,
      ]);
    }
  }
};

const get_version = (): moonbit_version => {
  const input = process.env["MOONBIT_VERSION"];
  switch (input) {
    case "stable":
      return input;
    case "pre-release":
      return input;
    default:
      throw Error("unsupported version");
  }
};

const get_home_path = () => {
  switch (platform) {
    case "linux":
      return Github_HOME_PATH.Linux;
    case "win32":
      return Github_HOME_PATH.Windows;
    case "darwin":
      return Github_HOME_PATH.Darwin;
    default:
      throw Error("unsupported os");
  }
};

const add_moonbit_binary_path_to_home = () => {
  const home = get_home_path();
  const moonbit_binary = path.join(home, ".moon", "bin");
  const github_path_file = process.env["GITHUB_PATH"] as string;
  fs.appendFileSync(github_path_file, moonbit_binary + "\n");
};

const main = async () => {
  const version = get_version();
  const { stdout } = await install_moonbit(version);
  add_moonbit_binary_path_to_home();
  console.log(stdout);
};

main();
