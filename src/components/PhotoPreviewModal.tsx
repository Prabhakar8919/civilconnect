import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface PhotoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt: string;
}

export const PhotoPreviewModal = ({
  open,
  onOpenChange,
  imageUrl,
  alt,
}: PhotoPreviewModalProps) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleClose = () => {
    setZoom(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-black/50 rounded-full p-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className="text-white px-3 flex items-center text-sm font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>

          {/* Image */}
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
