import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import { createVuesticEssential, VaButton, VaIcon, VaNavbar, VaNavbarItem } from 'vuestic-ui'
import 'vuestic-ui/styles/essential.css'
import 'vuestic-ui/styles/grid.css'
import 'vuestic-ui/styles/reset.css'
import 'vuestic-ui/styles/typography.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(createVuesticEssential({ components: { VaButton, VaNavbar, VaNavbarItem, VaIcon } }))
app.mount('#app')