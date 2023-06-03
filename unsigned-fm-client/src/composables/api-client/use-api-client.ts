import {useSession} from "@/stores/session";
import {apiRoutes} from "@/composables/api-client/api-routes";
import axios from "axios";
import {useCookies} from "vue3-cookies";
import {toast} from "vue3-toastify";
import router from "@/router";

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
        return await axios.get(route).catch((e: any) => {
            handleError(e);
        });
    }
    async function post(route: string, data: any): Promise<any> {
        const headers = {} as any;
        headers[csrfTokenHeaderName] = session.csrfToken
        return await axios.post(route, data, {
            headers
        }).catch((e: any) => {
            handleError(e);
        });
    }
    function handleError(e: any) {

        if (e?.response?.status === 401) {
            //toast.error('You need to be logged in to do that');
            handleBadSession();
        } else if (e?.response?.status === 403) {
            //toast.error('You\'re not allowed to do that');
            handleBadSession();
        } else {
            toast.error('An error occurred');
        }
        throw e; // Don't want any further execution
    }
    function handleBadSession() {
        router.push('login');
        // TODO delete auth_token
    }
    return {
        loadCsrfToken,
        get,
        post
    }

}
