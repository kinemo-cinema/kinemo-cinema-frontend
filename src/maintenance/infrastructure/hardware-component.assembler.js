    import {HardwareComponent} from '../domain/model/hardware-component.entity.js';
export class HardwareComponentAssembler {
    static toEntityFromResource(r){return new HardwareComponent(r);}
    static toEntitiesFromResponse(response){ if(response.status!==200)return []; const resources=Array.isArray(response.data)?response.data:response.data.hardwareComponents; return resources.map(r=>this.toEntityFromResource(r)); }
    static toResourceFromEntity(e){return {id:e.getId(),roomId:e.getRoomId(),componentCode:e.getComponentCode(),componentType:e.getComponentType(),currentUsageCycles:e.getCurrentUsageCycles(),maxLifecycleCycles:e.getMaxLifecycleCycles(),lifecycleStatus:e.getLifecycleStatusAsString()};}
}
