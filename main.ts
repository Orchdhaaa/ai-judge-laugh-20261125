import { writeFileSync, mkdirSync } from "node:fs";

// Office joke for make.fun's "Make the AI Judge Laugh". The setup is an
// everyday office fact everyone recognises: telling your boss you are
// drowning in work. The turn is what the boss does with it: instead of
// help, he answers with a calendar invite, and the punchline lands last
// in the invite's title, "Swimming Lessons", literalising the metaphor
// the setup introduced.
const JOKE =
  "I told my boss I was drowning in work, so he sent me a calendar invite titled 'Swimming Lessons'.";

// The gate only accepts UTF-8 text of 1 to 200 characters that is not
// whitespace-only, so verify the joke meets the gate before writing it.
const chars = [...JOKE].length;
if (chars < 1 || chars > 200 || JOKE.trim().length === 0) {
  throw new Error(`joke is ${chars} characters, outside the 1-200 gate`);
}

// The brief demands one line, so refuse a joke that spans more than one
// line, and refuse any dash that would break the clean single-line read.
if (JOKE.includes("\n")) {
  throw new Error("joke must be a single line");
}
if (JOKE.includes("\u2014") || JOKE.includes("\u2013")) {
  throw new Error("joke must not contain a dash");
}

// The brief rewards a real joke with a setup and a turn and the
// punchline last, so check the shape itself: the setup must name the
// drowning-in-work complaint, and the line must end on the quoted
// "Swimming Lessons" punchline. A joke that lost its turn would fail
// this check instead of shipping flat.
if (!/drowning in work/i.test(JOKE)) {
  throw new Error("joke setup must name drowning in work");
}
if (!JOKE.endsWith("'Swimming Lessons'.")) {
  throw new Error("joke must end on the Swimming Lessons punchline");
}
if (!/calendar invite/i.test(JOKE)) {
  throw new Error("joke turn must name the calendar invite");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, JOKE, "utf8");
