import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import Singer from '@/components/singer/singer'
import SingerDetail from '@/components/singer-detail/singer-detail'

Vue.use(Router)
export default new Router({
  routes:[
    {
      path: '/',
      redirect: {
        name: 'Recommend'
      }
    },
    {
      path: '/recommend',
      component: Recommend,
      name: 'Recommend',
    },
    {
      path: '/rank',
      component: Rank,
      name: 'Rank'
    },
    {
      path: '/search',
      component: Search,
      name: 'Search'
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
