import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/login.vue';
import SettingsView from '../views/settings.vue';
import PlaylistsView from '../views/playlists.vue';
import SubmitView from '../views/submit.vue';
import AdminHome from '../views/admin/admin-home.vue';
import ManagePlaylists from '../views/admin/manage-playlists.vue';
import UpdateSpotifyToken from '@/views/admin/update-spotify-token.vue';
import PlaylistView from '../views/playlist.vue';
import AdminUsers from '../views/admin/users.vue';
import UserDetails from '@/views/admin/user-details.vue';
import SongRecommendations from '@/views/song-recommendations.vue';
import { useSession } from '@/stores/session';
import TermsOfService from '@/views/terms-of-service.vue';
import PrivacyPolicy from '@/views/privacy-policy.vue';
import AccountError from '@/views/account-error.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: HomeView,
      redirect: '/playlists',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: PlaylistsView,
    },
    {
      path: '/playlist/:playlistId',
      name: 'playlist',
      component: PlaylistView,
    },
    {
      path: '/terms',
      name: 'termsOfService',
      component: TermsOfService,
    },
    {
      path: '/privacy-policy',
      name: 'privacyPolicy',
      component: PrivacyPolicy,
    },
    { path: '/account-error', name: 'accountError', component: AccountError },
    // Routes that required being logged in
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/submit',
      name: 'submit',
      component: SubmitView,
    },
    {
      path: '/for-you',
      name: 'songRecommendations',
      component: SongRecommendations,
    },
    // Admin routes
    {
      path: '/admin/home',
      name: 'adminHome',
      component: AdminHome,
    },
    {
      path: '/admin/playlists/manage',
      name: 'adminManagePlaylists',
      component: ManagePlaylists,
      props: { isSuccess: false },
    },
    {
      path: '/admin/spotify/update-token',
      name: 'adminUpdateSpotifyToken',
      component: UpdateSpotifyToken,
    },
    {
      path: '/admin/users',
      name: 'adminUsers',
      component: AdminUsers,
    },
    {
      path: '/admin/users/details/:userId',
      name: 'userDetails',
      component: UserDetails,
    },
    // default redirect to home page
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

const publicPageNames = [
  'home',
  'login',
  'playlists',
  'playlist',
  'termsOfService',
  'privacyPolicy',
  'accountError',
] as (string | symbol)[];
router.beforeEach(async (to) => {
  const session = useSession();
  await session.loadSession();

  if (!publicPageNames.includes(to.name ?? '') && !session.isLoggedIn) {
    return '/login';
  }
  if (
    to.path.startsWith('/admin') &&
    (!session.isLoggedIn || !session.user?.isAdmin)
  ) {
    return '/';
  }
});

export default router;
