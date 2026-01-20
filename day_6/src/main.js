import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import StartupUI from 'startup-ui'

const app = createApp(App)
app.use(router)
app.use(StartupUI)
app.mount('#app')
