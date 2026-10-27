import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const seatAllocationsEndpointPath =
    import.meta.env.VITE_SEAT_ALLOCATIONS_ENDPOINT_PATH;

const showSeatsEndpointPath =
    import.meta.env.VITE_SHOW_SEATS_ENDPOINT_PATH;

const manualInterventionsEndpointPath =
    import.meta.env.VITE_MANUAL_INTERVENTIONS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for BC05 — Seat Allocation & Control.
 * Exposes endpoints for seat allocations, show seats and manual interventions.
 *
 * @class SeatAllocationApi
 * @extends BaseApi
 */
export class SeatAllocationApi extends BaseApi {

    /** @type {BaseEndpoint} @private */
    #seatAllocationsEndpoint;

    /** @type {BaseEndpoint} @private */
    #showSeatsEndpoint;

    /** @type {BaseEndpoint} @private */
    #manualInterventionsEndpoint;

    /** Creates endpoint clients for every resource in BC05. */
    constructor() {
        super();

        this.#seatAllocationsEndpoint =
            new BaseEndpoint(this, seatAllocationsEndpointPath);

        this.#showSeatsEndpoint =
            new BaseEndpoint(this, showSeatsEndpointPath);

        this.#manualInterventionsEndpoint =
            new BaseEndpoint(this, manualInterventionsEndpointPath);
    }

    // -------------------------------------------------------------
    // Seat allocations
    // -------------------------------------------------------------

    getSeatAllocations() {
        return this.#seatAllocationsEndpoint.getAll();
    }

    getSeatAllocationById(id) {
        return this.#seatAllocationsEndpoint.getById(id);
    }

    createSeatAllocation(resource) {
        return this.#seatAllocationsEndpoint.create(resource);
    }

    updateSeatAllocation(resource) {
        return this.#seatAllocationsEndpoint.update(
            resource.id,
            resource
        );
    }

    deleteSeatAllocation(id) {
        return this.#seatAllocationsEndpoint.delete(id);
    }

    // -------------------------------------------------------------
    // Show seats
    // -------------------------------------------------------------

    getShowSeats() {
        return this.#showSeatsEndpoint.getAll();
    }

    getShowSeatById(id) {
        return this.#showSeatsEndpoint.getById(id);
    }

    createShowSeat(resource) {
        return this.#showSeatsEndpoint.create(resource);
    }

    updateShowSeat(resource) {
        return this.#showSeatsEndpoint.update(
            resource.id,
            resource
        );
    }

    deleteShowSeat(id) {
        return this.#showSeatsEndpoint.delete(id);
    }

    // -------------------------------------------------------------
    // Manual interventions
    // -------------------------------------------------------------

    getManualInterventions() {
        return this.#manualInterventionsEndpoint.getAll();
    }

    getManualInterventionById(id) {
        return this.#manualInterventionsEndpoint.getById(id);
    }

    createManualIntervention(resource) {
        return this.#manualInterventionsEndpoint.create(resource);
    }

    updateManualIntervention(resource) {
        return this.#manualInterventionsEndpoint.update(
            resource.id,
            resource
        );
    }

    deleteManualIntervention(id) {
        return this.#manualInterventionsEndpoint.delete(id);
    }
}