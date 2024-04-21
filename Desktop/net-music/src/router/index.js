import { createRouter, createWebHistory } from 'vue-router'
import TabsView from '../views/TabsView.vue'
import DiscoverView from '../views/DiscoverView.vue'
import CommunityView from '../views/CommunityView.vue'
import MeView from '../views/MeView.vue'
import FollowView from '@/views/FollowView.vue'
import PodcastView from '@/views/PodcastView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'discover'
    },
    {
      path: '/tabs',
      name: 'tabs',
      component: TabsView,
      children: [
        { name: 'discover', path: '/discover', component: DiscoverView },
        { name: 'community', path: '/community', component: CommunityView },
        { name: 'me', path: '/me', component: MeView },
        { name: 'follow', path: '/follow', component: FollowView },
        { name: 'podcast', path: '/podcast', component: PodcastView }
      ]
    },
    { name: 'playlist', path: '/playlist/:id', component: () => import('@/components/playlist/PlayList.vue') }
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
