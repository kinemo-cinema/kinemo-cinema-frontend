/**
 * Application service store for BC05 — Seat Allocation & Control.
 * Coordinates seat allocation use cases and keeps UI-facing state.
 *
 * @module useSeatAllocationStore
 */

import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {SeatAllocationApi}
    from "../infrastructure/seat-allocation-api.js";

import {SeatAllocationAssembler}
    from "../infrastructure/seat-allocation.assembler.js";

import {ShowSeatAssembler}
    from "../infrastructure/show-seat.assembler.js";

import {ManualInterventionAssembler}
    from "../infrastructure/manual-intervention.assembler.js";

const seatAllocationApi = new SeatAllocationApi();

/**
 * Pinia store for BC05 — Seat Allocation & Control.
 *
 * Manages seat allocations, show seats and manual interventions,
 * including fetching, creation, update and deletion.
 *
 * @returns {Object} Store state, computed properties and actions.
 */
const useSeatAllocationStore = defineStore("seat-allocation", () => {

    // --------------------------------------------------------------------
    // State — seat allocations
    // --------------------------------------------------------------------

    const seatAllocations = ref([]);

    // --------------------------------------------------------------------
    // State — show seats
    // --------------------------------------------------------------------

    const showSeats = ref([]);

    // --------------------------------------------------------------------
    // State — manual interventions
    // --------------------------------------------------------------------

    const manualInterventions = ref([]);

    // --------------------------------------------------------------------
    // State — cross-cutting
    // --------------------------------------------------------------------

    const errors = ref([]);

    const seatAllocationsLoaded = ref(false);
    const showSeatsLoaded = ref(false);
    const manualInterventionsLoaded = ref(false);

    // --------------------------------------------------------------------
    // Computed counts
    // --------------------------------------------------------------------

    const seatAllocationsCount = computed(
        () => seatAllocationsLoaded.value
            ? seatAllocations.value.length
            : 0
    );

    const showSeatsCount = computed(
        () => showSeatsLoaded.value
            ? showSeats.value.length
            : 0
    );

    const manualInterventionsCount = computed(
        () => manualInterventionsLoaded.value
            ? manualInterventions.value.length
            : 0
    );

    // --------------------------------------------------------------------
    // Actions — seat allocations
    // --------------------------------------------------------------------

    function fetchSeatAllocations() {
        errors.value = [];

        seatAllocationApi
            .getSeatAllocations()
            .then(response => {
                seatAllocations.value =
                    SeatAllocationAssembler
                        .toEntitiesFromResponse(response);

                seatAllocationsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function getSeatAllocationById(id) {
        const idNum = parseInt(id);

        return seatAllocations.value.find(
            allocation => allocation.getId() === idNum
        );
    }

    function getSeatAllocationByShowId(showId) {
        const idNum = parseInt(showId);

        return seatAllocations.value.find(
            allocation => allocation.getShowId() === idNum
        );
    }

    function addSeatAllocation(allocation) {
        errors.value = [];

        const resource =
            SeatAllocationAssembler.toResourceFromEntity(allocation);

        seatAllocationApi
            .createSeatAllocation(resource)
            .then(response => {
                const newAllocation =
                    SeatAllocationAssembler
                        .toEntityFromResource(response.data);

                seatAllocations.value.push(newAllocation);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function updateSeatAllocation(allocation) {
        errors.value = [];

        const resource =
            SeatAllocationAssembler.toResourceFromEntity(allocation);

        seatAllocationApi
            .updateSeatAllocation(resource)
            .then(response => {
                const updatedAllocation =
                    SeatAllocationAssembler
                        .toEntityFromResource(response.data);

                const index = seatAllocations.value.findIndex(
                    current =>
                        current.getId() === updatedAllocation.getId()
                );

                if (index !== -1) {
                    seatAllocations.value[index] = updatedAllocation;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function deleteSeatAllocation(allocation) {
        errors.value = [];

        seatAllocationApi
            .deleteSeatAllocation(allocation.getId())
            .then(() => {
                const index = seatAllocations.value.findIndex(
                    current =>
                        current.getId() === allocation.getId()
                );

                if (index !== -1) {
                    seatAllocations.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    // --------------------------------------------------------------------
    // Actions — show seats
    // --------------------------------------------------------------------

    function fetchShowSeats() {
        errors.value = [];

        seatAllocationApi
            .getShowSeats()
            .then(response => {
                showSeats.value =
                    ShowSeatAssembler
                        .toEntitiesFromResponse(response);

                showSeatsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function getShowSeatById(id) {
        const idNum = parseInt(id);

        return showSeats.value.find(
            seat => seat.getId() === idNum
        );
    }

    function addShowSeat(showSeat) {
        errors.value = [];

        const resource =
            ShowSeatAssembler.toResourceFromEntity(showSeat);

        seatAllocationApi
            .createShowSeat(resource)
            .then(response => {
                const newSeat =
                    ShowSeatAssembler
                        .toEntityFromResource(response.data);

                showSeats.value.push(newSeat);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function updateShowSeat(showSeat) {
        errors.value = [];

        const resource =
            ShowSeatAssembler.toResourceFromEntity(showSeat);

        seatAllocationApi
            .updateShowSeat(resource)
            .then(response => {
                const updatedSeat =
                    ShowSeatAssembler
                        .toEntityFromResource(response.data);

                const index = showSeats.value.findIndex(
                    seat => seat.getId() === updatedSeat.getId()
                );

                if (index !== -1) {
                    showSeats.value[index] = updatedSeat;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function deleteShowSeat(showSeat) {
        errors.value = [];

        seatAllocationApi
            .deleteShowSeat(showSeat.getId())
            .then(() => {
                const index = showSeats.value.findIndex(
                    seat => seat.getId() === showSeat.getId()
                );

                if (index !== -1) {
                    showSeats.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    // --------------------------------------------------------------------
    // Actions — manual interventions
    // --------------------------------------------------------------------

    function fetchManualInterventions() {
        errors.value = [];

        seatAllocationApi
            .getManualInterventions()
            .then(response => {
                manualInterventions.value =
                    ManualInterventionAssembler
                        .toEntitiesFromResponse(response);

                manualInterventionsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function getManualInterventionById(id) {
        const idNum = parseInt(id);

        return manualInterventions.value.find(
            intervention => intervention.getId() === idNum
        );
    }

    function addManualIntervention(intervention) {
        errors.value = [];

        const resource =
            ManualInterventionAssembler
                .toResourceFromEntity(intervention);

        seatAllocationApi
            .createManualIntervention(resource)
            .then(response => {
                const newIntervention =
                    ManualInterventionAssembler
                        .toEntityFromResource(response.data);

                manualInterventions.value.push(newIntervention);
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function updateManualIntervention(intervention) {
        errors.value = [];

        const resource =
            ManualInterventionAssembler
                .toResourceFromEntity(intervention);

        seatAllocationApi
            .updateManualIntervention(resource)
            .then(response => {
                const updatedIntervention =
                    ManualInterventionAssembler
                        .toEntityFromResource(response.data);

                const index =
                    manualInterventions.value.findIndex(
                        current =>
                            current.getId() ===
                            updatedIntervention.getId()
                    );

                if (index !== -1) {
                    manualInterventions.value[index] =
                        updatedIntervention;
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    function deleteManualIntervention(intervention) {
        errors.value = [];

        seatAllocationApi
            .deleteManualIntervention(intervention.getId())
            .then(() => {
                const index =
                    manualInterventions.value.findIndex(
                        current =>
                            current.getId() === intervention.getId()
                    );

                if (index !== -1) {
                    manualInterventions.value.splice(index, 1);
                }
            })
            .catch(error => {
                errors.value.push(error);
            });
    }

    // --------------------------------------------------------------------
    // Domain-oriented actions
    // --------------------------------------------------------------------

    function enableSeat(allocation, seatId) {
        errors.value = [];

        try {
            allocation.includeSeat(seatId);
            updateSeatAllocation(allocation);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function disableSeat(allocation, seatId) {
        errors.value = [];

        try {
            allocation.excludeSeat(seatId);
            updateSeatAllocation(allocation);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function activateSoldSeats(allocation) {
        errors.value = [];

        try {
            allocation.activateSoldSeats();
            updateSeatAllocation(allocation);
        } catch (error) {
            errors.value.push(error);
        }
    }

    // --------------------------------------------------------------------
    // Store public API
    // --------------------------------------------------------------------

    return {
        seatAllocations,
        showSeats,
        manualInterventions,

        errors,

        seatAllocationsLoaded,
        showSeatsLoaded,
        manualInterventionsLoaded,

        seatAllocationsCount,
        showSeatsCount,
        manualInterventionsCount,

        fetchSeatAllocations,
        getSeatAllocationById,
        getSeatAllocationByShowId,
        addSeatAllocation,
        updateSeatAllocation,
        deleteSeatAllocation,

        fetchShowSeats,
        getShowSeatById,
        addShowSeat,
        updateShowSeat,
        deleteShowSeat,

        fetchManualInterventions,
        getManualInterventionById,
        addManualIntervention,
        updateManualIntervention,
        deleteManualIntervention,

        enableSeat,
        disableSeat,
        activateSoldSeats
    };
});

export {useSeatAllocationStore};