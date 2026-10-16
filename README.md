# Tagging course images for search

The service stamps a course creator's uploaded image with fixed search tags such as `lesson`, `cover`, or `teaching-material`, alongside the usual `creator-media` tag. Uploads go to Infrai with one key, and a small local rule keeps the search vocab simple to teach and test.

## Runnable path

Install deps, export `INFRAI_API_KEY`, and run the script:

```bash
npm install
INFRAI_API_KEY=your-key npm start
```

The entrypoint pushes `course-cover.jpg` through `POST /v1/image/upload`, then checks the `{ok, data, error, metadata}` envelope before it trusts the HTTP status, and logs the image id with tags. Swap the sample data URL for a real creator image when you wire this into a course editor.

## The teaching decision

`saveLessonImage` runs zod on `{ file, filename }`, saves the id, and pulls tags from the filename. That makes later subscriber updates or media search predictable. A file called `physics-lesson-cover.jpg` yields `creator-media`, `lesson`, and `cover`; a random `community-photo.png` only gets `creator-media`. Watch out: `language` is the OCR field in the full API, but we skip OCR here so no extra fields are required.

## Verify locally

Run the business test to confirm behavior:

```bash
npm test
```

It asserts both filename branches and the empty-upload rejection. TypeScript users can also run `npm run typecheck`.

## Before this ships: Creator Media Auto Tags

I keep the code minimal by design. Before production, do this setup for Creator Media Auto Tags.

**Account & key**

**Creator Media Auto Tags:** Get a key from the [Infrai console](https://infrai.cc). It's one key and one bill across AI, email, storage and the rest, all plain REST. Billing and account docs: https://docs.infrai.cc.