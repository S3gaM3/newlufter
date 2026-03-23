/**
 * Разбор URL из каталога: прямой файл (mp4/webm/ogg) или встраивание YouTube / Vimeo.
 */

export type VideoSource =
  | { kind: 'file'; src: string }
  | { kind: 'youtube'; embedUrl: string }
  | { kind: 'vimeo'; embedUrl: string }

const VIDEO_FILE_EXT_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i

function isAllowedFileUrl(value: string): boolean {
  const isLocalPath = value.startsWith('/videos/')
  const isRemoteHttp = /^https?:\/\//i.test(value)
  return (isLocalPath || isRemoteHttp) && VIDEO_FILE_EXT_RE.test(value)
}

export function parseVideoUrl(url: string): VideoSource | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  if (/^https?:\/\/(www\.)?youtube\.com\/embed\//i.test(trimmed)) {
    const clean = trimmed.split('&')[0]?.split('?')[0] ?? trimmed
    return { kind: 'youtube', embedUrl: clean }
  }

  const ytWatch = trimmed.match(
    /(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/)([\w-]{11})/i
  )
  if (ytWatch?.[1]) {
    return {
      kind: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytWatch[1]}`,
    }
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo?.[1]) {
    return {
      kind: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
    }
  }

  if (isAllowedFileUrl(trimmed)) {
    return { kind: 'file', src: trimmed }
  }

  return null
}

/** Оставляет только валидные URL роликов и убирает дубликаты. */
export function normalizeWorkVideos(videos: string[] | undefined): string[] {
  if (!videos?.length) return []

  const result: string[] = []
  const seen = new Set<string>()

  for (const raw of videos) {
    const value = raw.trim()
    if (!value || seen.has(value)) continue
    if (!parseVideoUrl(value)) continue
    seen.add(value)
    result.push(value)
  }

  return result
}
