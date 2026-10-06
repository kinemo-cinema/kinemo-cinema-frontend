export class MaintenanceOrder {
    constructor({ id=null, hardwareComponentId=null, incidentReportId=null, technicianId=null, orderType='PREVENTIVE', executionStatus='SCHEDULED', technicalDescription='', scheduledFor=null, closedAt=null }={}) {
        this._id=id; this._hardwareComponentId=hardwareComponentId; this._incidentReportId=incidentReportId;
        this._technicianId=technicianId; this._orderType=orderType; this._executionStatus=executionStatus;
        this._technicalDescription=technicalDescription; this._scheduledFor=scheduledFor ? new Date(scheduledFor) : null;
        this._closedAt=closedAt ? new Date(closedAt) : null;
    }
    getId(){return this._id;} getHardwareComponentId(){return this._hardwareComponentId;} getIncidentReportId(){return this._incidentReportId;}
    getTechnicianId(){return this._technicianId;} getOrderType(){return this._orderType;} getExecutionStatus(){return this._executionStatus;}
    getTechnicalDescription(){return this._technicalDescription;} getScheduledFor(){return this._scheduledFor;} getClosedAt(){return this._closedAt;}
    schedule(date){this._scheduledFor=new Date(date); this._executionStatus='SCHEDULED';}
    start(){this._executionStatus='IN_PROGRESS';}
    close(){this._executionStatus='COMPLETED'; this._closedAt=new Date();}
}
