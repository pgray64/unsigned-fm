import { useSession } from '@/stores/session';
import axios, { type AxiosResponse } from 'axios';
import { toast } from 'vue3-toastify';

const csrfTokenHeaderName = 'X-CSRF-TOKEN';
export function useApiClient() {
  const session = useSession();
  async function get(route: string): Promise<AxiosResponse | any> {
    return await axios.get(route);
  }
  async function post(route: string, data: any): Promise<AxiosResponse | any> {
    const headers = {} as any;
    headers[csrfTokenHeaderName] = session.csrfToken;
    return await axios.post(route, data, {
      headers,
    });
  }
  function displayGenericError(e: any, errMessage?: string) {
    console.error(e);
    if (errMessage) {
      toast.error(errMessage);
    } else if (e?.response?.status === 401) {
      toast.error('You need to be logged in to do that');
    } else if (e?.response?.status === 403) {
      toast.error("You're not allowed to do that");
    } else {
      toast.error('An error occurred');
    }
  }

  return {
    get,
    post,
    displayGenericError: displayGenericError,
  };
}
