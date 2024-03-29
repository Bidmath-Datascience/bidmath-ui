import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';

//Pages
import Login from "@/pages/Login/Login";
import Reset from "@/pages/Login/Reset";
import Dashboard from '@/pages/Dashboard/Dashboard';
//import Icons from '@/pages/Icons/Icons';
import Error from "@/pages/Error/Error";
import Tradedesk from '@/pages/Tradedesk/Tradedesk';
import Dv360 from '@/pages/Dv360/Dv360';
import PlanningTool from '@/pages/PlanningTool/PlanningTool'
//import Workflow from '@/pages/Workflow/Workflow';

Vue.use(Router);

export default new Router({
    routes: [
      {
        path: '/login',
        name: 'Login',
        component: Login,
      },
      {
        path: '/digital-reach-tool/th',
        name: 'PlanningTool',
        component: PlanningTool,
      },
      {
        path: '/reset',
        name: 'Reset',
        component: Reset,
      },
      {
      path: '/',
      redirect: 'login',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'tradedesk',
          name: 'Tradedesk',
          component: Tradedesk,
        },
        {
          path: '/Dv360',
          name: 'Dv360',
          component: Dv360,
        },
        //{
        //  path: 'icons',
        //  name: 'Icons',
        //  component: Icons
        //},
      ],
    },
    {
      path: '*',
      name: 'Error',
      component: Error
    },
    ],
  });