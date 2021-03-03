import Vue from 'vue';
import Vuex from 'vuex';

import { alert } from './alert_module';
import { authentication } from './authentication_module';
import { users } from './user_module';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        alert,
        authentication,
        users
    }
});
