import {ResourceCalculation} from "../domain/model/resource-calculation.entity.js";

/**
 * @class ResourceCalculationAssembler
 * @summary Converts resource calculation API resources to entities and back.
 */
export class ResourceCalculationAssembler {

    /**
     * Converts a resource calculation resource to a ResourceCalculation
     * entity.
     * @static
     * @param {Object} resource - The calculation resource from the API.
     * @returns {ResourceCalculation} The ResourceCalculation entity.
     */
    static toEntityFromResource(resource) {
        return new ResourceCalculation({
            id: resource.id ?? null,
            showId: resource.showId ?? null,
            waterRequiredLiters: resource.waterRequiredLiters ?? 0,
            airRequiredUnits: resource.airRequiredUnits ?? 0,
            calculationStatus: resource.calculationStatus ?? 'PENDING',
            calculatedAt: resource.calculatedAt ?? null,
        });
    }

    /**
     * Converts an API response to an array of ResourceCalculation entities.
     * @static
     * @param {Object} response - The API response object.
     * @returns {ResourceCalculation[]} Array of ResourceCalculation entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : response.data['resourceCalculations'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Converts a ResourceCalculation entity to a resource for API submission.
     * @static
     * @param {ResourceCalculation} calculation - The ResourceCalculation entity.
     * @returns {Object} The resource calculation resource.
     */
    static toResourceFromEntity(calculation) {
        return {
            id: calculation.getId(),
            showId: calculation.getShowId(),
            waterRequiredLiters: calculation.getWaterRequiredLiters(),
            airRequiredUnits: calculation.getAirRequiredUnits(),
            calculationStatus: calculation.getStatusAsString(),
            calculatedAt: calculation.getCalculatedAtFormated(),
        };
    }
}