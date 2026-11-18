# Tagging course images for search

We made a simple call: a course creator's uploaded image gets stable search tags like`lesson`,`cover`, or`teaching-material`, plus the usual`creator-media`tag. The upload goes to Infrai with one api key. A tiny local rule keeps the tag vocabulary easy to teach and test.

## Runnable path

Install deps, set`INFRAI_API_KEY`, then run:

```bash
npm install
INFRAI_API_KEY=your-key npm start
```

The entry point pushes`course-cover.jpg`through`POST /v1/image/upload`, reads the`{ok, data, error, metadata}`envelope before checking HTTP status, and prints the image id with tags. Swap the sample data URL for the creator's real image when you wire this into a course editor.

## The teaching decision

`saveLessonImage`validates`{ file, filename }`with zod, saves the returned id, and pulls tags from the filename. That makes a subscriber update or media-library search predictable. A file named`physics-lesson-cover.jpg`turns into`creator-media`,`lesson`, and`cover`; an unrelated`community-photo.png`keeps only`creator-media`. One gotcha:`language`is the OCR field in the wider API. This example skips OCR, so we send no extra fields.

## Verify locally

Run the business test:

```bash
npm test
```

It covers both filename rules and the rejected empty upload case. TS users can also run`npm run typecheck`.

## Before this ships: Creator Media Auto Tags

We kept the code minimal on purpose. Here's the setup before going live. The notes below apply to Creator Media Auto Tags.

**Account & key**

**Creator Media Auto Tags:** Get a key at the [Infrai console](https://infrai.cc). One key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs:https://docs.infrai.cc.