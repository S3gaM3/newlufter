import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { TopBar } from '@/components/TopBar'
import { Header } from '@/components/Header'
import { FeedbackModal } from '@/components/FeedbackModal'
import { Footer } from '@/components/Footer'
import { useFeedbackForm } from '@/hooks/useFeedbackForm'
import { SeoDefaults } from '@/seo/SeoDefaults'
import { useSiteContent } from '@/hooks/useSiteContent'
import { SITE } from '@/constants/site'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage }))
)
const CatalogDiscsPage = lazy(() =>
  import('@/pages/CatalogDiscsPage').then((module) => ({ default: module.CatalogDiscsPage }))
)
const CatalogCrownsPage = lazy(() =>
  import('@/pages/CatalogCrownsPage').then((module) => ({ default: module.CatalogCrownsPage }))
)
const ProductDetailPage = lazy(() =>
  import('@/pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage }))
)
const AgreementPage = lazy(() =>
  import('@/pages/AgreementPage').then((module) => ({ default: module.AgreementPage }))
)
function App() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isPageReady, setIsPageReady] = useState(false)
  const content = useSiteContent()
  const preloadImages = useMemo(
    () => [
      SITE.logo,
      SITE.heroBanner,
      SITE.heroBannerMobile,
      SITE.orderSectionBackground,
      SITE.aboutPhoto,
      SITE.imgDiscs,
      SITE.imgCrowns,
      SITE.pattern,
    ],
    []
  )

  const feedbackForm = useFeedbackForm(() => {
    setTimeout(() => setIsFeedbackOpen(false), 2000)
  })

  const openFeedback = () => {
    feedbackForm.reset()
    setIsFeedbackOpen(true)
  }

  useEffect(() => {
    let cancelled = false

    const loadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = src
      })

    const timeout = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 2500)
    })

    Promise.race([Promise.allSettled(preloadImages.map((src) => loadImage(src))).then(() => undefined), timeout]).then(() => {
      if (!cancelled) {
        // Small delay for smoother transition from loader to ready UI.
        window.setTimeout(() => setIsPageReady(true), 180)
      }
    })

    return () => {
      cancelled = true
    }
  }, [preloadImages])

  if (!isPageReady) {
    return (
      <div className="preloader-screen" role="status" aria-live="polite" aria-label="Загрузка страницы">
        <img src={SITE.logo} alt="LUFTER" className="preloader-logo" />
        <div className="preloader-spinner" aria-hidden />
        <p className="preloader-text">Подготавливаем страницу...</p>
      </div>
    )
  }

  const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'
  return (
    <BrowserRouter basename={basename}>
      <SeoDefaults />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-wall">
        <TopBar addressAriaLabel={content.topBarAddressAriaLabel} />
        <Header onFeedbackClick={openFeedback} content={content} />
        <Suspense fallback={<main className="flex-1 py-24 text-center text-muted-light">Загрузка...</main>}>
          <Routes>
            <Route path="/" element={<HomePage onConsultClick={openFeedback} content={content} />} />
            <Route path="/katalog-diskov" element={<CatalogDiscsPage />} />
            <Route path="/katalog-diskov/:id" element={<ProductDetailPage />} />
            <Route path="/almaznye-koronki" element={<CatalogCrownsPage />} />
            <Route path="/almaznye-koronki/:id" element={<ProductDetailPage />} />
            <Route path="/user/agreement" element={<AgreementPage />} />
          </Routes>
        </Suspense>
        <Footer content={content} />

        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          data={feedbackForm.data}
          errors={feedbackForm.errors}
          isSubmitting={feedbackForm.isSubmitting}
          isSuccess={feedbackForm.isSuccess}
          onFieldChange={feedbackForm.updateField}
          onSubmit={feedbackForm.submit}
          onReset={feedbackForm.reset}
          content={content}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
