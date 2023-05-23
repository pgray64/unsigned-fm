import {useSession} from "@/stores/session";
import {apiRoutes} from "@/composables/api-client/api-routes";
import axios from "axios";
import {useCookies} from "vue3-cookies";

const csrfTokenCookieName = 'csrf_token';
const csrfTokenHeaderName = 'X-CSRF-TOKEN'
export function useApiClient() {
    const session = useSession();
    const {cookies} = useCookies();
    async function loadCsrfToken() {
        await axios.get(apiRoutes.getCsrfToken)
        const newToken = cookies.get(csrfTokenCookieName)
        session.setCsrfToken(newToken);
    }
    async function get(route: string): Promise<any> {
        return await axios.get(route);
    }
    async function post(route: string, data: any): Promise<any> {
        const headers = {} as any;
        headers[csrfTokenHeaderName] = session.csrfToken
        return await axios.post(route, data, {
            headers
        });
    }
    return {
        loadCsrfToken,
        get,
        post
    }

}
