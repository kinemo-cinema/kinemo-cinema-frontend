import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import i18n from "./i18n.js";
import pinia from "./pinia.js";
import {router} from "./router.js";
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import {
    Avatar,
    Button,
    Card, Column, ConfirmDialog, DataTable,
    Drawer, InputNumber,
    InputText,
    Menu,
    Menubar,
    Popover, Select,
    SelectButton,
    Toolbar,
    Tooltip
} from "primevue";

const primeUiLicenseKey = import.meta.env.VITE_PRIME_UI_LICENSE_KEY;
/**
 * Application composition root.
 *
 * @remarks
 * Specifies the main entry point of the Vue application, configuring global plugins, components, and mounting the app to the DOM.
 */

createApp(App)
    .use(i18n)
    .use(pinia)
    .use(router)
    .use(ConfirmationService)
    .use(PrimeVue, { ripple: true, theme: { preset: Material }, license: primeUiLicenseKey })
    .component('pv-button', Button)
    .component('pv-select-button', SelectButton)
    .component('pv-avatar', Avatar)
    .component('pv-drawer', Drawer)
    .component('pv-card', Card)
    .component('pv-toolbar', Toolbar)
    .component('pv-menu', Menu)
    .component('pv-menubar', Menubar)
    .component('pv-popover', Popover)
    .component('pv-input-text', InputText)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .component('pv-input-number', InputNumber)
    .component('pv-select', Select)
    .component('pv-confirm-dialog', ConfirmDialog)
    .directive('tooltip', Tooltip)
    .mount('#app')