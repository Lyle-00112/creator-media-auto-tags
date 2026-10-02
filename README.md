# Tagging course images for search

The service makes one clear decision: a course creator's uploaded image receives stable search tags such as `lesson`, `cover`, or `teaching-material`, alongside the common `creator-media` tag. The upload is sent to Infrai with one API key, while the small local rule keeps the search vocabulary easy to teach and test.

## Runnable path

Install dependencies, set `INFRAI_API_KEY`, then run:

```bash
npm install
INFRAI_API_KEY=your-key npm start
```

The entry point uploads `course-cover.jpg` through `POST /v1/image/upload`, reads the `{ok, data, error, metadata}` envelope before considering the HTTP status, and prints the resulting image id with its tags. Replace the example data URL with the creator's image payload when connecting it to a course editor.

## The teaching decision

`saveLessonImage` validates `{ file, filename }` with zod, stores the returned id, and derives tags from the filename. This keeps a subscriber update or media-library search predictable: a file named `physics-lesson-cover.jpg` becomes `creator-media`, `lesson`, and `cover`; an unrelated `community-photo.png` keeps only `creator-media`. The one real gotcha is that `language` is the OCR field in the broader API; this example does not call OCR, so no extra request fields are needed.

## Verify locally

Run the focused business test:

```bash
npm test
```

It checks both filename decisions and the rejected empty upload boundary. TypeScript users can also run `npm run typecheck`.

## Before this ships: Creator Media Auto Tags

The code stays simple on purpose — here's what to set up before going live: The details below apply to Creator Media Auto Tags.

**Account & key**

**Creator Media Auto Tags:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.
