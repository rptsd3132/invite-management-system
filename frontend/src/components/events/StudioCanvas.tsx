import { useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "../../lib/utils";

interface StudioCanvasProps {
  children: React.ReactNode;
  className?: string;
}

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export function StudioCanvas({ children, className }: StudioCanvasProps): React.ReactElement {
  const [zoom, setZoom] = useState(1);

  const zoomIn = (): void => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(1)));
  const zoomOut = (): void => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(1)));

  return (
    <div
      className={cn(
        "dot-grid relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100/70 shadow-sm shadow-zinc-900/5",
        className,
      )}
    >
      <div className="flex min-h-105 items-center justify-center overflow-hidden p-10">
        <div
          style={{ transform: `scale(${zoom})` }}
          className="origin-center transition-transform duration-300 ease-out"
        >
          {children}
        </div>
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-0.5 rounded-xl border border-zinc-200/80 bg-white/90 p-1 shadow-sm shadow-zinc-900/5 backdrop-blur-md">
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= ZOOM_MIN}
          title="Zoom out"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="w-11 text-center text-xs font-medium tabular-nums text-zinc-600">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= ZOOM_MAX}
          title="Zoom in"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <div className="mx-0.5 h-4 w-px bg-zinc-200" />
        <button
          type="button"
          onClick={() => setZoom(1)}
          disabled={zoom === 1}
          title="Reset zoom"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}