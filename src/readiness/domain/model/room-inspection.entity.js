import {InspectionStatus} from './inspection-status.value-object.js';
import {DateTime} from '../../../shared/domain/model/date-time.js';

/**
 * @class RoomInspection
 * @summary Entity representing a single readiness inspection performed on
 * a room. Owned by the Room aggregate root.
 */
export class RoomInspection {

    /**
     * @param {Object} props
     * @param {number|null} [props.id] - Unique identifier. `null` for a record not yet persisted.
     * @param {number|null} [props.roomId] - Identifier of the inspected room.
     * @param {number|null} [props.inspectorId] - Identifier of the staff member who performed the inspection.
     * @param {InspectionStatus|string|null} [props.inspectionStatus] - An `InspectionStatus`, or its string form. Defaults to PENDING.
     * @param {boolean} [props.technicalReviewRequired] - Whether the inspection flagged a follow-up technical review.
     * @param {DateTime|string|null} [props.inspectedAt] - When the inspection was performed.
     * @throws {Error} If `inspectionStatus` is an invalid string.
     * @throws {Error} If `inspectedAt` is `undefined` or not a valid date-time.
     */
    constructor({
                    id = null,
                    roomId = null,
                    inspectorId = null,
                    inspectionStatus = null,
                    technicalReviewRequired = false,
                    inspectedAt = null
                } = {}) {
        this._id = id;
        this._roomId = roomId;
        this._inspectorId = inspectorId;
        this._inspectionStatus = inspectionStatus instanceof InspectionStatus
            ? inspectionStatus
            : new InspectionStatus(inspectionStatus ?? 'PENDING');
        this._technicalReviewRequired = Boolean(technicalReviewRequired);
        this._inspectedAt = inspectedAt instanceof DateTime ? inspectedAt : new DateTime(inspectedAt);
    }

    /** @returns {number|null} The inspection's unique identifier. */
    getId = () => this._id;

    /** @returns {number|null} The identifier of the inspected room. */
    getRoomId = () => this._roomId;

    /** @returns {number|null} The identifier of the inspector. */
    getInspectorId = () => this._inspectorId;

    /** @returns {InspectionStatus} The inspection outcome. */
    getStatus = () => this._inspectionStatus;

    /** @returns {string} The inspection outcome as a string. */
    getStatusAsString = () => this._inspectionStatus.toString();

    /** @returns {boolean} Whether a follow-up technical review is required. */
    requiresTechnicalReview = () => this._technicalReviewRequired;

    /** @returns {DateTime} When the inspection was performed. */
    getInspectedAt = () => this._inspectedAt;

    /** @returns {string} The inspection timestamp as an ISO 8601 string. */
    getInspectedAtFormated = () => this._inspectedAt.toISOString();

    /**
     * Determines whether this inspection clears the room for operation.
     * An inspection clears the room only when it was approved and did not
     * flag a technical review.
     *
     * @returns {boolean} True if the room can be considered ready.
     */
    clearsRoom() {
        return this._inspectionStatus.clearsRoom() && !this._technicalReviewRequired;
    }

    /**
     * Marks the inspection as approved.
     *
     * @returns {void}
     */
    approve() {
        this._inspectionStatus = InspectionStatus.approved();
    }

    /**
     * Marks the inspection as rejected.
     *
     * @returns {void}
     */
    reject() {
        this._inspectionStatus = InspectionStatus.rejected();
    }

    /**
     * Flags a follow-up technical review on this inspection.
     *
     * @returns {void}
     */
    flagForTechnicalReview() {
        this._technicalReviewRequired = true;
    }

    /**
     * Attaches this inspection to a room. Called by the aggregate root
     * when the inspection is added to a Room's collection.
     *
     * @param {number} roomId - The identifier of the owning room.
     * @returns {void}
     */
    assignToRoom(roomId) {
        this._roomId = roomId;
    }
}