import {SeatStatus} from "./seat-status.value-object.js";

export class ShowSeat {

    constructor({
                    id = null,
                    seatId = null,
                    sold = false,
                    enabled = false,
                    status = null
                } = {}) {

        this._id = id;
        this._seatId = seatId;
        this._sold = Boolean(sold);
        this._enabled = Boolean(enabled);

        this._status = status instanceof SeatStatus
            ? status
            : new SeatStatus(status ?? "AVAILABLE");
    }

    getId = () => this._id;

    getSeatId = () => this._seatId;

    isSold = () => this._sold;

    isEnabled = () => this._enabled;

    getStatus = () => this._status;

    getStatusAsString = () => this._status.toString();

    markAsSold() {
        this._sold = true;
        this._status = SeatStatus.sold();
    }

    enable() {
        if (this._status.isOutOfService()) {
            throw new Error(
                "Cannot enable a seat that is out of service"
            );
        }

        this._enabled = true;
        this._status = SeatStatus.enabled();
    }

    disable() {
        this._enabled = false;
        this._status = SeatStatus.disabled();
    }

    markOutOfService() {
        this._enabled = false;
        this._status = SeatStatus.outOfService();
    }
}