import http from './http'

/** Тонкі обгортки над маршрутами WebAPI: кожна функція - один HTTP-запит. */
const data = (promise) => promise.then((response) => response.data)

export const authApi = {
  login: (credentials) => data(http.post('/auth/login', credentials)),
  register: (form) => data(http.post('/auth/register', form)),
  me: () => data(http.get('/auth/me'))
}

export const toursApi = {
  search: (filters) => data(http.get('/tours', { params: filters })),
  get: (id) => data(http.get(`/tours/${id}`)),
  create: (tour) => data(http.post('/tours', tour)),
  update: (id, tour) => data(http.put(`/tours/${id}`, tour)),
  remove: (id) => http.delete(`/tours/${id}`)
}

export const geographyApi = {
  countries: () => data(http.get('/countries')),
  createCountry: (name) => data(http.post('/countries', { name })),
  createRegion: (countryId, name) => data(http.post(`/countries/${countryId}/regions`, { name }))
}

export const hotelsApi = {
  search: (filters) => data(http.get('/hotels', { params: filters })),
  get: (id) => data(http.get(`/hotels/${id}`)),
  availableRooms: (id, query) => data(http.get(`/hotels/${id}/available-rooms`, { params: query })),
  create: (hotel) => data(http.post('/hotels', hotel)),
  addRoom: (id, room) => data(http.post(`/hotels/${id}/rooms`, room))
}

export const tripsApi = {
  search: (filters) => data(http.get('/trips', { params: filters })),
  create: (trip) => data(http.post('/trips', trip))
}

/** Однаковий набір операцій для трьох видів бронювань. */
function bookingsApi(resource) {
  return {
    mine: () => data(http.get(`/${resource}/my`)),
    all: () => data(http.get(`/${resource}`)),
    book: (request) => data(http.post(`/${resource}`, request)),
    cancel: (id) => http.post(`/${resource}/${id}/cancel`)
  }
}

export const tourBookingsApi = bookingsApi('tour-bookings')
export const roomBookingsApi = bookingsApi('room-bookings')
export const ticketBookingsApi = bookingsApi('ticket-bookings')

export const usersApi = {
  all: () => data(http.get('/users')),
  changeRole: (id, role) => data(http.put(`/users/${id}/role`, { role }))
}
