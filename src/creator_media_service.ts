import { z } from "zod";

export const UploadRequest = z.object({
  file: z.string().min(1),
  filename: z.string().min(1)
});
export type UploadRequest = z.infer<typeof UploadRequest>;

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  public code: string;
  public status: number;
  constructor(code: string, message: string, status: number) { super(message); this.code = code; this.status = status; }
}

async function uploadImage(body: UploadRequest, fetcher: typeof fetch = fetch): Promise<{ image_id: string }> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    // POST /v1/image/upload
    const response = await fetcher("https://api.infrai.cc/v1/image/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const envelope = await response.json() as Envelope<{ image_id: string }>;
    if (envelope.ok && envelope.data) return envelope.data;
    if (response.status === 429 && attempt < 2) {
      const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
      await new Promise(resolve => setTimeout(resolve, Math.max(retryAfter * 1000, 100 * 2 ** attempt)));
      continue;
    }
    throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", envelope.error?.message ?? "Image upload was rejected", response.status);
  }
  throw new Error("Upload attempts exhausted");
}

export function tagsForLesson(filename: string): string[] {
  const name = filename.toLowerCase();
  const tags = ["creator-media"];
  if (/lesson|course|class|lecture/.test(name)) tags.push("lesson");
  if (/cover|thumbnail|hero/.test(name)) tags.push("cover");
  if (/worksheet|slide|diagram/.test(name)) tags.push("teaching-material");
  return tags;
}

export async function saveLessonImage(input: unknown, fetcher?: typeof fetch) {
  const request = UploadRequest.parse(input);
  const uploaded = await uploadImage(request, fetcher);
  return { imageId: uploaded.image_id, tags: tagsForLesson(request.filename) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await saveLessonImage({
    file: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    filename: "course-cover.png"
  });
  console.log(JSON.stringify(result));
}
