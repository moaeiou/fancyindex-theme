#!/usr/bin/env node
"use strict";

import { readFileSync, writeFileSync } from "fs";

const [src, dest] = process.argv.slice(2);
if (!src || !dest) {
  console.error("usage: minify-html.js <src> <dest>");
  process.exit(1);
}

// Fancyindex header/footer are document fragments. A real HTML parser
// would invent the missing </body></html> and break the assembled page.
const minified = readFileSync(src, "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<[^>]+>/g, (tag) =>
    tag.replace(/\s+/g, " ").replace(/< /, "<").replace(/\s+>/g, ">"),
  )
  .replace(/>\s+</g, "><")
  .replace(/>([^<]+)</g, (_, text) => `>${text.replace(/\s+/g, " ")}<`)
  .trim();

writeFileSync(dest, minified);
