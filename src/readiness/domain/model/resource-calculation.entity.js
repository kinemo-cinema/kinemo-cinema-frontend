import {CalculationStatus} from './calculation-status.value-object.js';
import {DateTime} from '../../../shared/domain/model/date-time.js';

/**
 * @class ResourceCalculation
 * @summary Entity representing the consumable resource requirements of a
 * scheduled show. Records how much water and air a specific show will
 * consume, so the room can be prepared before execution.
 *
 * References its show by identifier only — the Show aggregate is owned
 * by BC02 (Scheduling & Calendar).
 */
export class ResourceCalculation {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a calculation not yet persisted.
     * @param {number|null} [props.showId] - Identifier of the show being calculated for.
     * @param {number} [props.waterRequiredLiters] - Liters of water required by the show.
     * @param {number} [props.airRequiredUnits] - Units of compressed air required by the show.
     * @param {CalculationStatus|string|null} [props.calculationStatus] - A `CalculationStatus`, or its string form. Defaults to PENDING.
     * @param {DateTime|string|null} [props.calculatedAt] - When the calculation was performed.
     * @throws {Error} If `calculationStatus` is an invalid string.
     * @throws {Error} If `calculatedAt` is `undefined` or not a valid date-time.
     */
    constructor({
                    id = null,
                    showId = null,
                    waterRequiredLiters = 0,
                    airRequiredUnits = 0,
                    calculationStatus = null,
                    calculatedAt = null
                } = {}) {
        this._id = id;
        this._showId = showId;
        this._waterRequiredLiters = Number.isFinite(waterRequiredLiters) ? waterRequiredLiters : 0;
        this._airRequiredUnits = Number.isFinite(airRequiredUnits) ? airRequiredUnits : 0;
        this._calculationStatus = calculationStatus instanceof CalculationStatus
            ? calculationStatus
            : new CalculationStatus(calculationStatus ?? 'PENDING');
        this._calculatedAt = calculatedAt instanceof DateTime
            ? calculatedAt
            : new DateTime(calculatedAt);
    }

    /** @returns {number|null} The calculation's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the calculated show. */
    getShowId = () => this._showId;

    /** @returns {number} The water requirement in liters. */
    getWaterRequiredLiters = () => this._waterRequiredLiters;

    /** @returns {number} The air requirement in units. */
    getAirRequiredUnits = () => this._airRequiredUnits;

    /** @returns {CalculationStatus} The calculation status. */
    getStatus = () => this._calculationStatus;

    /** @returns {string} The calculation status as a string. */
    getStatusAsString = () => this._calculationStatus.toString();

    /** @returns {DateTime} When the calculation was performed. */
    getCalculatedAt = () => this._calculatedAt;

    /** @returns {string} The calculation timestamp as an ISO 8601 string. */
    getCalculatedAtFormated = () => this._calculatedAt.toISOString();

    /**
     * Determines whether the calculation requires any consumable resources.
     *
     * @returns {boolean} True if water or air is needed.
     */
    requiresResources() {
        return this._waterRequiredLiters > 0 || this._airRequiredUnits > 0;
    }

    /**
     * Determines whether the calculation is finalized and can be trusted
     * for room preparation.
     *
     * @returns {boolean} True if the status is terminal.
     */
    isFinalized() {
        return this._calculationStatus.isFinalized();
    }

    /**
     * Marks the calculation as completed with the given resource values.
     *
     * @param {number} waterLiters - The water requirement in liters.
     * @param {number} airUnits - The air requirement in units.
     * @returns {void}
     */
    finalize(waterLiters, airUnits) {
        this._waterRequiredLiters = Number.isFinite(waterLiters) ? waterLiters : 0;
        this._airRequiredUnits = Number.isFinite(airUnits) ? airUnits : 0;
        this._calculationStatus = CalculationStatus.calculated();
        this._calculatedAt = DateTime.now();
    }

    /**
     * Marks the calculation as not required, for shows that consume no
     * water or air effects.
     *
     * @returns {void}
     */
    markAsNotRequired() {
        this._waterRequiredLiters = 0;
        this._airRequiredUnits = 0;
        this._calculationStatus = CalculationStatus.notRequired();
        this._calculatedAt = DateTime.now();
    }
}