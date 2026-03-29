import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api-config";

interface DownloadButtonProps {
  videoId: string;
  isLiveStream?: boolean;
}

type Status = "IDLE" | "PROCESSING" | "READY" | "ERROR";

export default function DownloadButton({ videoId, isLiveStream = false }: DownloadButtonProps) {
  const [status, setStatus] = useState<Status>("IDLE");
  const isPolling = useRef(false);

  const triggerDownload = async () => {
    if (status === "PROCESSING" || isPolling.current) return;
    setStatus("PROCESSING");
    
    isPolling.current = true;
    checkStatusLoop();
  };

  const checkStatusLoop = async () => {
    try {
      const endpoint = isLiveStream 
        ? `${API_BASE_URL}/live/${videoId}/download` 
        : `${API_BASE_URL}/videos/${videoId}/download`;

      while (isPolling.current) {
        const res = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setStatus("ERROR");
          isPolling.current = false;
          setTimeout(() => setStatus("IDLE"), 4000);
          return;
        }

        const data = await res.json();
        
        if (data.status === "READY" && data.url) {
          setStatus("READY");
          isPolling.current = false;
          
          // Trigger native resumable download
          const a = document.createElement("a");
          a.href = data.url;
          a.setAttribute("download", ""); 
          a.click();
          
          setTimeout(() => setStatus("IDLE"), 4000);
          return;
        } else if (data.status === "PROCESSING") {
          setStatus("PROCESSING");
          // Wait 3 seconds before polling again
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          setStatus("ERROR");
          isPolling.current = false;
          setTimeout(() => setStatus("IDLE"), 4000);
          return;
        }
      }
    } catch (err) {
      console.error("Download check failed:", err);
      setStatus("ERROR");
      isPolling.current = false;
      setTimeout(() => setStatus("IDLE"), 4000);
    }
  };

  useEffect(() => {
    return () => {
      isPolling.current = false;
    };
  }, []);

  return (
    <button
      onClick={triggerDownload}
      disabled={status === "PROCESSING" || status === "READY"}
      className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 border border-white/5 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {status === "IDLE" && (
        <>
          <span className="material-symbols-outlined text-lg">download</span>
          Download
        </>
      )}
      {status === "PROCESSING" && (
        <>
          <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
          Processing...
        </>
      )}
      {status === "READY" && (
        <>
          <span className="material-symbols-outlined text-lg text-green-400">check_circle</span>
          Ready!
        </>
      )}
      {status === "ERROR" && (
        <>
          <span className="material-symbols-outlined text-lg text-red-500">error</span>
          Failed
        </>
      )}
    </button>
  );
}
