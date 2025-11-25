const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function supabaseLoader({ src, width, quality }) {
  // The src provided to the Image component should be the path relative to the bucket
  // e.g., "my-bucket/my-image.png"

  // Self-hosted Supabase URL structure for image rendering:
  // {SUPABASE_URL}/storage/v1/render/image/public/{BUCKET}/{PATH}

  return `${supabaseUrl}/storage/v1/render/image/public/${src}?width=${width}&quality=${quality || 75}`;
}
