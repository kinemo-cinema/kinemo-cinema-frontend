import {TicketingIntegration} from "../domain/model/ticketing-integration.entity.js";

/**
 * @class TicketingIntegrationAssembler
 * @summary Converts ticketing connection API resources to entities and back.
 */
export class TicketingIntegrationAssembler {

    static toEntityFromResource(resource) {
        return new TicketingIntegration({
            id: resource.id ?? null,
            systemName: resource.systemName ?? '',
            endpointUrl: resource.endpointUrl ?? '',
            connectionStatus: resource.connectionStatus ?? 'AVAILABLE',
            lastVerifiedAt: resource.lastVerifiedAt ?? null,
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['ticketingConnections'];

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(integration) {
        return {
            id: integration.getId(),
            systemName: integration.getSystemName(),
            endpointUrl: integration.getEndpointUrl(),
            connectionStatus:
                integration.getConnectionStatusAsString(),
            lastVerifiedAt:
                integration.getLastVerifiedAt()?.toISOString() ?? null,
        };
    }
}