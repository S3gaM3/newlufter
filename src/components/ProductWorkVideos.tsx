import { WorkVideoPlayer } from '@/components/WorkVideoPlayer'
import { normalizeWorkVideos } from '@/lib/videoUrls'

interface ProductWorkVideosProps {
  videos: string[] | undefined
  className?: string
}

/** Секция «Видео работы» на странице товара */
export function ProductWorkVideos({ videos, className = '' }: ProductWorkVideosProps) {
  const validVideos = normalizeWorkVideos(videos)
  if (!validVideos.length) return null

  return (
    <section className={className} aria-labelledby="work-videos-heading">
      <h2
        id="work-videos-heading"
        className="font-display font-bold text-xl md:text-2xl text-fg mb-6"
      >
        Видео работы
      </h2>
      <ul className="space-y-8 list-none p-0 m-0">
        {validVideos.map((url, i) => (
          <li key={`${url}-${i}`}>
            <WorkVideoPlayer
              url={url}
              title={`Видео работы — ролик ${i + 1}`}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
