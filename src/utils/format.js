/** Підписи для значень, які приходять з API, і форматування чисел та дат. */
export const TOUR_TYPES = {
  Beach: 'Пляжний',
  Excursion: 'Екскурсійний',
  Ski: 'Гірськолижний',
  Cruise: 'Круїз',
  Health: 'Оздоровчий'
}

export const TRANSPORT_TYPES = {
  Plane: 'Літак',
  Train: 'Поїзд',
  Bus: 'Автобус'
}

export const ROLES = {
  Customer: 'Клієнт',
  Manager: 'Менеджер',
  Admin: 'Адміністратор'
}

export const SORT_OPTIONS = {
  StartDate: 'За датою виїзду',
  PriceAscending: 'Спочатку дешевші',
  PriceDescending: 'Спочатку дорожчі',
  DiscountDescending: 'Найбільша знижка'
}

const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' })
const dateTime = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export const formatPrice = (value) => money.format(value)
export const formatDate = (value) => date.format(new Date(value))
export const formatDateTime = (value) => dateTime.format(new Date(value))

/** Дата у форматі yyyy-mm-dd для полів input type="date", зі зсувом у днях від сьогодні. */
export function isoDate(daysFromToday = 0) {
  const value = new Date()
  value.setDate(value.getDate() + daysFromToday)
  return value.toISOString().slice(0, 10)
}

/** Прибирає порожні значення, щоб не надсилати їх у рядку запиту. */
export function compact(params) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== false))
}
