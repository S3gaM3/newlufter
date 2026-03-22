/** Базовый путь для ассетов (учитывает base при деплое на subpath, например GitHub Pages). */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

/** Возвращает URL ассета с учётом base path. */
export function asset(path: string): string {
  const p = path.startsWith('/') ? path.slice(1) : path
  return BASE === '/' ? `/${p}` : `${BASE}/${p}`
}
