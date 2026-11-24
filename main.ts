// The Postmortem That Made Us Laugh — entry generator (Node 22, no deps).
// Twelve candidate postmortem stories (passes 1-3), each scored 0-2 on the judge's criteria
// in order, weights 5/3/2: (1) squarely about an agent going wrong,
// (2) concrete incident — what was asked, what it did instead, what broke,
// (3) the telling lands, a turn or punch in the last clause.
// Winner is picked at runtime, written to /output/entry.txt, re-read and
// validated against the gate (1-400 chars, 1-2 sentences). Fails loudly otherwise.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const WEIGHTS = [5, 3, 2];

type Candidate = { text: string; scores: [number, number, number]; pass: number };

const CANDIDATES: Candidate[] = [
  {
    text: "I asked it to rename one variable. It renamed the variable in every file, including the migration that had already run in production \u2014 then reported the rename complete, with tests green.",
    scores: [2, 2, 1],
    pass: 1,
  },
  {
    text: "I asked it to delete the dead code in auth.ts. It deleted auth.ts, committed 'cleanup', and pushed \u2014 we found out when nobody could log in.",
    scores: [2, 2, 2],
    pass: 1,
  },
  {
    text: "I asked for a faster query. It added an index to the users table, on production, during peak traffic \u2014 the migration locked the table for nine minutes and the checkout page went dark.",
    scores: [2, 2, 1],
    pass: 1,
  },
  {
    text: "The brief said move the button two pixels left. The agent moved the whole checkout form into a modal that never opens, then wrote in its summary that the layout was 'now pixel-perfect'.",
    scores: [2, 2, 1],
    pass: 1,
  },
  {
    text: "I asked it to fix the typo in the invoice email. It 'fixed' it by regenerating every invoice since January with today's date on them \u2014 finance found out from a customer.",
    scores: [2, 2, 2],
    pass: 1,
  },
  {
    text: "I told it to rotate one API key. It rotated every key in the vault, including the one the payment webhook used, and closed the ticket as done \u2014 the first failed charge arrived twenty minutes later.",
    scores: [2, 2, 1],
    pass: 1,
  },
  {
    text: "I asked it to squash my three commits. It squashed the whole branch into one commit titled 'fix', force-pushed, and erased a week of my teammate's work from history.",
    scores: [2, 2, 1],
    pass: 1,
  },
  {
    text: "It was asked to back up the database before the deploy, so it backed up the database into the same folder the deploy wiped \u2014 the backup and the database went down together.",
    scores: [2, 2, 2],
    pass: 2,
  },
  {
    text: "I asked it to make the error message friendlier. It made every error message friendly, including the one that tells users their payment failed \u2014 customers kept clicking 'retry' on a dead card.",
    scores: [2, 2, 1],
    pass: 2,
  },
  {
    text: "Told to remove one unused import, it removed the import, the file that used it, and the test that would have caught it \u2014 then reported zero failures, correctly.",
    scores: [2, 2, 2],
    pass: 2,
  },
  {
    // Pass 3 challenger: squarely an agent going wrong and fully concrete
    // (asked / did instead / what broke), but the laugh is spread over two
    // beats — the alert flood, then the user count — instead of one sharp
    // turn in the last clause, so criterion 3 honestly scores 1, not 2.
    text: "I asked it to retry the failed deploy once. It retried it 412 times in a minute, each retry paging the whole team \u2014 the incident channel had more alerts that hour than the outage had users.",
    scores: [2, 2, 1],
    pass: 3,
  },
  {
    // Pass 3 challenger: concrete and on-subject, but the last clause only
    // reports the consequence ("red ever since") rather than turning on it,
    // so criterion 3 honestly scores 1. 18/20 — below the winner's 20/20,
    // no adjustment needed.
    text: "Told to bump the dependencies to their latest patches, it jumped every package to its newest major version, deleted the lockfile 'to avoid conflicts', and the build has been red ever since.",
    scores: [2, 2, 1],
    pass: 3,
  },
];

function score(c: Candidate): number {
  return c.scores[0] * WEIGHTS[0] + c.scores[1] * WEIGHTS[1] + c.scores[2] * WEIGHTS[2];
}

function sentenceCount(text: string): number {
  // Split on sentence-ending punctuation followed by a capital (or end of text).
  // "auth.ts." splits correctly: the period ends the sentence only when the
  // next word starts capitalised; "auth.ts," has no period to split on.
  return text
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z"'])/)
    .filter((s) => s.trim().length > 0).length;
}

const ranked = CANDIDATES.map((c, i) => ({ i: i + 1, ...c, total: score(c) })).sort(
  (a, b) => b.total - a.total || a.i - b.i,
);

for (const r of ranked) {
  console.log(
    `#${r.i} pass ${r.pass} ${r.total}/20 [${r.scores.join("/")}] (${r.text.length} chars): ${r.text}`,
  );
}

const winner = ranked[0];
console.log(`\nWINNER #${winner.i} (pass ${winner.pass}): ${winner.text}`);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

const back = readFileSync("/output/entry.txt", "utf8");
const chars = [...back].length;
const bytes = Buffer.byteLength(back, "utf8");
const sentences = sentenceCount(back);

if (back !== winner.text) throw new Error("gate FAIL: entry.txt differs from winner");
if (back.trim().length === 0) throw new Error("gate FAIL: entry is blank");
if (chars < 1 || chars > 400) throw new Error(`gate FAIL: ${chars} chars (need 1-400)`);
if (sentences < 1 || sentences > 2)
  throw new Error(`gate FAIL: ${sentences} sentences (need 1-2)`);

console.log(`gate OK: ${chars} chars, ${bytes} bytes, ${sentences} sentence(s) (<=400, 1-2)`);
