"use client";

import { BUCKET, db, publicUrl, slugify } from "./client";

const W = 1200;
const H = 900;

// Product photos: placed on a white 1200x900 canvas, like the rest of the site's images.
// Other photos: kept in shape, at most 1600 px on the long side. Both are saved as WebP.
async function prepare(file: File, fit: boolean): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  let dw: number;
  let dh: number;
  if (fit) {
    canvas.width = W;
    canvas.height = H;
    const scale = Math.min(W / bitmap.width, H / bitmap.height);
    dw = Math.round(bitmap.width * scale);
    dh = Math.round(bitmap.height * scale);
  } else {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    dw = canvas.width = Math.round(bitmap.width * scale);
    dh = canvas.height = Math.round(bitmap.height * scale);
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot prepare images.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, Math.round((canvas.width - dw) / 2), Math.round((canvas.height - dh) / 2), dw, dh);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not convert the image."))), "image/webp", 0.86),
  );
}

export async function uploadImage(file: File, { fit = true, name }: { fit?: boolean; name?: string } = {}) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file (JPG, PNG or WebP).");
  if (file.size > 25 * 1024 * 1024) throw new Error("This image is over 25 MB. Choose a smaller one.");
  const blob = await prepare(file, fit);
  const base = slugify(name || file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${base}-${Date.now().toString(36)}.webp`;
  const { error } = await db().storage.from(BUCKET).upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return publicUrl(path);
}

export async function listImages() {
  const { data, error } = await db().storage.from(BUCKET).list("", {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(error.message);
  return (data ?? [])
    .filter((f) => f.name && !f.name.startsWith(".") && f.id)
    .map((f) => ({ name: f.name, url: publicUrl(f.name) }));
}
