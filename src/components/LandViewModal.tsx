import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Maximize2, Phone, Mail, User, Home, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface LandViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  land: any;
  onChatWithOwner?: () => void;
}

export const LandViewModal = ({
  open,
  onOpenChange,
  land,
  onChatWithOwner,
}: LandViewModalProps) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!land) return null;

  const owner = land.owner;
  const images = land.images || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Land Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="relative w-full h-80 rounded-lg overflow-hidden bg-muted">
                <img
                  src={images[selectedImage]}
                  alt={land.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Land Title and Location */}
          <div>
            <h2 className="text-3xl font-bold mb-3">{land.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{land.location}</span>
            </div>
            <div className="text-muted-foreground">
              {land.city}, {land.state} {land.pincode && `- ${land.pincode}`}
            </div>
          </div>

          {/* Price and Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border-2 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-blue-300 dark:border-blue-700">
              <p className="text-sm font-bold mb-2 text-blue-800 dark:text-blue-300">Total Price</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">₹{land.price?.toLocaleString()}</p>
            </div>
            <div className="p-5 border-2 rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <p className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Maximize2 className="h-4 w-4" />
                Area
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{land.area_sqft} sq ft</p>
              <p className="text-sm text-muted-foreground mt-1">₹{land.price_per_sqft}/sq ft</p>
            </div>
          </div>

          {/* Description */}
          {land.description && (
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Description
              </h4>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{land.description}</p>
            </div>
          )}

          {/* Amenities */}
          {land.amenities && land.amenities.length > 0 && (
            <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-lg mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {land.amenities.map((amenity: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          {land.status && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Status:</span>
              <Badge variant={land.status === 'active' ? 'default' : 'secondary'}>
                {land.status}
              </Badge>
            </div>
          )}

          {/* Property Owner Section */}
          {owner && (
            <div className="p-5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl border-2 border-blue-200 dark:border-blue-700">
              <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Property Owner</h4>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={owner.profile_image} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-semibold">
                    {getInitials(owner.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-sm">{owner.full_name}</h3>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {owner.user_type?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Owner Contact Info */}
              <div className="space-y-3">
                {owner.phone && (
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[60px]">Phone:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{owner.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[60px]">Email:</span>
                  <span className="font-bold text-gray-900 dark:text-white break-all">{owner.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 pt-4 pb-2 -mx-6 px-6 flex gap-3">
            {onChatWithOwner && (
              <Button 
                onClick={onChatWithOwner}
                className="flex-1 min-h-[56px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg"
                size="lg"
              >
                💬 Chat with Owner
              </Button>
            )}
            <Button 
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="min-h-[56px] px-8"
              size="lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
