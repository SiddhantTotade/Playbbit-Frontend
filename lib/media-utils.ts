import { API_BASE_URL, GET_ORIGIN } from "./api-config";

export const getMediaUrl = (path: string | null | undefined): string => {
    if (!path) return "/thumb-placeholder.jpg";

    const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000/pbs";
    const minioHost = new URL(minioUrl).host;
    const MINIO_BASE = minioUrl.replace(/\/$/, "");

    // 1. If it's an absolute URL
    if (path.startsWith("http://") || path.startsWith("https://")) {
        let result = path;
        // Fix old bucket names
        if (result.includes(`${minioHost}/playbbit-bucket`)) {
            result = result.replace(`${minioHost}/playbbit-bucket`, `${minioHost}/pbs`);
        }
        // Fallback for hardcoded old local DB entries
        if (result.includes("localhost:9000/playbbit-bucket")) {
            result = result.replace("localhost:9000/playbbit-bucket", `${minioHost}/pbs`);
        }
        // Fix double-prefixed buckets
        if (result.includes("/pbs/pbs/")) {
            result = result.replace("/pbs/pbs/", "/pbs/");
        }
        return result;
    }

    // 2. Local public assets whitelist
    if (path === "/thumb-placeholder.jpg" || path === "thumb-placeholder.jpg") {
        return "/thumb-placeholder.jpg";
    }

    // 3. Known backend proxy paths (HLS proxy, thumbnail proxy, etc.)
    if (path.startsWith("/api/")) {
        return `${GET_ORIGIN()}${path}`;
    }

    // 4. Everything else relative is treated as a MinIO path
    let cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Standard bucket prefix removal for construction
    if (cleanPath.startsWith("live-streams/")) {
        cleanPath = cleanPath.substring("live-streams/".length);
    } else if (cleanPath.startsWith("pbs/")) {
        cleanPath = cleanPath.substring("pbs/".length);
    }

    return `${MINIO_BASE}/${cleanPath}`;
};
