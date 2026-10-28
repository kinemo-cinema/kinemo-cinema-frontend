import {HardwareChannelTest} from '../domain/model/hardware-channel-test.entity.js';
export class HardwareChannelTestAssembler {
    static toEntityFromResource(r){return new HardwareChannelTest(r);}
    static toEntitiesFromResponse(response){ if(response.status!==200)return []; const resources=Array.isArray(response.data)?response.data:response.data.hardwareChannelTests; return resources.map(r=>this.toEntityFromResource(r)); }
    static toResourceFromEntity(e){return {id:e.getId(),calibrationSessionId:e.getCalibrationSessionId(),channelType:e.getChannelType(),testResult:e.getTestResultAsString(),markedForReview:e.isMarkedForReview(),testedAt:e.getTestedAt()?.toISOString()??null};}
}
