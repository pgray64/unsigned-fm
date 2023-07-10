import axios, { type AxiosResponse } from 'axios';
import { toast } from 'vue3-toastify';
import { useCookies } from 'vue3-cookies';

const authTokenCookieName = 'auth_token';
export function useApiClient() {
  const cookies = useCookies();
  async function get(
    route: string,
    data?: any | undefined,
  ): Promise<AxiosResponse | any> {
    return await axios.get(route, {
      headers: getHeaders(),
      params: data,
    });
  }
  async function post(route: string, data: any): Promise<AxiosResponse | any> {
    return await axios.post(route, data, {
      headers: getHeaders(),
    });
  }
  function displayApiError(e: any, errMessage?: string) {
    console.error(e);
    if (e?.response?.data?.error) {
      toast.error(e?.response?.data?.error);
    } else if (errMessage) {
      toast.error(errMessage);
    } else if (e?.response?.status === 401) {
      toast.error('You need to be logged in to do that');
    } else if (e?.response?.status === 403) {
      toast.error("You're not allowed to do that");
    } else {
      toast.error('An error occurred');
    }
  }
  function getHeaders() {
    const authToken = cookies.cookies.get(authTokenCookieName);
    return { Authorization: `Bearer ${authToken}` };
  }
  return {
    get,
    post,
    displayGenericError: displayApiError,
    authTokenCookieName,
  };
}
