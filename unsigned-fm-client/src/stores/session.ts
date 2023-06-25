import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import axios from 'axios';
import { useApiClient } from '@/composables/api-client/use-api-client';

export const useSession = defineStore('session', () => {
  const apiClient = useApiClient();
  const cookies = useCookies();
  const isLoggedIn = ref(false);
  const user = ref(null as any);
  const isAdmin = computed(() => {
    return user.value?.isAdmin;
  });

  async function loadSession() {
    let sessionData = null as any;
    try {
      const sessionResponse = await apiClient.post(
        '/internal/users/session',
        {},
      );
      sessionData = sessionResponse.data;
    } catch {
      // want caller to handle result
    }
    isLoggedIn.value = sessionData?.isLoggedIn ?? false;
    user.value = sessionData?.user ?? null;
  }
  function logOut() {
    cookies.cookies.remove(apiClient.authTokenCookieName);
    isLoggedIn.value = false;
    user.value = null;
  }

  return {
    isLoggedIn,
    user,
    loadSession,
    logOut,
    isAdmin,
  };
});
