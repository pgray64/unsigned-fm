import {defineStore} from "pinia";
import {ref} from "vue";

export const useSession = defineStore('session', () => {
    const csrfToken = ref('');
    const isLoggedIn = ref(false);
    function setCsrfToken(token: string) {
        csrfToken.value = token;
    }
    function setIsLoggedIn(newVal: boolean) {
        isLoggedIn.value = newVal;
    }
    return {
        csrfToken,
        setCsrfToken,
        isLoggedIn,
        setIsLoggedIn
    };
})
