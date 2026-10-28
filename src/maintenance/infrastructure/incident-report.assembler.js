import {IncidentReport} from '../domain/model/incident-report.entity.js';
export class IncidentReportAssembler {
    static toEntityFromResource(r){return new IncidentReport(r);}
    static toEntitiesFromResponse(response){ if(response.status!==200)return []; const resources=Array.isArray(response.data)?response.data:response.data.incidentReports; return resources.map(r=>this.toEntityFromResource(r)); }
    static toResourceFromEntity(e){return {id:e.getId(),hardwareComponentId:e.getHardwareComponentId(),reporterId:e.getReporterId(),severityLevel:e.getSeverityLevel(),priorityLevel:e.getPriorityLevel(),incidentStatus:e.getIncidentStatusAsString(),reportedAt:e.getReportedAt()?.toISOString()??null};}
}
