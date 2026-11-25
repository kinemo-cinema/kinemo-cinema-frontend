<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const managerModules = [
    {
        bc: 'BC01',
        key: 'catalog',
        icon: 'pi pi-video',
        route: '/catalog'
    },
    {
        bc: 'BC02',
        key: 'scheduling',
        icon: 'pi pi-calendar',
        route: '/scheduling'
    },
    {
        bc: 'BC03',
        key: 'rooms',
        icon: 'pi pi-building',
        route: '/room-readiness'
    },
    {
        bc: 'BC04',
        key: 'ticketing',
        icon: 'pi pi-ticket',
        route: '/ticketing'
    },
    {
        bc: 'BC08',
        key: 'analytics',
        icon: 'pi pi-chart-bar',
        route: '/analytics'
    },
    {
        bc: 'BC09',
        key: 'subscription',
        icon: 'pi pi-credit-card',
        route: '/subscriptions/manage'
    }
]

const technicianModules = [
    {
        bc: 'BC05',
        key: 'seat-control',
        icon: 'pi pi-th-large',
        route: '/seat-allocation'
    },
    {
        bc: 'BC06',
        key: 'execution',
        icon: 'pi pi-play-circle',
        route: '/execution'
    },
    {
        bc: 'BC07',
        key: 'maintenance',
        icon: 'pi pi-wrench',
        route: '/maintenance'
    }
]

const labels = computed(() => locale.value === 'es'
    ? {
        title: 'Panel de control',
        subtitle: 'Gestiona las operaciones de tu cine 4D desde un solo lugar.',
        management: 'Gestión comercial y analítica',
        operations: 'Operaciones y mantenimiento',
        open: 'Abrir módulo',
        modules: 'módulos',
        workspace: 'Espacio de trabajo'
    }
    : {
        title: 'Dashboard',
        subtitle: 'Manage your 4D cinema operations from one place.',
        management: 'Commercial & Analytics',
        operations: 'Operations & Maintenance',
        open: 'Open module',
        modules: 'modules',
        workspace: 'Workspace'
    }
)

const sections = computed(() => [
    {
        title: labels.value.management,
        icon: 'pi pi-briefcase',
        type: 'management',
        modules: managerModules
    },
    {
        title: labels.value.operations,
        icon: 'pi pi-cog',
        type: 'operations',
        modules: technicianModules
    }
])
</script>

<template>
    <section class="dashboard">

        <header class="dashboard-heading">

            <div>
                <div class="breadcrumb">
                    <i class="pi pi-home"></i>
                    <span>Kinemo</span>
                    <i class="pi pi-angle-right"></i>
                    <span>{{ labels.workspace }}</span>
                </div>

                <h1>{{ labels.title }}</h1>

                <p>{{ labels.subtitle }}</p>
            </div>

            <div class="workspace-info">
                <i class="pi pi-th-large"></i>
                <span>9 {{ labels.modules }}</span>
            </div>

        </header>

        <section
            v-for="section in sections"
            :key="section.type"
            class="module-section"
            :class="section.type"
        >

            <header class="section-heading">

                <div class="section-title">
                    <i :class="section.icon"></i>
                    <h2>{{ section.title }}</h2>
                </div>

                <span class="section-count">
                    {{ section.modules.length }} {{ labels.modules }}
                </span>

            </header>

            <div class="module-grid">

                <router-link
                    v-for="mod in section.modules"
                    :key="mod.bc"
                    :to="mod.route"
                    class="module-card"
                >

                    <div class="module-top">

                        <div class="module-icon">
                            <i :class="mod.icon"></i>
                        </div>

                        <span class="bc-label">
                            {{ mod.bc }}
                        </span>

                    </div>

                    <div class="module-body">

                        <h3>
                            {{ t(`hub.modules.${mod.key}.title`) }}
                        </h3>

                        <p>
                            {{ t(`hub.modules.${mod.key}.description`) }}
                        </p>

                    </div>

                    <div class="module-footer">

                        <span>{{ labels.open }}</span>

                        <i class="pi pi-arrow-right"></i>

                    </div>

                </router-link>

            </div>

        </section>

    </section>
</template>

<style scoped>
.dashboard {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 4px 0 12px;
    display: flex;
    flex-direction: column;
    gap: 26px;
}

.dashboard-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 0 0 22px;
    border-bottom: 1px solid var(--border);
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: var(--text-muted);
    font-size: 11px;
}

.breadcrumb i {
    font-size: 10px;
}

.breadcrumb span:last-child {
    color: var(--primary-light);
}

.dashboard-heading h1 {
    margin: 0 0 5px;
    color: var(--text);
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.7px;
    line-height: 1.3;
}

.dashboard-heading p {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.6;
}

.workspace-info {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 13px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-muted);
    font-size: 12px;
    white-space: nowrap;
}

.workspace-info i {
    color: var(--primary-light);
}

.module-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 9px;
}

.section-title > i {
    color: var(--primary-light);
    font-size: 15px;
}

.section-title h2 {
    margin: 0;
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.2px;
}

.section-count {
    color: var(--text-muted);
    font-size: 11px;
    white-space: nowrap;
}

.module-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}

.module-card {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 13px;
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    text-decoration: none;
    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.module-card:hover {
    background: var(--bg-card-alt);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.module-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.module-icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    background: rgba(139, 92, 246, 0.10);
    border: 1px solid rgba(139, 92, 246, 0.20);
    border-radius: 8px;
    color: var(--primary-light);
}

.module-icon i {
    font-size: 15px;
}

.bc-label {
    color: var(--text-muted);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.module-body {
    flex: 1;
}

.module-body h3 {
    margin: 0 0 6px;
    color: var(--text);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.2px;
}

.module-body p {
    margin: 0;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.6;
}

.module-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 11px;
    border-top: 1px solid var(--border-soft);
    color: var(--primary-light);
    font-size: 11px;
    font-weight: 600;
}

.module-footer i {
    font-size: 12px;
    transition: transform 0.2s ease;
}

.module-card:hover .module-footer i {
    transform: translateX(3px);
}

.operations .section-title > i {
    color: var(--secondary);
}

.operations .module-icon {
    background: rgba(52, 214, 176, 0.08);
    border-color: rgba(52, 214, 176, 0.18);
    color: var(--secondary);
}

.operations .module-footer {
    color: var(--secondary);
}

.operations .module-card:hover {
    border-color: rgba(52, 214, 176, 0.45);
}

@media (min-width: 1600px) {
    .module-card {
        padding: 18px;
    }
}

@media (max-width: 1000px) {
    .module-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .dashboard {
        gap: 22px;
    }

    .dashboard-heading {
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;
    }

    .dashboard-heading h1 {
        font-size: 23px;
    }

    .module-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
    }

    .section-title h2 {
        font-size: 14px;
    }

    .module-card {
        padding: 14px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .module-card,
    .module-footer i {
        transition: none;
    }

    .module-card:hover,
    .module-card:hover .module-footer i {
        transform: none;
    }
}
</style>