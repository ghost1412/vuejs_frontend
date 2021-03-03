import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);


export const router =new Router({
  mode: "history",
  routes: [
    {
      path: '/logout',
      name: "Logout",
      component: () => import("../components/authentication/Logout"),
    }, 
    {
      path: '/graphite_metric',
      name: "GraphiteMetric",
      component: () => import("../components/Metric/GraphiteMetric"),
    },     
    {
      path: '/cloud_watch_metric',
      name: "CloudWatchMetric",
      component: () => import("../components/Metric/CloudWatchMetric"),
    },     
    {
      path: '/prometheus_metric',
      name: "PrometheusMetric",
      component: () => import("../components/Metric/PrometheusMetric"),
    },      
    {
      path: '/metric',
      name: "Metric",
      component: () => import("../components/Metric/index"),
    },    
    {
      path: '/auto_scaling_policy',
      name: "AutoScale",
      component: () => import("../components/AutoScaleList"),
    },
    {
      path: '/instance_request',
      name: "InstanceRequest",
      component: () => import("../components/Instance"),
    },    
    {
      path: '/launch_spec',
      name: "LaunchSpec",
      component: () => import("../components/LaunchSpecList"),
    },
    {
      path: '/launch_spec/:id',
      name: "LaunchSpecId",
      component: () => import("../components/LaunchSpecList"),
    },
    {
      path: '/launch_conf',
      name: "LaunchConfig",
      component: () => import("../components/LaunchConfigList"),
    },
    {
      path: '/launch_conf/:id',
      name: "LaunchConfigId",
      component: () => import("../components/LaunchConfigList"),
    },
    {
      path: "/",
      alias: "/app",
      name: "app",
      component: () => import("../components/AppList"),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("../components/authentication/Login"),
    },    
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})

