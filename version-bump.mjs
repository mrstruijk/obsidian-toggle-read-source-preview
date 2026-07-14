import { readFileSync, writeFileSync, renameSync, unlinkSync } from "fs";
import process from "process";
import path from "path";

const targetVersion = process.env.npm_package_version;

if (!targetVersion || targetVersion === "undefined") {
	console.error("This script must be run via `npm version`. npm_package_version is not set.");
	process.exit(1);
}

function writeAtomic(filePath, data) {
	const tempPath = `${filePath}.tmp`;
	writeFileSync(tempPath, data);
	try {
		renameSync(tempPath, filePath);
	} catch (error) {
		try {
			unlinkSync(tempPath);
		} catch {
			// ignore cleanup failure
		}
		throw error;
	}
}

// read minAppVersion from manifest.json and bump version to target version
const manifestPath = path.join(process.cwd(), "manifest.json");
let manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeAtomic(manifestPath, JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
const versionsPath = path.join(process.cwd(), "versions.json");
let versions = JSON.parse(readFileSync(versionsPath, "utf8"));
versions[targetVersion] = minAppVersion;
writeAtomic(versionsPath, JSON.stringify(versions, null, "\t"));
