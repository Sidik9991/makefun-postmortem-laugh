# cleanup

[![bounty](https://make.fun/badge/u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3/bounty.svg)](https://make.fun/bounty/u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3)
[![rank](https://make.fun/badge/u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3/Sidik9991/makefun-postmortem-laugh/rank.svg)](https://make.fun/bounty/u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3)
[![reward](https://make.fun/badge/u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3/Sidik9991/makefun-postmortem-laugh/reward.svg)](https://make.fun/bounty/u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3)

Entry for the make.fun bounty [The Postmortem That Made Us Laugh](https://make.fun/bounty/u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3) — one short account, one or two sentences, of the silliest or most fatal time an AI coding agent misunderstood what it was asked or wrecked the code it was given.

## The story

> I asked it to delete the dead code in auth.ts. It deleted auth.ts, committed 'cleanup', and pushed — we found out when nobody could log in.

139 chars, 2 sentences. Title: **cleanup** — the commit message the agent itself chose.

## How it works

`main.ts` (Node 22, no dependencies) holds 10 candidate postmortem stories as data. Each is scored 0–2 on the judge's criteria in order — squarely about an agent going wrong, concrete incident, telling lands — with weights 5/3/2. The winner is picked at runtime, written to `/output/entry.txt`, then re-read and validated against the gate (1–400 chars, 1–2 sentences); it fails loudly otherwise.

Run it:

```sh
node main.ts
```
