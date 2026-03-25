import { API_BASE_URL, GET_ORIGIN } from "./api-config";

export const getMediaUrl = (path: string | null | undefined): string => {
    if (!path) return "/thumb-placeholder.jpg";

    const MINIO_BASE = (process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000/pbs").replace(/\/$/, "");

    // 1. If it's an absolute URL
    if (path.startsWith("http://") || path.startsWith("https://")) {
        let result = path;
        // Fix old bucket names
        if (result.includes("localhost:9000/playbbit-bucket")) {
            result = result.replace("localhost:9000/playbbit-bucket", "localhost:9000/pbs");
        }
        // Fix double-prefixed buckets
        if (result.includes("/pbs/pbs/")) {
            result = result.replace("/pbs/pbs/", "/pbs/");
        }
        return result;
    }

    // 2. If it's a relative path (e.g. /uploads/... or /api/live/proxy/...)
    if (path.startsWith("/api/live/proxy/")) {
        // Resolve absolute URL to the backend
        return `${GET_ORIGIN()}${path}`;
    }

    let cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Standard bucket prefix removal for construction
    if (cleanPath.startsWith("live-streams/")) {
        cleanPath = cleanPath.substring("live-streams/".length);
    } else if (cleanPath.startsWith("pbs/")) {
        cleanPath = cleanPath.substring("pbs/".length);
    }

    return `${MINIO_BASE}/${cleanPath}`;
};
