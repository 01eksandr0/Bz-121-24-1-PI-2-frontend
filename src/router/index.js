import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const STAFF = ['Manager', 'Admin']

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/tours', name: 'tours', component: () => import('../views/ToursView.vue') },
  { path: '/tours/:id', name: 'tour', component: () => import('../views/TourDetailsView.vue'), props: true },
  { path: '/hotels', name: 'hotels', component: () => import('../views/HotelsView.vue') },
  { path: '/hotels/:id', name: 'hotel', component: () => import('../views/HotelDetailsView.vue'), props: true },
  { path: '/transport', name: 'transport', component: () => import('../views/TransportView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  {
    path: '/my-bookings',
    name: 'my-bookings',
    component: () => import('../views/MyBookingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/manage/tours',
    name: 'manage-tours',
    component: () => import('../views/manager/ManageToursView.vue'),
    meta: { roles: STAFF }
  },
  {
    path: '/manage/tours/new',
    name: 'tour-create',
    component: () => import('../views/manager/TourFormView.vue'),
    meta: { roles: STAFF }
  },
  {
    path: '/manage/tours/:id/edit',
    name: 'tour-edit',
    component: () => import('../views/manager/TourFormView.vue'),
    props: true,
    meta: { roles: STAFF }
  },
  {
    path: '/manage/bookings',
    name: 'all-bookings',
    component: () => import('../views/manager/AllBookingsView.vue'),
    meta: { roles: STAFF }
  },
  {
    path: '/manage/catalog',
    name: 'catalog',
    component: () => import('../views/manager/CatalogView.vue'),
    meta: { roles: STAFF }
  },
  {
    path: '/admin/users',
    name: 'users',
    component: () => import('../views/admin/UsersView.vue'),
    meta: { roles: ['Admin'] }
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

/**
 * Захист маршрутів на клієнті - лише для зручності (не показувати недоступні сторінки).
 * Справжня перевірка прав - на сервері ([Authorize] у WebAPI і правила в BLL).
 */
router.beforeEach((to) => {
  const auth = useAuthStore()
  const needsLogin = to.meta.requiresAuth || to.meta.roles
  if (needsLogin && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.roles && !auth.hasRole(to.meta.roles)) {
    return { name: 'home' }
  }
  return true
})

export default router
