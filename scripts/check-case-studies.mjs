/**
 * Structural check for the built case study pages.
 *
 * The four case studies share one canonical spine. Sections a page has no real
 * content for are omitted entirely rather than rendered empty, so the spine is
 * enforced as *order and naming*, not as required presence — a page may skip a
 * section, but it may not reorder or rename one.
 *
 * Also enforces the list rule: Outcomes bullets carry a bold lead-in, every
 * supporting list stays plain.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve("dist", "case-studies");

/** Canonical section order. Every section is optional; the order is not. */
const SPINE = [
  "Client Overview",
  "Project Goals",
  "The Challenge",
  "Solutions",
  "Outcomes",
];

const strip = (html) => html.replace(/<[^>]+>/g, "").trim();

const getPages = async () => {
  const entries = await readdir(DIST, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ slug: e.name, file: path.join(DIST, e.name, "index.html") }));
};

const failures = [];
const fail = (slug, message) => failures.push(`${slug}: ${message}`);

for (const { slug, file } of await getPages()) {
  const html = await readFile(file, "utf8");
  const body =
    html.match(/<div class="case-study-body__inner">([\s\S]*?)<\/section>/)?.[1] ??
    html;

  const seen = [];
  let current = null;

  const pattern =
    /<(h2|h3|h4)[^>]*>([\s\S]*?)<\/\1>|<ul>([\s\S]*?)<\/ul>|<p><strong>([\s\S]*?)<\/strong><\/p>/g;

  for (const m of body.matchAll(pattern)) {
    if (m[1]) {
      const name = strip(m[2]);
      const level = m[1];

      if (SPINE.includes(name)) {
        seen.push(name);
        current = name;

        // Solutions nests under The Challenge when present, and is promoted to h2
        // when it stands alone. Anything else skips or inverts a heading level.
        if (name === "Solutions") {
          const nested = seen.includes("The Challenge");
          const expected = nested ? "h3" : "h2";
          if (level !== expected) {
            fail(slug, `"Solutions" is ${level}, expected ${expected} (${nested ? "nested under The Challenge" : "standalone"})`);
          }
        } else if (name === "Project Goals") {
          if (level !== "h3") fail(slug, `"Project Goals" is ${level}, expected h3`);
        } else if (level !== "h2") {
          fail(slug, `"${name}" is ${level}, expected h2`);
        }
      } else if (level !== "h4") {
        // h4 is the sanctioned sub-heading inside a section (e.g. DC's
        // Branding / Website Audit workstreams). Any other unknown heading
        // means the spine has drifted.
        fail(slug, `unexpected section heading "${name}" (${level})`);
      }
    } else if (m[4] !== undefined) {
      fail(slug, `pseudo-heading "<p><strong>${strip(m[4])}</strong></p>" — use a real heading`);
    } else {
      const items = [...m[3].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((li) =>
        li[1].trim(),
      );
      if (!items.length) continue;

      const bold = items.map((i) => i.startsWith("<strong>"));
      const allBold = bold.every(Boolean);
      const noneBold = !bold.some(Boolean);

      if (current === "Outcomes" && !allBold) {
        fail(slug, `Outcomes list is ${noneBold ? "plain" : "mixed"}, expected every bullet to lead with <strong>`);
      }
      if (current !== "Outcomes" && !noneBold) {
        fail(slug, `"${current}" list is ${allBold ? "bold" : "mixed"}, expected plain bullets`);
      }
    }
  }

  // Sections may be absent, but those present must follow the canonical order.
  const order = seen.map((name) => SPINE.indexOf(name));
  for (let i = 1; i < order.length; i += 1) {
    if (order[i] <= order[i - 1]) {
      fail(slug, `section "${seen[i]}" appears after "${seen[i - 1]}" — out of canonical order`);
      break;
    }
  }

  const missing = SPINE.filter((s) => !seen.includes(s));
  console.log(
    `  ${failures.length ? " " : "✓"} ${slug.padEnd(26)} ${seen.join(" → ")}` +
      (missing.length ? `   (omitted: ${missing.join(", ")})` : ""),
  );
}

if (failures.length) {
  console.error("\n✗ Case study structure check failed:");
  for (const f of failures) console.error(`   - ${f}`);
  process.exit(1);
}

console.log("\n✓ Case study spine and list treatment consistent");
