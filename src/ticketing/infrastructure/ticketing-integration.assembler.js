import {TicketingIntegration} from "../domain/model/ticketing-integration.entity.js";

/**
 * @class TicketingIntegrationAssembler
 * @summary Converts ticketing integration API resources to entities and back.
 */
export class TicketingIntegrationAssembler {

    /**
     * Converts a ticketing integration resource to a domain entity.
     *
     * @static
     * @param {Object} resource - The ticketing integration resource from the API.
     * @returns {TicketingIntegration} The TicketingIntegration entity.
     */
    static toEntityFromResource(resource) {
        return new TicketingIntegration({
            integrationId: resource.id ?? null,
            cinemaId: resource.cinemaId ?? null,
            providerName: resource.providerName ?? '',
            status: resource.status ?? 'DISCONNECTED',
        });
    }

    /**
     * Converts an API response to an array of TicketingIntegration entities.
     *
     * @static
     * @param {Object} response - The API response object.
     * @returns {TicketingIntegration[]} Array of TicketingIntegration entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data['ticketingIntegrations'];

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }

    /**
     * Converts a TicketingIntegration entity to a resource for API submission.
     *
     * @static
     * @param {TicketingIntegration} integration - TicketingIntegration entity.
     * @returns {Object} Ticketing integration resource.
     */
    static toResourceFromEntity(integration) {
        return {
            id: integration.getId(),
            cinemaId: integration.getCinemaId(),
            providerName: integration.getProviderName(),
            status: integration.getStatusAsString(),
        };
    }
}