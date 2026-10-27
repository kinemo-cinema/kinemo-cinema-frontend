import {AllocationStatus}
    from "./allocation-status.value-object.js";

import {ShowSeat}
    from "./show-seat.entity.js";

import {ManualIntervention}
    from "./manual-intervention.entity.js";

export class SeatAllocation {

    constructor({
                    id = null,
                    showId = null,
                    status = null,
                    seats = [],
                    interventions = []
                } = {}) {

        this._id = id;
        this._showId = showId;

        this._status = status instanceof AllocationStatus
            ? status
            : new AllocationStatus(status ?? "PENDING");

        this._seats = seats.filter(
            seat => seat instanceof ShowSeat
        );

        this._interventions = interventions.filter(
            intervention =>
                intervention instanceof ManualIntervention
        );
    }

    getId = () => this._id;

    getShowId = () => this._showId;

    getStatus = () => this._status;

    getStatusAsString = () => this._status.toString();

    getSeats = () => [...this._seats];

    getSeatCount = () => this._seats.length;

    getSeatById(seatId) {
        return this._seats.find(
            seat => seat.getSeatId() === seatId
        ) ?? null;
    }

    assignSeat(seat) {
        if (!(seat instanceof ShowSeat)) {
            throw new TypeError(
                "Expected a ShowSeat instance"
            );
        }

        const exists = this._seats.some(
            current =>
                current.getSeatId() === seat.getSeatId()
        );

        if (!exists) {
            this._seats.push(seat);
        }
    }

    includeSeat(seatId) {
        const seat = this.getSeatById(seatId);

        if (!seat) {
            throw new Error(
                `Seat ${seatId} was not found`
            );
        }

        seat.enable();
    }

    excludeSeat(seatId) {
        const seat = this.getSeatById(seatId);

        if (!seat) {
            throw new Error(
                `Seat ${seatId} was not found`
            );
        }

        seat.disable();
    }

    activateSoldSeats() {
        this._seats
            .filter(seat => seat.isSold())
            .forEach(seat => {
                if (!seat.getStatus().isOutOfService()) {
                    seat.enable();
                }
            });

        this._status = AllocationStatus.ready();
    }

    getInterventions = () =>
        [...this._interventions];

    addIntervention(intervention) {
        if (!(intervention instanceof ManualIntervention)) {
            throw new TypeError(
                "Expected a ManualIntervention instance"
            );
        }

        this._interventions.push(intervention);
    }

    markAsSynchronized() {
        this._status = AllocationStatus.synchronized();
    }

    markAsReady() {
        this._status = AllocationStatus.ready();
    }

    closeAllocation() {
        this._status = AllocationStatus.closed();
    }
}