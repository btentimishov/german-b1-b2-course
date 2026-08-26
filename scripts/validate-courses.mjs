import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(repositoryRoot, "courses");
const requiredEntries = ["MISSION.md", "NOTES.md", "RESOURCES.md", "index.html", "assets", "lessons", "reference", "learning-records"];
const errors = [];
let htmlCount = 0;
let answerCount = 0;

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(target));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(target);
  }
  return files;
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function validateHtml(file) {
  const html = await readFile(file, "utf8");
  const relativeFile = path.relative(repositoryRoot, file);
  const semanticAuditRequired = /\bdata-semantic-audit(?:="[^"]*")?/.test(html);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`${relativeFile}: duplicate ids ${[...new Set(duplicateIds)].join(", ")}`);

  for (const selectMatch of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)) {
    const answerMatch = selectMatch[1].match(/\bdata-answer="([^"]+)"/);
    if (!answerMatch) continue;
    answerCount += 1;
    if (semanticAuditRequired && !/\bdata-prompt="[^"]+"/.test(selectMatch[1])) {
      errors.push(`${relativeFile}: fixed answer "${decodeHtml(answerMatch[1]).trim()}" has no data-prompt`);
    }
    if (semanticAuditRequired && !/\bdata-explanation="[^"]+"/.test(selectMatch[1])) {
      errors.push(`${relativeFile}: fixed answer "${decodeHtml(answerMatch[1]).trim()}" has no data-explanation`);
    }
    const answer = decodeHtml(answerMatch[1]).trim();
    const options = [...selectMatch[2].matchAll(/<option(?:\s[^>]*)?>([\s\S]*?)<\/option>/g)]
      .map((match) => decodeHtml(match[1].replace(/<[^>]+>/g, "")).trim());
    if (!options.includes(answer)) errors.push(`${relativeFile}: data-answer "${answer}" is not a visible option`);
  }

  for (const referenceMatch of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = decodeHtml(referenceMatch[1]);
    if (!reference || reference.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(reference)) continue;
    const cleanReference = reference.split(/[?#]/)[0];
    const target = path.resolve(path.dirname(file), cleanReference);
    if (!await exists(target)) errors.push(`${relativeFile}: broken local reference ${reference}`);
  }
}

const courseEntries = (await readdir(coursesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."));

for (const course of courseEntries) {
  const courseRoot = path.join(coursesRoot, course.name);
  for (const entry of requiredEntries) {
    if (!await exists(path.join(courseRoot, entry))) errors.push(`${course.name}: missing ${entry}`);
  }
  const htmlFiles = await collectHtml(courseRoot);
  htmlCount += htmlFiles.length;
  for (const htmlFile of htmlFiles) await validateHtml(htmlFile);
}

for (const rootPage of ["index.html", "404.html"]) {
  const file = path.join(repositoryRoot, rootPage);
  if (!await exists(file)) errors.push(`root: missing ${rootPage}`);
  else await validateHtml(file);
}

if (errors.length) {
  console.error(`Course validation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${courseEntries.length} teaching workspaces, ${htmlCount} course pages, and ${answerCount} fixed answers.`);
}
