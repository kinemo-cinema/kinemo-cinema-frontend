export class ManualIntervention {

    constructor({
                    id = null,
                    seatId = null,
                    operatorId = null,
                    reason = "",
                    interventionDate = null
                } = {}) {

        this._id = id;
        this._seatId = seatId;
        this._operatorId = operatorId;
        this._reason = reason;
        this._interventionDate =
            interventionDate
                ? new Date(interventionDate)
                : new Date();
    }

    getId = () => this._id;

    getSeatId = () => this._seatId;

    getOperatorId = () => this._operatorId;

    getReason = () => this._reason;

    getInterventionDate = () => this._interventionDate;

    getInterventionDateFormatted = () =>
        this._interventionDate.toISOString();
}