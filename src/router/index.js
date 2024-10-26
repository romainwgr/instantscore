// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import LeaguePage from '../components/LeaguePage.vue';
import NotFound from '../components/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld,
  },
  {
    path: '/league/:id',
    name: 'LeaguePage',
    component: LeaguePage,
    props: true, 
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(), // Utilise l'historique basé sur le hash (#)
  routes,
});

export default router;
