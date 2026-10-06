import {HardwareExecutionLog}
    from "../domain/model/hardware-execution-log.entity.js";

export class HardwareExecutionLogAssembler {

    static toEntityFromResource(resource) {
        return new HardwareExecutionLog({
            id: resource.id ?? null,

            occurredAt:
                resource.occurredAt ??
                resource.executedAt ??
                new Date(),

            message:
                resource.message ??
                resource.details ??
                "",

            severity:
                resource.severity ??
                "INFO"
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(
                `${response.status}: ${response.statusText}`
            );
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : response.data["hardwareExecutionLogs"];

        return resources.map(
            resource => this.toEntityFromResource(resource)
        );
    }

    static toResourceFromEntity(log) {
        return {
            id: log.getId(),
            occurredAt: log.getOccurredAtFormatted(),
            message: log.getMessage(),
            severity: log.getSeverityAsString()
        };
    }
}