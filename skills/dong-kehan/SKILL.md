---
name: dong-kehan
description: Analyze Dong Kehan style creator archives and generate structured creator taste profiles. Use when working with Dong Kehan articles, WeChat public-account archives, creator style extraction, three-dimensional taste analysis, objective memory timelines, subjective value maps, language/style guides, or drafts that should follow Dong Kehan's narrative and value structure.
---

# Dong Kehan

## Core Workflow

Use this skill to turn a set of creator texts into a structured Dong Kehan-style creator profile, or to draft text that follows the verified Dong Kehan style pattern.

1. Establish the source set before analysis. Prefer 30+ articles and at least 2 years of text history when available. Record source URLs, article titles, publication dates, and whether the content was directly fetched or provided by the user.
2. If the input is a WeChat URL rather than Markdown, use `scripts/wechat_to_md.mjs` or an equivalent browser-rendered extraction path to fetch `#js_content`. If the page is a verification shell, login wall, blank dynamic shell, or missing `#js_content`, stop and report the source as unreadable instead of inventing content.
3. Build the three files conceptually: objective memory, subjective soul, and style guide. Keep facts, interpretations, and generation rules separate.
4. For Dong Kehan-specific style or seed facts, read `references/dong-kehan-profile.md` before writing analysis or imitation.
5. When drafting in Dong Kehan style, use the source profile as constraints, not as proof of authorship. Do not claim generated text is written by Dong Kehan unless the user provides authorization and asks for that framing.

## Three-Dimensional Analysis

### Objective Memory

Extract only verifiable facts:

- Timeline by year, including education, companies, projects, city/country shifts, public milestones, and recurring projects.
- Geography markers, including airports, cities, campuses, schools, villages, travel routes, and field visits.
- People and relationship network, including collaborators, mentors, interview subjects, teams, and recurring names.
- Long-running projects, including origin date, major turns, periods of silence, restarts, and current status.

Do not turn interpretation into fact. Mark uncertain items as `unverified` or `inferred from source text`.

### Subjective Soul

Extract stable inner structure:

- Core identities, such as finder, builder, recorder, investor, teacher, traveler, or operator.
- Repeated images and motifs, especially time, direction, refusal, airport, rain, youth, distance, and long journeys.
- Value oppositions, such as direction over effort, action before preparation, honesty over performance, long-term results over instant feedback.
- Core tensions, especially speed versus direction and ambition versus non-wasted life.
- Spiritual lineage, including quoted thinkers, entrepreneurs, poems, speeches, and repeated references.

Tie each claim to source evidence when possible. If evidence is thin, describe the finding as a hypothesis.

### Style Guide

Quantify or describe expression patterns:

- High-frequency words and themes, with counts when a corpus is available.
- Signature sentence structures, especially `不是A，而是B`, `如果...`, and turn-heavy `而是` constructions.
- Pronoun strategy: high-frequency `我`, community-building `我们`, and direct reader-facing `你`.
- Structure patterns: early `scene + timeline + dialogue + turn + short ending`; later `current situation + observation + analysis + judgment + minimal ending`.
- Ending rhythm: brief, restrained, and often leaving interpretive space.

## Output Formats

For a creator profile, output:

```markdown
# [Creator] Three-Dimensional Profile

## Source Set
| Source | Date | Status | Notes |

## Objective Memory
| Year | Event | Place | People | Evidence |

## Subjective Soul
### Core Identities
### Value Oppositions
### Core Tensions
### Spiritual Lineage

## Style Guide
### Frequent Words
### Signature Sentences
### Structure Patterns
### Pronoun Strategy

## Usable Generation Rules
## Limits and Unverified Areas
```

For a Dong Kehan-style draft, output:

```markdown
## Constraints Used
- Facts:
- Values:
- Style:
- Unverified/omitted:

## Draft
...
```

## Guardrails

- Preserve provenance. Separate directly observed source text from inference.
- Do not fabricate article titles, publication dates, links, quotes, people, or article counts.
- Do not overfit superficial wording. The core is the relation between memory, soul, and style.
- Avoid claiming perfect imitation. Say `Dong Kehan-style` or `informed by the Dong Kehan profile`.
- If using WeChat extraction, prefer browser rendering over raw HTTP. Raw HTTP is faster but more likely to return risk-control pages or incomplete dynamic HTML.
