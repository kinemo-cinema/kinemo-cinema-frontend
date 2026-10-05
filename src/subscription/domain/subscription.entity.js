export class Subscription {
    constructor({ id = '', planName = '', price = 0, status = 'PENDING', renewalDate = '', contractId = '' }) {
        this.id = id;
        this.planName = planName;
        this.price = price;
        this.status = status; // 'ACTIVE', 'CANCELED', 'PENDING'
        this.renewalDate = renewalDate;
        this.contractId = contractId;
    }
}