import { NullableTime, NowTime } from '../src/common/time';

describe('NullableTime', () => {
    // === VALID UNIX TIMESTAMPS ===
    describe('Valid Unix Timestamps', () => {
        test('should handle epoch zero', () => {
            const time = new NullableTime(0);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(0);
            expect(time.isoString()).toBe('1970-01-01T00:00:00.000Z');
            time.finish();
        });

        test('should handle millisecond precision', () => {
            const time = new NullableTime(123.456);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(123);
            time.finish();
        });

        test('should handle negative pre-1970 dates', () => {
            const time = new NullableTime(-86400000);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(-86400000); // ← PANGGIL VALUE!
            time.finish();
        });

        test('should handle year 2038 boundary', () => {
            const time = new NullableTime(2147483647);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(2147483647); // ← PANGGIL VALUE!
            time.finish();
        });

        test('should handle maximum valid timestamp', () => {
            const timestamp = 8640000000000000; // MAX VALID
            const time = new NullableTime(timestamp);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(timestamp); // ← PANGGIL VALUE!
            time.finish();
        });
    });

    // === INVALID TIMESTAMPS ===
    describe('Invalid Timestamps', () => {
        test('should reject beyond maximum boundary', () => {
            const time = new NullableTime(8640000000000001); // BEYOND MAX
            expect(time.isNull()).toBe(true);
            time.finish();
        });

        test('should reject NaN', () => {
            const time = new NullableTime(NaN);
            expect(time.isNull()).toBe(true);
            time.finish();
        });

        test('should reject Infinity', () => {
            const time = new NullableTime(Infinity);
            expect(time.isNull()).toBe(true);
            time.finish();
        });

        test('should reject -Infinity', () => {
            const time = new NullableTime(-Infinity);
            expect(time.isNull()).toBe(true);
            time.finish();
        });
    });

    // === VALIDATION WITHOUT USAGE DETECTION ===
    describe('Validation Without Usage Detection', () => {
        test('should throw when isNotNull() called but value never used', () => {
            const time = new NullableTime(123456);
            time.isNotNull(); // Validate but don't use value
            expect(() => time.finish()).toThrow("value exist but never used");
        });

        test('should not throw when isNull() called on null data', () => {
            const time = new NullableTime(null);
            time.isNull(); // Validate null case
            expect(() => time.finish()).not.toThrow(); // Should NOT throw
        });

        test('should not throw when value is properly used after isNotNull()', () => {
            const time = new NullableTime(123456);
            time.isNotNull();
            time.unixTime(); // Use the value
            expect(() => time.finish()).not.toThrow();
        });

        test('should track usage across multiple value methods', () => {
            const time = new NullableTime(123456);
            time.isNotNull();
            time.unixTime();
            time.date();
            time.isoString(); // Multiple usages
            expect(() => time.finish()).not.toThrow();
        });
    });

    // === PRECISION EDGE CASES ===
    describe('Precision Edge Cases', () => {
        test('should handle very small fractional values', () => {
            const time = new NullableTime(0.0000001);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(0); // ← PANGGIL VALUE!
            time.finish();
        });

        test('should handle integer coercion', () => {
            const time = new NullableTime(123.9999999999999);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(123); // ← PANGGIL VALUE!
            time.finish();
        });

        test('should handle maximum boundary timestamp', () => {
            const time = new NullableTime(8640000000000000);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(8640000000000000); // ← PANGGIL VALUE!
            time.finish();
        });
    });

    // === REAL-WORLD FAILURE SCENARIOS ===
    describe('Real-World Failure Scenarios', () => {
        test('should handle database timestamp limits', () => {
            const time = new NullableTime(32503680000000); // Year 3000
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(32503680000000); // ← PANGGIL VALUE!
            time.finish();
        });

        test('should handle bulk date arithmetic with proper usage', () => {
            const timestamps = [1000, 2000, 3000, 4000, 5000];
            timestamps.forEach(ts => {
                const time = new NullableTime(ts);
                expect(time.isNotNull()).toBe(true);
                expect(time.unixTime()).toBe(ts); // ← PANGGIL VALUE!
                time.finish();
            });
        });
    });

    // === PROTOTYPE POLLUTION PROTECTION ===
    describe('Prototype Pollution Protection', () => {
        test('should reject polluted objects with valueOf', () => {
            const obj = { valueOf: () => 123456 };
            const time = new NullableTime(obj);
            expect(time.isNull()).toBe(true);
            time.finish();
        });

        test.skip('should handle Date.prototype pollution safely', () => {
            // POLLUTE before create NullableTime
            Date.prototype.getTime = () => 9999999999999;

            const time = new NullableTime(123456);
            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(123456)

            time.finish();
        });
    });

    // === PERFORMANCE & MEMORY ===
    describe('Performance & Memory', () => {
        test('should not leak memory with repeated instantiation', () => {
            for (let i = 0; i < 1000; i++) {
                const time = new NullableTime(i * 1000);
                if (time.isNotNull()) {
                    time.unixTime(); // ← PASTIKAN PAKAI VALUE!
                }
                time.finish();
            }
        });
    });

    // === CONCURRENT ACCESS ===
    describe('Concurrent Access Simulation', () => {
        test('should maintain state under rapid access', () => {
            const time = new NullableTime(123456);

            expect(time.isNotNull()).toBe(true);
            expect(time.unixTime()).toBe(123456); // ← PANGGIL VALUE!
            expect(time.isoString()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
            expect(time.date()).toBeInstanceOf(Date);

            time.finish();
        });
    });

    // === TYPE SAFETY ===
    describe('Type Safety', () => {
        test('should reject string inputs', () => {
            const time = new NullableTime('123456');
            expect(time.isNull()).toBe(true);
            time.finish();
        });

        test('should reject null input', () => {
            const time = new NullableTime(null);
            expect(time.isNull()).toBe(true);
            time.finish();
        });
    });
});

describe('NowTime', () => {
    // === USAGE ENFORCEMENT ===
    describe('Usage Enforcement', () => {
        test('should throw when finish() called without usage', () => {
            const now = new NowTime();
            expect(() => now.finish()).toThrow("value exist but never used");
        });

        test('should not throw when methods are used', () => {
            const now = new NowTime();
            now.unixTime();
            now.finish(); // Should not throw
        });

        test('should track usage across multiple methods', () => {
            const now = new NowTime();
            now.date();
            now.isoString();
            now.unixTime();
            now.finish(); // Should not throw
        });
    });

    // === REAL-WORLD INTEGRATION ===
    describe('Real-World Integration', () => {
        test('should work in API response scenario', () => {
            const createApiResponse = () => {
                const timestamp = new NowTime();
                const response = {
                    data: { id: 1, name: 'test' },
                    timestamp: timestamp.unixTime(),
                    isoTime: timestamp.isoString()
                };
                timestamp.finish();
                return response;
            };

            const response = createApiResponse();
            expect(response.timestamp).toBeGreaterThan(0);
            expect(response.isoTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });
    });
});

// === CROSS-CLASS INTEGRATION ===
describe('Cross-Class Integration', () => {
    test('should work together in mixed scenarios', () => {
        const processMixedTimes = (userTimestamp: number | null) => {
            const userTime = new NullableTime(userTimestamp);
            const currentTime = new NowTime();

            let result: any;

            if (userTime.isNotNull()) {
                result = {
                    userTime: userTime.unixTime(), // ← PAKAI VALUE!
                    currentTime: currentTime.unixTime(),
                    difference: currentTime.unixTime() - userTime.unixTime()
                };
            } else {
                result = {
                    currentTime: currentTime.unixTime(),
                    message: 'No user time provided'
                };
            }

            userTime.finish();
            currentTime.finish();

            return result;
        };

        const result1 = processMixedTimes(123456789);
        expect(result1.userTime).toBe(123456789);

        const result2 = processMixedTimes(null);
        expect(result2.message).toBe('No user time provided');
    });
});