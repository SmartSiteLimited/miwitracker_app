import {
    createRouter,
    createWebHistory,
} from 'vue-router';

import { routes } from './routes';
import { useTitle } from '@vueuse/core';
import { APP_TITLE } from '@/config';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: (to, _from, savedPosition) => {
        if (savedPosition) {
            return savedPosition;
        }
        return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 };
    },
    strict: true,
});

router.afterEach((to, from) => {
    const title = to.meta?.title;
    useTitle(`${title} - ${APP_TITLE}`);
});


export { router };
