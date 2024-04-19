import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";

export default function AlbumNameFromId({ albumId }: { albumId: string }) {
  const { data, error } = useQuery({
    queryFn: () => fetch(`/api/album?${new URLSearchParams({ id: albumId })}`)
      .then((res) => res.json())
      .then((res) => z.object({ name: z.string() }).passthrough().parseAsync((res))),
    queryKey: ["album", albumId],
  })

  useEffect(() => {
    if (error) console.error(error);
  }, [error])

  if (!data) return <span>Loading...</span>;
  return <>{data.name}</>
}
