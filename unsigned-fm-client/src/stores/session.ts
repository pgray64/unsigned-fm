import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import axios from 'axios';
import { useApiClient } from '@/composables/api-client/use-api-client';

export const useSession = defineStore('session', () => {
  const apiClient = useApiClient();

  const csrfToken = ref('');
  const isLoggedIn = ref(false);
  const user = ref(null as any);

  async function loadCsrfToken() {
    if (csrfToken.value) {
      return;
    }
    let response = null as any;
    try {
      response = await axios.get('/internal/csrf');
    } catch (e: any) {
      apiClient.displayGenericError(e);
    }
    csrfToken.value = response.data.csrfToken ?? '';
  }
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
  return {
    csrfToken,
    isLoggedIn,
    user,
    loadCsrfToken,
    loadSession,
  };
});
