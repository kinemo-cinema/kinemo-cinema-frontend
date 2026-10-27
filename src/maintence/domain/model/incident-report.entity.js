import {IncidentStatus} from './incident-status.value-object.js';
export class IncidentReport {
    constructor({id=null, hardwareComponentId=null, reporterId=null, severityLevel='Normal', priorityLevel='MEDIUM', incidentStatus='REPORTED', reportedAt=null}={}) {
        this._id=id; this._hardwareComponentId=hardwareComponentId; this._reporterId=reporterId; this._severityLevel=severityLevel;
        this._priorityLevel=priorityLevel; this._incidentStatus=incidentStatus instanceof IncidentStatus ? incidentStatus : new IncidentStatus(incidentStatus);
        this._reportedAt=reportedAt ? new Date(reportedAt) : null;
    }
    getId(){return this._id;} getHardwareComponentId(){return this._hardwareComponentId;} getReporterId(){return this._reporterId;}
    getSeverityLevel(){return this._severityLevel;} getPriorityLevel(){return this._priorityLevel;}
    getIncidentStatus(){return this._incidentStatus;} getIncidentStatusAsString(){return this._incidentStatus.toString();} getReportedAt(){return this._reportedAt;}
    markInReview(){this._incidentStatus=new IncidentStatus(IncidentStatus.IN_REVIEW);} resolve(){this._incidentStatus=new IncidentStatus(IncidentStatus.RESOLVED);} close(){this._incidentStatus=new IncidentStatus(IncidentStatus.CLOSED);}
}
