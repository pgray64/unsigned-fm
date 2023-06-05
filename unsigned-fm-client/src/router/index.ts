import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'
import LoginView from '../views/login.vue'
import SettingsView from '../views/settings.vue'
import PlaylistsView from '../views/playlists.vue'
import SubmitView from '../views/submit.vue'
import { useSession } from '@/stores/session'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: PlaylistsView
    },
    // Routes that required being logged in below
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/submit',
      name: 'submit',
      component: SubmitView
    }
  ]
})

const publicPages = ['/', '/login', '/playlists'] as string[]
router.beforeEach(async (to) => {
  const session = useSession()
  await session.loadCsrfToken()
  await session.loadSession()

  if (!publicPages.includes(to.path)) {
    if (!session.isLoggedIn) {
      return '/'
    }
  }
})

export default router
