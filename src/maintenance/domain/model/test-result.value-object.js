export class TestResult {
    static PASSED = 'PASSED';
    static FAILED = 'FAILED';
    static LOW_PRESSURE = 'LOW_PRESSURE';
    static REQUIRES_REVIEW = 'REQUIRES_REVIEW';

    #value;

    constructor(value = TestResult.PASSED) {
        const normalized = String(value).toUpperCase();
        if (!TestResult.isValid(normalized)) {
            throw new Error(`Invalid test result: ${value}`);
        }
        this.#value = normalized;
    }

    toString() { return this.#value; }
    isPassed() { return this.#value === TestResult.PASSED; }
    static isValid(value) {
        return [TestResult.PASSED, TestResult.FAILED, TestResult.LOW_PRESSURE, TestResult.REQUIRES_REVIEW].includes(value);
    }
}
