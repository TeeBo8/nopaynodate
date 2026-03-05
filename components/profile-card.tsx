import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck } from "lucide-react";

interface ProfileCardProps {
  userId: string;
  name: string;
  city?: string | null;
  bio?: string | null;
  birthdate?: string | null;
  photos: string[];
  depositAmount: number; // centimes
  isVerified: boolean;
  isPremium: boolean;
}

function getAge(birthdate: string | null | undefined): number | null {
  if (!birthdate) return null;
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function ProfileCard({
  userId,
  name,
  city,
  bio,
  birthdate,
  photos,
  depositAmount,
  isVerified,
  isPremium,
}: ProfileCardProps) {
  const age = getAge(birthdate);
  const mainPhoto = photos[0];
  const depositDisplay = `$${Math.round(depositAmount / 100)}`;

  return (
    <Link
      href={`/profile/${userId}`}
      className="group block rounded-2xl overflow-hidden border border-border bg-card transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-muted">
        {mainPhoto ? (
          <Image
            src={mainPhoto}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-5xl">
            👤
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isPremium && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs">
              Premium
            </Badge>
          )}
          {isVerified && (
            <Badge variant="secondary" className="text-xs gap-1">
              <ShieldCheck size={11} />
              Vérifié
            </Badge>
          )}
        </div>

        {/* Deposit chip */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-black/75 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full">
            Dépôt {depositDisplay}
          </div>
        </div>
      </div>

      {/* Infos */}
      <div className="p-4 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-base">{name}</span>
          {age && <span className="text-muted-foreground text-sm">{age} ans</span>}
        </div>
        {city && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin size={11} />
            {city}
          </div>
        )}
        {bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{bio}</p>
        )}
      </div>
    </Link>
  );
}
