export class IncidentStatus {
    static REPORTED = 'REPORTED';
    static IN_REVIEW = 'IN_REVIEW';
    static RESOLVED = 'RESOLVED';
    static CLOSED = 'CLOSED';

    #value;
    constructor(value = IncidentStatus.REPORTED) {
        const normalized = String(value).toUpperCase();
        if (!IncidentStatus.isValid(normalized)) throw new Error(`Invalid incident status: ${value}`);
        this.#value = normalized;
    }
    toString() { return this.#value; }
    static isValid(value) { return [IncidentStatus.REPORTED, IncidentStatus.IN_REVIEW, IncidentStatus.RESOLVED, IncidentStatus.CLOSED].includes(value); }
}
