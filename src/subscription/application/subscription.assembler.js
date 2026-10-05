import { Subscription } from '../domain/subscription.entity';

export class SubscriptionAssembler {
    static toEntity(resource) {
        return new Subscription({
            id: resource.id,
            planName: resource.planName || resource.name,
            price: resource.price,
            status: resource.status,
            renewalDate: resource.renewalDate,
            contractId: resource.contractId
        });
    }

    static toResource(entity) {
        return {
            id: entity.id,
            planName: entity.planName,
            price: entity.price,
            status: entity.status,
            renewalDate: entity.renewalDate,
            contractId: entity.contractId
        };
    }
}