import {TestResult} from './test-result.value-object.js';
export class HardwareChannelTest {
    constructor({id=null, calibrationSessionId=null, channelType='', testResult='PASSED', markedForReview=false, testedAt=null}={}) {
        this._id=id; this._calibrationSessionId=calibrationSessionId; this._channelType=channelType;
        this._testResult=testResult instanceof TestResult ? testResult : new TestResult(testResult);
        this._markedForReview=Boolean(markedForReview); this._testedAt=testedAt ? new Date(testedAt) : null;
    }
    getId(){return this._id;} getCalibrationSessionId(){return this._calibrationSessionId;} getChannelType(){return this._channelType;}
    getTestResult(){return this._testResult;} getTestResultAsString(){return this._testResult.toString();} isMarkedForReview(){return this._markedForReview;}
    getTestedAt(){return this._testedAt;} markForReview(){this._markedForReview=true;} clearReview(){this._markedForReview=false;}
}
