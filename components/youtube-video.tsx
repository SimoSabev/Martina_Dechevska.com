import { youtubeId, youtubeThumbnail } from "@/lib/youtube";
import { VideoPlayer } from "./video-player";

type Props = { url: string | null | undefined; title: string; sizes: string };

/** A YouTube link from the CMS rendered as a click-to-play embed. Renders nothing for an invalid link. */
export function YouTubeVideo({ url, title, sizes }: Props) {
  const id = youtubeId(url);
  if (!id) return null;
  return <VideoPlayer source={{ kind: "youtube", id }} poster={youtubeThumbnail(id)} title={title} sizes={sizes} />;
}
