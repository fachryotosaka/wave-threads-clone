import Image from "next/image";
import Env from "@/config/env";
import Link from "next/link";

export default function AlbumCardWrapper({
  href,
  ...other
}: {
  href?: string;
} & Parameters<typeof AlbumCard>[0]) {
  if (href) {
    return (
      <Link href={href}>
        <AlbumCard {...other} />
      </Link>
    );
  } else {
    return <AlbumCard {...other} />;
  }
}

function AlbumCard({
  onClick,
  metadata,
  image,
}: {
  onClick?: () => void;
  metadata?: { name: string; description: string };
  image?: string;
}) {
  return (
    <article
      className="flex flex-col gap-2 p-3 rounded-md hover:opacity-95 text-muted-foreground hover:bg-muted cursor-pointer transition-all"
      tabIndex={0}
      onClick={onClick}
    >
      {image ? (
        <Image
          src={`${Env.APP_URL}/uploads/${image}`}
          alt={`Post_image_${image}`}
          width={1000}
          height={1000}
          className="w-full rounded-md border border-black/10 object-cover w-full h-full aspect-square"
        />
      ) : (
        <div className="w-full rounded-md bg-white border border-black/10 aspect-square" />
      )}
      {metadata && (
        <div className="flex flex-col">
          <h1>{metadata.name}</h1>
          <p className="text-sm opacity-50">{metadata.description}</p>
        </div>
      )}
    </article>
  );
}
