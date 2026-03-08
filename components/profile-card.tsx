import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck, Images } from "lucide-react";

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
      className={`group block rounded-2xl overflow-hidden relative aspect-[3/4] bg-muted transition-all hover:-translate-y-1 hover:shadow-xl ${
        isPremium ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-background" : "border border-border"
      }`}
    >
      {/* Photo */}
      {mainPhoto ? (
        <Image
          src={mainPhoto}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-6xl bg-muted">
          👤
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Top row: deposit + photo count */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/20">
          Deposit {depositDisplay}
        </div>
        {photos.length > 1 && (
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Images size={11} />
            {photos.length}
          </div>
        )}
      </div>

      {/* Premium label */}
      {isPremium && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2">
          <div className="bg-amber-400 text-amber-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            ✦ Premium
          </div>
        </div>
      )}

      {/* Bottom overlay: name, age, city */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg leading-tight">
            {name}{age ? `, ${age}` : ""}
          </span>
          {isVerified && (
            <ShieldCheck size={16} className="text-blue-400 shrink-0" />
          )}
        </div>
        {city && (
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <MapPin size={11} />
            {city}
          </div>
        )}
      </div>
    </Link>
  );
}
