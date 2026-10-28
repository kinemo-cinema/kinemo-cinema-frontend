import {LifecycleStatus} from './lifecycle-status.value-object.js';
export class HardwareComponent {
    constructor({id=null, roomId=null, componentCode='', componentType='', currentUsageCycles=0, maxLifecycleCycles=0, lifecycleStatus='WITHIN_LIMIT'}={}) {
        this._id=id; this._roomId=roomId; this._componentCode=componentCode; this._componentType=componentType;
        this._currentUsageCycles=Number(currentUsageCycles); this._maxLifecycleCycles=Number(maxLifecycleCycles);
        this._lifecycleStatus=lifecycleStatus instanceof LifecycleStatus ? lifecycleStatus : new LifecycleStatus(lifecycleStatus);
    }
    getId(){return this._id;} getRoomId(){return this._roomId;} getComponentCode(){return this._componentCode;} getComponentType(){return this._componentType;}
    getCurrentUsageCycles(){return this._currentUsageCycles;} getMaxLifecycleCycles(){return this._maxLifecycleCycles;}
    getLifecycleStatus(){return this._lifecycleStatus;} getLifecycleStatusAsString(){return this._lifecycleStatus.toString();}
    getLifecyclePercentage(){return this._maxLifecycleCycles ? (this._currentUsageCycles/this._maxLifecycleCycles)*100 : 0;}
}
