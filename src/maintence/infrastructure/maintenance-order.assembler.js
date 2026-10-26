import {MaintenanceOrder} from '../domain/model/maintenance-order.entity.js';
export class MaintenanceOrderAssembler {
    static toEntityFromResource(r){return new MaintenanceOrder(r);}
    static toEntitiesFromResponse(response){ if(response.status!==200)return []; const resources=Array.isArray(response.data)?response.data:response.data.maintenanceOrders; return resources.map(r=>this.toEntityFromResource(r)); }
    static toResourceFromEntity(e){return {id:e.getId(),hardwareComponentId:e.getHardwareComponentId(),incidentReportId:e.getIncidentReportId(),technicianId:e.getTechnicianId(),orderType:e.getOrderType(),executionStatus:e.getExecutionStatus(),technicalDescription:e.getTechnicalDescription(),scheduledFor:e.getScheduledFor()?.toISOString()??null,closedAt:e.getClosedAt()?.toISOString()??null};}
}
