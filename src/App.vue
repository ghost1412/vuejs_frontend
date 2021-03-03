<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">VueJs Frontend</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/app" class="nav-link">Apps</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/launch_conf" class="nav-link">Launch Configuration</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/launch_spec" class="nav-link">Launch Specification</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/instance_request" class="nav-link">Instance Request</router-link>
        </li>     
        <li class="nav-item">
          <router-link to="/auto_scaling_policy" class="nav-link">Auto Scaling Policy</router-link>
        </li>  
        <li class="nav-item">
          <router-link to="/metric" class="nav-link">Metrics</router-link>
        </li>   
                   
      </div>
            <ul class="navbar-nav">
            <li class="nav-item" style="text-align: right;">
              <router-link to="/logout" class="nav-link">Logout</router-link>
            </li>   
        </ul>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "app",
  computed: mapGetters('auth', [
    'isAuthenticated',
  ]),
};
</script>

