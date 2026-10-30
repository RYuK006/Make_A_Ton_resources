import { Card, CardContent } from "../components/ui/card"
import { X } from "lucide-react"

interface CampaignCardProps {
  imageUrl: string | undefined;
  caption: any;
  onClose: () => void;
}

export default function CampaignCard({ imageUrl, caption, onClose }: CampaignCardProps) {
  return (
    <Card className="relative w-full max-w-xs mx-auto overflow-hidden shadow-md">
      <div className="relative aspect-video">
        <img
          src={imageUrl}
          alt="Campaign"
          className="object-cover w-full h-full"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <CardContent className="p-4 bg-white">
        <p className="text-sm text-gray-800 break-words">{caption}</p>
      </CardContent>
    </Card>
  )
}
