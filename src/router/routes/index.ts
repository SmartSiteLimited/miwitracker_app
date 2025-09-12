import DefaultLayout from "@/layouts/Default.vue";

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
        meta: {
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
        meta: {
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
        meta: {
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
        meta: {
          title: 'Group List'
        },
        component: () => import('@/views/GroupList.vue')
      }
    ]
  }
];
