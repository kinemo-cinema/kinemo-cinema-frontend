import {defineStore} from 'pinia';
import {computed, shallowRef, ref} from 'vue';
import {MaintenanceApi} from '../infrastructure/maintenance-api.js';
import {HardwareChannelTestAssembler} from '../infrastructure/hardware-channel-test.assembler.js';
import {HardwareComponentAssembler} from '../infrastructure/hardware-component.assembler.js';
import {IncidentReportAssembler} from '../infrastructure/incident-report.assembler.js';
import {MaintenanceOrderAssembler} from '../infrastructure/maintenance-order.assembler.js';

const api = new MaintenanceApi();

const useMaintenanceStore = defineStore('maintenance', () => {
    const channelTests = shallowRef([]);
    const hardwareComponents = shallowRef([]);
    const incidents = shallowRef([]);
    const maintenanceOrders = shallowRef([]);
    const errors = ref([]);
    const loaded = ref(false);

    const failedTestsCount = computed(
        () => channelTests.value.filter(t => !t.getTestResult().isPassed()).length
    );

    const openIncidentsCount = computed(
        () => incidents.value.filter(
            i => !['RESOLVED', 'CLOSED'].includes(i.getIncidentStatusAsString())
        ).length
    );

    const pendingOrdersCount = computed(
        () => maintenanceOrders.value.filter(
            o => o.getExecutionStatus() !== 'COMPLETED'
        ).length
    );

    function fetchAll() {
        errors.value = [];

        return Promise.all([
            api.getChannelTests(),
            api.getComponents(),
            api.getIncidents(),
            api.getMaintenanceOrders()
        ])
            .then(([tests, components, incidentsResponse, orders]) => {
                channelTests.value =
                    HardwareChannelTestAssembler.toEntitiesFromResponse(tests);

                hardwareComponents.value =
                    HardwareComponentAssembler.toEntitiesFromResponse(components);

                incidents.value =
                    IncidentReportAssembler.toEntitiesFromResponse(incidentsResponse);

                maintenanceOrders.value =
                    MaintenanceOrderAssembler.toEntitiesFromResponse(orders);

                loaded.value = true;
            })
            .catch(e => errors.value.push(e));
    }

    return {
        channelTests,
        hardwareComponents,
        incidents,
        maintenanceOrders,
        errors,
        loaded,
        failedTestsCount,
        openIncidentsCount,
        pendingOrdersCount,
        fetchAll
    };
});

export default useMaintenanceStore;