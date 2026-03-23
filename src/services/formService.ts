import {
  FormSubmitError,
  type FeedbackFormData,
  type FooterLeadFormData,
  type OrderFormData,
} from '@/types/form'
import { SITE } from '@/constants/site'

function openMailto(subject: string, lines: string[]): Promise<void> {
  if (typeof window === 'undefined') {
    throw new FormSubmitError('Отправка доступна только в браузере.', 'UNKNOWN')
  }

  const body = lines.join('\n').trim()
  const href = `mailto:${encodeURIComponent(SITE.leadEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  try {
    window.location.href = href
    return Promise.resolve()
  } catch {
    throw new FormSubmitError('Не удалось открыть почтовый клиент. Свяжитесь с нами по телефону.', 'NETWORK')
  }
}

export async function submitFeedbackForm(data: FeedbackFormData): Promise<void> {
  return openMailto('Заявка с сайта LUFTER: обратная связь', [
    'Источник: Форма обратной связи',
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Комментарий: ${data.comment}`,
    '',
    'Согласия подтверждены пользователем в форме.',
  ])
}

export async function submitOrderForm(data: OrderFormData): Promise<void> {
  return openMailto('Заявка с сайта LUFTER: оформить заказ', [
    'Источник: Блок "Оформить заказ"',
    `Телефон: ${data.phone}`,
    `Имя: ${data.name || 'не указано'}`,
  ])
}

export async function submitFooterLeadForm(data: FooterLeadFormData): Promise<void> {
  return openMailto('Заявка с сайта LUFTER: вопросы из подвала', [
    'Источник: Форма в подвале',
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    '',
    'Согласия подтверждены пользователем в форме.',
  ])
}
