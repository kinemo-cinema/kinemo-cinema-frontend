import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import i18n from './i18n.js'
import pinia from './pinia.js'
import { router } from './router.js'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import { definePreset } from '@primeuix/themes'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import {
    Avatar,
    Button,
    Card,
    Column,
    ConfirmDialog,
    DataTable,
    Drawer,
    InputNumber,
    InputText,
    Menu,
    Menubar,
    Popover,
    Select,
    SelectButton,
    Toolbar,
    Tooltip
} from 'primevue'

const primeUiLicenseKey = import.meta.env.VITE_PRIME_UI_LICENSE_KEY

const KinemoPreset = definePreset(Material, {
    semantic: {
        primary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
            950: '#2e1065'
        },
        colorScheme: {
            dark: {
                primary: {
                    color: '#a78bfa',
                    contrastColor: '#0e0f17',
                    hoverColor: '#c4b5fd',
                    activeColor: '#8b5cf6'
                },
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#e2e8f0',
                    200: '#cbd5e1',
                    300: '#94a3b8',
                    400: '#64748b',
                    500: '#475569',
                    600: '#35374a',
                    700: '#2d2f45',
                    800: '#20212c',
                    900: '#16171e',
                    950: '#0e0f17'
                }
            }
        }
    }
})

document.documentElement.classList.add('kinemo-dark')

createApp(App)
    .use(i18n)
    .use(pinia)
    .use(router)
    .use(ConfirmationService)
    .use(PrimeVue, {
        ripple: true,
        theme: {
            preset: KinemoPreset,
            options: {
                darkModeSelector: '.kinemo-dark'
            }
        },
        license: primeUiLicenseKey
    })
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