import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/about', component: () => import('../views/About.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})



