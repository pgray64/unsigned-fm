import {defineStore} from "pinia";
import {ref} from "vue";

export const useSession = defineStore('session', () => {
    const csrfToken = ref('');
})
