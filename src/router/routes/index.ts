import DefaultLayout from "@/layouts/Default.vue";
import { metadata } from "@vueuse/core/metadata.mjs";

export const routes = [
  {
    path: '/',
    redirect: '/devices'
  },
  {
    path: '/devices',
    name: 'Devices',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'DeviceList',
        metadata: {
          title: 'Device List'
        },
        component: () => import('@/views/DeviceList.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'SettingPanel',
        metadata: {
          title: 'Settings'
        },
        component: () => import('@/views/Settings.vue')
      }
    ]
  },
  {
    path: '/projects',
    name: 'Projects',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'ProjectList',
        metadata: {
          title: 'Project List'
        },
        component: () => import('@/views/ProjectList.vue')
      }
    ]
  }
  ,{
    path: '/groups',
    name: 'Groups',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'GroupList',
        metadata: {
          title: 'Group List'
        },
        component: () => import('@/views/GroupList.vue')
      }
    ]
  }
];
