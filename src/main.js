
import "babel-polyfill";
import Vue from 'vue';

import App_sudozahod from "./App_sudozahod.vue";
import App_sudoothod from "./App_sudoothod.vue";

import App_sudozahod_prosmotr from "./App_sudozahod_prosmotr.vue";
import App_sudoothod_prosmotr from "./App_sudoothod_prosmotr.vue";

import App_sudos from "./App_sudos.vue";
import App_sudos_prosmotr from "./App_sudos_prosmotr.vue";

import upload from "./upload.vue";
Vue.component("app-upload", upload);

import axios from "axios";

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);


new Vue({el:"#App_sudozahod",render: h => h(App_sudozahod)});
new Vue({el:"#App_sudoothod",render: h => h(App_sudoothod)});

new Vue({el:"#App_sudozahod_prosmotr",render: h => h(App_sudozahod_prosmotr)});
new Vue({el:"#App_sudoothod_prosmotr",render: h => h(App_sudoothod_prosmotr)});

new Vue({ el: "#App_sudos", render: h => h(App_sudos) });
new Vue({ el: "#App_sudos_prosmotr", render: h => h(App_sudos_prosmotr) });

