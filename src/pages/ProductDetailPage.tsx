import { useEffect, useMemo, useState } from 'react'
import { Link, useMatch, useParams } from 'react-router-dom'
import { getProductImages, type CatalogItem, type ProductCategory } from '@/data/catalog'
import { useProducts } from '@/hooks/useProducts'
import { SITE } from '@/constants/site'
import { ProductWorkVideos } from '@/components/ProductWorkVideos'
import { usePageSeo } from '@/seo/usePageSeo'
import { useJsonLd } from '@/seo/useJsonLd'
import { SafeImage } from '@/components/SafeImage'

const BREADCRUMB: Record<ProductCategory, { path: string; label: string }> = {
  discs: { path: SITE.catalogDiscs, label: 'Алмазные диски' },
  crowns: { path: SITE.catalogCrowns, label: 'Алмазные коронки' },
}

function renderFormattedDescription(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const isSectionTitle = /^\d+\.\s+/.test(line)
      if (isSectionTitle) {
        return (
          <h3 key={`section-${idx}`} className="font-display font-semibold text-fg text-lg mt-4">
            {line}
          </h3>
        )
      }
      return (
        <p key={`line-${idx}`} className="leading-relaxed text-muted-light">
          {line}
        </p>
      )
    })
}

function ProductGallery({
  product,
  category,
}: {
  product: CatalogItem
  category: ProductCategory
}) {
  const images = useMemo(() => getProductImages(product), [product])
  const fallback = category === 'crowns' ? SITE.imgCrowns : SITE.imgDiscs
  const mainImg = product.image ?? fallback
  const [activeIndex, setActiveIndex] = useState(0)
  const safeIndex = Math.min(activeIndex, Math.max(images.length - 1, 0))

  useEffect(() => {
    setActiveIndex(0)
  }, [product.id])

  if (!images.length) {
    return (
      <div className="aspect-square bg-surface-elevated rounded-2xl flex items-center justify-center p-8">
        <SafeImage
          src={mainImg}
          fallbackSrc={SITE.fallbackImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-surface-elevated rounded-2xl flex items-center justify-center p-8 overflow-hidden">
        <SafeImage
          src={images[safeIndex]}
          fallbackSrc={SITE.fallbackImage}
          alt={`${product.name} — фото ${safeIndex + 1}`}
          decoding="async"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-transparent hover:border-muted'
              }`}
            >
              <SafeImage
                src={src}
                fallbackSrc={SITE.fallbackImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain bg-surface-elevated"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isCrownsRoute = Boolean(useMatch('/almaznye-koronki/:id'))
  const category: ProductCategory = isCrownsRoute ? 'crowns' : 'discs'
  const { discs, crowns, isLoading } = useProducts()
  const items = category === 'discs' ? discs : crowns
  const product = id ? items.find((p) => p.id === id) : undefined
  const fallbackPath = category === 'crowns' ? SITE.catalogCrowns : SITE.catalogDiscs
  const fallbackDescription = 'Описание товара уточняется. Свяжитесь с нами для консультации.'
  const productDescription = product?.fullDescription || product?.description || fallbackDescription

  const seoTitle = product ? `${product.name} | LUFTER` : 'Товар не найден | LUFTER'
  const seoDescription = product
    ? product.fullDescription ?? product.description ?? fallbackDescription
    : 'Запрошенная карточка товара не найдена. Вернитесь в каталог LUFTER.'
  const seoPath = product ? `${BREADCRUMB[category].path}/${product.id}` : fallbackPath

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    path: seoPath,
    image: product?.image,
    type: product ? 'product' : 'website',
    robots: product ? 'index,follow' : 'noindex,follow',
  })
  const productJsonLd = useMemo(
    () =>
      product
        ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            sku: product.sku,
            description: product.fullDescription ?? product.description ?? product.name,
            image: `${SITE.baseUrl}${product.image || SITE.fallbackImage}`,
            category: category === 'crowns' ? 'Алмазные коронки' : 'Алмазные диски',
            brand: { '@type': 'Brand', name: 'LUFTER' },
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'Thing',
            name: 'Товар не найден',
          },
    [category, product]
  )
  useJsonLd('product-jsonld', productJsonLd)

  if (isLoading) {
    return (
      <main className="flex-1 py-24">
        <div className="max-w-site mx-auto px-4 text-center text-muted-light">Загрузка...</div>
      </main>
    )
  }
  if (!product) {
    return (
      <main className="flex-1 py-24">
        <div className="max-w-site mx-auto px-4 text-center">
          <h1 className="font-display text-2xl text-fg mb-4">Товар не найден</h1>
          <Link to={BREADCRUMB[category].path} className="app-link underline-hover">
            ← Вернуться в каталог
          </Link>
        </div>
      </main>
    )
  }

  const { path, label } = BREADCRUMB[category]
  return (
    <main className="flex-1 py-16 lg:py-24">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-light flex-wrap">
          <Link to="/" className="app-link">
            Главная
          </Link>
          <span>/</span>
          <Link to={path} className="app-link">
            {label}
          </Link>
          <span>/</span>
          <span className="text-fg truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ProductGallery product={product} category={category} />

          <div className="min-w-0">
            <span className="text-sm text-muted">{product.sku}</span>
            <h1 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-fg mt-2">
              {product.name}
            </h1>

            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-overlay p-5 md:p-6 max-h-[26rem] lg:max-h-[30rem] overflow-y-auto">
              {renderFormattedDescription(productDescription)}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contacts" className="btn-primary">
                Узнать цену
              </a>
              <a href={SITE.phoneTel} className="btn-secondary">
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <ProductWorkVideos
          videos={product.workVideos}
          className="mt-16 max-w-4xl mx-auto w-full"
        />
      </div>
    </main>
  )
}
