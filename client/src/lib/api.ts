/**
 * Central API configuration.
 * Defaults to relative '/api' on Vercel/Next.js frontend.
 * If NEXT_PUBLIC_API_URL is explicitly set (e.g. external Express server), it uses that.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default API_URL;

/**
 * Helper: build full image URL from a path returned by the backend or uploads.
 * Accepts full URLs (http...), data URLs (data:image...), static assets, or uploads.
 */
export function getImageUrl(path: string | undefined | null): string {
    if (!path) return "/products/perfume-1.jpg";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    if (path.startsWith("/uploads") && API_URL) return `${API_URL}${path}`;
    return path;
}
