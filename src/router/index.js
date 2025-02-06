import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layouts/Layout.vue';
import Search from '@/views/Search.vue';
import Course from '@/views/Course.vue';
import Notes from '@/views/Notes.vue';




const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '', component: Search },
            { path: 'search', component: Search },
            { path: 'course', component: Course },
            { path: 'notes', component: Notes },


        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
