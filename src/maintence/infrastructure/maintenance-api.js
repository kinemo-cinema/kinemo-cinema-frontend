import {BaseApi} from '../../shared/infrastructure/base-api.js';
import {BaseEndpoint} from '../../shared/infrastructure/base-endpoint.js';
const testsPath=import.meta.env.VITE_HARDWARE_CHANNEL_TESTS_ENDPOINT_PATH;
const componentsPath=import.meta.env.VITE_HARDWARE_COMPONENTS_ENDPOINT_PATH;
const incidentsPath=import.meta.env.VITE_INCIDENT_REPORTS_ENDPOINT_PATH;
const ordersPath=import.meta.env.VITE_MAINTENANCE_ORDERS_ENDPOINT_PATH;
export class MaintenanceApi extends BaseApi {
    #testsEndpoint; #componentsEndpoint; #incidentsEndpoint; #ordersEndpoint;
    constructor(){super(); this.#testsEndpoint=new BaseEndpoint(this,testsPath); this.#componentsEndpoint=new BaseEndpoint(this,componentsPath); this.#incidentsEndpoint=new BaseEndpoint(this,incidentsPath); this.#ordersEndpoint=new BaseEndpoint(this,ordersPath);}
    getChannelTests(){return this.#testsEndpoint.getAll();}
    getComponents(){return this.#componentsEndpoint.getAll();}
    getIncidents(){return this.#incidentsEndpoint.getAll();}
    getMaintenanceOrders(){return this.#ordersEndpoint.getAll();}
}
