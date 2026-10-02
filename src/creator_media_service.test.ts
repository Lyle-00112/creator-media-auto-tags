import assert from "node:assert/strict";
import { tagsForLesson, UploadRequest } from "./creator_media_service.js";

assert.deepEqual(tagsForLesson("physics-lesson-cover.jpg"), ["creator-media", "lesson", "cover"]);
assert.deepEqual(tagsForLesson("community-photo.png"), ["creator-media"]);
assert.throws(() => UploadRequest.parse({ file: "", filename: "x.jpg" }));
console.log("tag decision tests passed");
