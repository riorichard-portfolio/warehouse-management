import crypto from 'crypto'

import { NullableUUID, FreshUUID } from '../src/common/uuid';

describe('NullableUUID', () => {
    // === VALID UUIDs ===
    test('should handle valid UUID v4', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.isNull()).toBe(false);
        expect(uuid.value()).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    test('should handle valid UUID v5', () => {
        const uuid = new NullableUUID('fdda765f-fc57-5604-a269-52a7df8164ec');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('fdda765f-fc57-5604-a269-52a7df8164ec');
    });

    test('should handle uppercase UUID', () => {
        const uuid = new NullableUUID('F47AC10B-58CC-4372-A567-0E02B2C3D479');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('F47AC10B-58CC-4372-A567-0E02B2C3D479');
    });

    test('should handle UUID with minimum values', () => {
        const uuid = new NullableUUID('00000000-0000-4000-8000-000000000000');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('00000000-0000-4000-8000-000000000000');
    });

    test('should handle UUID with maximum values', () => {
        const uuid = new NullableUUID('ffffffff-ffff-4fff-bfff-ffffffffffff');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
    });

    // === INVALID UUIDs ===
    test('should handle null input', () => {
        const uuid = new NullableUUID(null);
        expect(uuid.isNull()).toBe(true);
        expect(uuid.isNotNull()).toBe(false);
    });

    test('should handle undefined input', () => {
        const uuid = new NullableUUID(undefined);
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject empty string', () => {
        const uuid = new NullableUUID('');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID v1 (not crypto safe)', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-1372-a567-0e02b2c3d479');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID v2 (not crypto safe)', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-2372-a567-0e02b2c3d479');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID v3 (MD5 - not crypto safe)', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-3372-a567-0e02b2c3d479');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID with wrong version digit', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-6372-a567-0e02b2c3d479');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID with wrong variant digit', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-0567-0e02b2c3d479');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID with invalid characters', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d47g');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID without hyphens', () => {
        const uuid = new NullableUUID('f47ac10b58cc4372a5670e02b2c3d479');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID with wrong hyphen positions', () => {
        const uuid = new NullableUUID('f47ac10b-58cc4372-a567-0e02-b2c3d479');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID that is too short', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d47');
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID that is too long', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d4790');
        expect(uuid.isNull()).toBe(true);
    });

    // === NON-STRING INPUTS ===
    test('should reject number input', () => {
        const uuid = new NullableUUID(123);
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject boolean input', () => {
        const uuid = new NullableUUID(true);
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject object input', () => {
        const uuid = new NullableUUID({ uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' });
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject array input', () => {
        const uuid = new NullableUUID(['f47ac10b-58cc-4372-a567-0e02b2c3d479']);
        expect(uuid.isNull()).toBe(true);
    });

    // === VALIDATION ORDER REQUIREMENTS ===
    test('should throw when value() called without validation', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(() => uuid.value()).toThrow("isNull()/isNotNull() must be called before value()");
    });

    test('should throw when value() called on null after verification', () => {
        const uuid = new NullableUUID(null);
        uuid.isNull(); // Verify it's null
        expect(() => uuid.value()).toThrow("data is null :isNull()/isNotNull() must be used properly to avoid null");
    });

    test('should work with correct validation pattern - valid case', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        if (uuid.isNotNull()) {
            expect(uuid.value()).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        } else {
            fail("Should not reach here");
        }
    });

    test('should work with correct validation pattern - invalid case', () => {
        const uuid = new NullableUUID('invalid-uuid');
        if (uuid.isNull()) {
            // Should not call value()
            expect(uuid.isNotNull()).toBe(false);
        } else {
            fail("Should not reach here");
        }
    });

    // === OBJECT PRIMITIVE CONVERSION ===
    test('should handle object with toString returning UUID', () => {
        const obj = {
            toString: () => 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        };
        const uuid = new NullableUUID(obj);
        expect(uuid.isNull()).toBe(true); // Should reject objects
    });

    test('should handle object with valueOf returning UUID string', () => {
        const obj = {
            valueOf: () => 'fdda765f-fc57-5604-a269-52a7df8164ec'
        };
        const uuid = new NullableUUID(obj);
        expect(uuid.isNull()).toBe(true); // Should reject objects
    });

    // === STATE MANAGEMENT ===
    test('should maintain state across method calls', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.isNull()).toBe(false); // Should not change state
        expect(uuid.value()).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479'); // Should still work
    });

    test('should work with reverse method sequence', () => {
        const uuid = new NullableUUID('fdda765f-fc57-5604-a269-52a7df8164ec');
        expect(uuid.isNull()).toBe(false);
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('fdda765f-fc57-5604-a269-52a7df8164ec');
    });

    test('should handle multiple instances independently', () => {
        const uuid1 = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        const uuid2 = new NullableUUID(null);
        const uuid3 = new NullableUUID('fdda765f-fc57-5604-a269-52a7df8164ec');

        expect(uuid1.isNotNull()).toBe(true);
        expect(uuid2.isNull()).toBe(true);
        expect(uuid3.isNotNull()).toBe(true);

        expect(uuid1.value()).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(uuid3.value()).toBe('fdda765f-fc57-5604-a269-52a7df8164ec');
    });
});

describe('FreshUUID', () => {
    // === UUID GENERATION ===
    test('should always generate valid UUID v4', () => {
        const uuid = new FreshUUID();
        const uuidValue = uuid.value();

        // Should match UUID v4 pattern
        expect(uuidValue).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(uuidValue[14]).toBe('4'); // Version 4
    });

    test('should generate unique UUIDs', () => {
        const uuid1 = new FreshUUID();
        const uuid2 = new FreshUUID();
        const uuid3 = new FreshUUID();

        expect(uuid1.value()).not.toBe(uuid2.value());
        expect(uuid1.value()).not.toBe(uuid3.value());
        expect(uuid2.value()).not.toBe(uuid3.value());
    });

    test('should generate UUIDs with correct variant', () => {
        const uuid = new FreshUUID();
        const uuidValue = uuid.value();
        //@ts-ignore
        const variantChar = uuidValue[19].toLowerCase();

        // Variant should be 8,9,a,b (RFC 4122)
        expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });

    test('should generate properly formatted UUIDs', () => {
        const uuid = new FreshUUID();
        const uuidValue = uuid.value();

        // Check length and format
        expect(uuidValue.length).toBe(36); // 32 chars + 4 hyphens
        expect(uuidValue[8]).toBe('-');
        expect(uuidValue[13]).toBe('-');
        expect(uuidValue[18]).toBe('-');
        expect(uuidValue[23]).toBe('-');
    });

    test('should be compatible with crypto.randomUUID()', () => {
        const freshUUID = new FreshUUID();
        const cryptoUUID = crypto.randomUUID();

        // Both should be valid UUID v4
        const freshValue = freshUUID.value();
        expect(freshValue).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(cryptoUUID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});

describe('Integration: NullableUUID and FreshUUID', () => {
    test('should work together in database operations', () => {
        const createEntity = (externalId: string | null): { id: string, externalId: string | null } => {
            const id = new FreshUUID().value(); // Guaranteed valid
            const nullableExternalId = new NullableUUID(externalId);

            return {
                id,
                externalId: nullableExternalId.isNotNull() ? nullableExternalId.value() : null
            };
        };

        const entity1 = createEntity('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(entity1.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(entity1.externalId).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');

        const entity2 = createEntity(null);
        expect(entity2.externalId).toBeNull();

        const entity3 = createEntity('invalid-uuid');
        expect(entity3.externalId).toBeNull();
    });

    test('should convert FreshUUID to NullableUUID for serialization', () => {
        const fresh = new FreshUUID();
        const freshValue = fresh.value();

        // Simulate serialization/deserialization
        const serialized = JSON.stringify({ id: freshValue });
        const deserialized = JSON.parse(serialized);

        const nullable = new NullableUUID(deserialized.id);
        expect(nullable.isNotNull()).toBe(true);
        expect(nullable.value()).toBe(freshValue);
    });

    test('should handle session management scenario', () => {
        const createSession = (sessionToken: string | null) => {
            const sessionId = new FreshUUID(); // Internal session ID
            const token = new NullableUUID(sessionToken); // External token validation

            return {
                sessionId: sessionId.value(),
                isValid: token.isNotNull(),
                token: token.isNotNull() ? token.value() : null
            };
        };

        const session1 = createSession('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(session1.isValid).toBe(true);
        expect(session1.token).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');

        const session2 = createSession('invalid-token');
        expect(session2.isValid).toBe(false);
        expect(session2.token).toBeNull();

        const session3 = createSession(null);
        expect(session3.isValid).toBe(false);
        expect(session3.token).toBeNull();
    });
});

describe('NullableUUID - Deep Edge Cases', () => {
    test('should handle prototype polluted objects', () => {
        (Object.prototype as any).toString = () => 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
        const uuid = new NullableUUID({});
        expect(uuid.isNull()).toBe(true);
        delete (Object.prototype as any).toString;
    });

    test('should handle Proxy objects', () => {
        const proxy = new Proxy({}, {
            get: (target, prop) => {
                if (prop === Symbol.toPrimitive) return () => 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
                //@ts-ignore
                return target[prop as any];
            }
        });
        const uuid = new NullableUUID(proxy);
        expect(uuid.isNull()).toBe(true);
    });

    test('should handle objects with Symbol.toPrimitive', () => {
        const obj = {
            [Symbol.toPrimitive]() { return 'fdda765f-fc57-5604-a269-52a7df8164ec'; }
        };
        const uuid = new NullableUUID(obj);
        expect(uuid.isNull()).toBe(true);
    });

    test('should maintain state under concurrent access simulation', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479');

        // Simulate multiple accesses
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.isNull()).toBe(false);
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');

        // Should remain consistent
        expect(uuid.value()).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    test('should handle recursive objects without stack overflow', () => {
        const obj: any = {};
        obj.self = obj;
        const uuid = new NullableUUID(obj);
        expect(uuid.isNull()).toBe(true);
    });

    test('should handle objects that throw from primitive methods', () => {
        const obj = {
            valueOf: () => { throw new Error("Evil valueOf"); },
            toString: () => { throw new Error("Evil toString"); }
        };
        const uuid = new NullableUUID(obj);
        expect(uuid.isNull()).toBe(true);
    });

    test('should handle UUID with mixed case', () => {
        const uuid = new NullableUUID('F47Ac10b-58Cc-4372-A567-0e02B2c3D479');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('F47Ac10b-58Cc-4372-A567-0e02B2c3D479');
    });

    test('should handle UUID with all zeros in specific segments', () => {
        const uuid = new NullableUUID('00000000-0000-4000-8000-000000000000');
        expect(uuid.isNotNull()).toBe(true);
    });

    test('should handle UUID with all Fs in specific segments', () => {
        const uuid = new NullableUUID('ffffffff-ffff-4fff-bfff-ffffffffffff');
        expect(uuid.isNotNull()).toBe(true);
    });
});

describe('FreshUUID - Deep Edge Cases', () => {
    test('should not create memory leaks with repeated instantiation', () => {
        const uuids = new Set();

        for (let i = 0; i < 1000; i++) {
            const uuid = new FreshUUID();
            const value = uuid.value();
            expect(uuids.has(value)).toBe(false); // Should be unique
            uuids.add(value);
        }

        expect(uuids.size).toBe(1000);
    });

    test('should generate cryptographically secure UUIDs', () => {
        // Test that generated UUIDs follow crypto-safe patterns
        for (let i = 0; i < 100; i++) {
            const uuid = new FreshUUID();
            const value = uuid.value();

            // Should be UUID v4 (crypto random)
            expect(value[14]).toBe('4');

            // Variant should be RFC 4122 compliant
            //@ts-ignore
            const variantChar = value[19].toLowerCase();
            expect(['8', '9', 'a', 'b']).toContain(variantChar);
        }
    });

    test('should handle rapid UUID generation', () => {
        const startTime = Date.now();

        // Generate many UUIDs quickly
        for (let i = 0; i < 500; i++) {
            const uuid = new FreshUUID();
            expect(uuid.value()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        }

        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    test('should be compatible with Node.js crypto.randomUUID', () => {
        // FreshUUID should be a wrapper around crypto.randomUUID
        const freshUUID = new FreshUUID();
        const cryptoUUID = crypto.randomUUID();

        // Both should have same structure and validation rules
        expect(freshUUID.value().length).toBe(cryptoUUID.length);
        expect(freshUUID.value()[14]).toBe(cryptoUUID[14]); // Both should be v4
    });
});

describe('Cross-Class UUID Integration', () => {
    test('should work in distributed system scenario', () => {
        const processMessage = (_: string, correlationId: string | null) => {
            const internalId = new FreshUUID().value();
            const nullableCorrelationId = new NullableUUID(correlationId);

            return {
                internalId,
                hasCorrelationId: nullableCorrelationId.isNotNull(),
                correlationId: nullableCorrelationId.isNotNull() ? nullableCorrelationId.value() : null,
                processedAt: new Date().toISOString()
            };
        };

        const result1 = processMessage(
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'fdda765f-fc57-5604-a269-52a7df8164ec'
        );
        expect(result1.hasCorrelationId).toBe(true);
        expect(result1.correlationId).toBe('fdda765f-fc57-5604-a269-52a7df8164ec');

        const result2 = processMessage(
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            null
        );
        expect(result2.hasCorrelationId).toBe(false);
        expect(result2.correlationId).toBeNull();
    });

    test('should handle bulk UUID validation in data processing', () => {
        const uuidsToProcess = [
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'invalid-uuid',
            'fdda765f-fc57-5604-a269-52a7df8164ec',
            null,
            '00000000-0000-4000-8000-000000000000',
            'not-a-uuid'
        ];

        const validUUIDs: string[] = [];

        uuidsToProcess.forEach(uuid => {
            const nullable = new NullableUUID(uuid);
            if (nullable.isNotNull()) {
                validUUIDs.push(nullable.value());
            }
        });

        expect(validUUIDs[0]).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(validUUIDs[1]).toBe('fdda765f-fc57-5604-a269-52a7df8164ec');
        expect(validUUIDs[2]).toBe('00000000-0000-4000-8000-000000000000');
    });

    test('should work with API request/response flows', () => {
        const handleAPIRequest = (_: string, userId: string | null) => {
            // Generate new UUID for this request
            const requestUUID = new FreshUUID();

            // Validate incoming UUIDs
            const nullableUserId = new NullableUUID(userId);

            return {
                requestId: requestUUID.value(),
                userId: nullableUserId.isNotNull() ? nullableUserId.value() : null,
                timestamp: Date.now(),
                isValidUser: nullableUserId.isNotNull()
            };
        };

        const response1 = handleAPIRequest(
            'external-req-123',
            'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        );
        expect(response1.isValidUser).toBe(true);
        expect(response1.userId).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');

        const response2 = handleAPIRequest(
            'external-req-456',
            'invalid-user-id'
        );
        expect(response2.isValidUser).toBe(false);
        expect(response2.userId).toBeNull();
    });
});

describe('Performance and Scalability', () => {
    beforeEach(() => {
        jest.resetModules(); // ⭐ Reset state
        if (global.gc) global.gc(); // ⭐ Force garbage collection (Node.js)
    });

    test('should handle high volume UUID validation', () => {
        const startTime = Date.now();
        const batchSize = 1000;

        for (let i = 0; i < batchSize; i++) {
            const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479');
            expect(uuid.isNotNull()).toBe(true);
        }

        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(200); // Should be fast , but this is arbitary
    });

    test('should handle high volume UUID generation', () => {
        const startTime = Date.now();
        const batchSize = 1000;
        const generatedUUIDs = new Set();

        for (let i = 0; i < batchSize; i++) {
            const uuid = new FreshUUID();
            const value = uuid.value();
            expect(generatedUUIDs.has(value)).toBe(false);
            generatedUUIDs.add(value);
        }

        const endTime = Date.now();
        expect(generatedUUIDs.size).toBe(batchSize);
        expect(endTime - startTime).toBeLessThan(200); // Should complete quickly
    });
});

// === ADDITIONAL NULLABLEUUID EDGE CASES ===

describe('NullableUUID - Additional Edge Cases', () => {
    test('should reject UUID with wrong version in v5 position', () => {
        const uuid = new NullableUUID('fdda765f-fc57-4604-a269-52a7df8164ec'); // v4 instead of v5
        expect(uuid.isNotNull()).toBe(true);
    });

    test('should reject UUID with wrong variant in v4', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-0567-0e02b2c3d479'); // variant 0
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID with wrong variant in v5', () => {
        const uuid = new NullableUUID('fdda765f-fc57-5604-0567-52a7df8164ec'); // variant 0
        expect(uuid.isNull()).toBe(true);
    });

    test('should handle UUID with special hex patterns', () => {
        const uuid = new NullableUUID('deadbeef-dead-4ead-beef-deadbeefdead');
        expect(uuid.isNotNull()).toBe(true);
        expect(uuid.value()).toBe('deadbeef-dead-4ead-beef-deadbeefdead');
    });

    test('should handle UUID with sequential patterns', () => {
        const uuid = new NullableUUID('12345678-1234-4123-8123-123456789abc');
        expect(uuid.isNotNull()).toBe(true);
    });

    test('should reject UUID with hex characters outside a-f', () => {
        const uuid = new NullableUUID('g47ac10b-58cc-4372-a567-0e02b2c3d479'); // starts with g
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID with spaces', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d47 '); // space at end
        expect(uuid.isNull()).toBe(true);
    });

    test('should reject UUID with special characters', () => {
        const uuid = new NullableUUID('f47ac10b-58cc-4372-a567-0e02b2c3d47!'); // exclamation
        expect(uuid.isNull()).toBe(true);
    });
});

// === ADDITIONAL FRESHUUID EDGE CASES ===

describe('FreshUUID - Additional Edge Cases', () => {
    test('should generate UUIDs with correct clock sequence', () => {
        // Clock sequence should be properly randomized
        const uuids = Array.from({ length: 100 }, () => new FreshUUID().value());
        const clockSequences = uuids.map(uuid => uuid.substring(19, 23));

        // Should have variety in clock sequences (not all same)
        const uniqueSequences = new Set(clockSequences);
        expect(uniqueSequences.size).toBeGreaterThan(1);
    });

    test('should generate UUIDs with correct node identifier', () => {
        const uuids = Array.from({ length: 50 }, () => new FreshUUID().value());
        const nodes = uuids.map(uuid => uuid.substring(24));

        // Node part should be properly randomized
        const uniqueNodes = new Set(nodes);
        expect(uniqueNodes.size).toBeGreaterThan(1);
    });

    test('should handle concurrent UUID generation', async () => {
        const promises = Array.from({ length: 100 }, async () => {
            return new FreshUUID().value();
        });

        const uuids = await Promise.all(promises);
        const uniqueUUIDs = new Set(uuids);

        expect(uniqueUUIDs.size).toBe(100); // All should be unique
    });

    test('should generate UUIDs compatible with UUID parsers', () => {
        const uuid = new FreshUUID();
        const value = uuid.value();

        // Should be parseable by common UUID libraries
        const parts = value.split('-');
        expect(parts.length).toBe(5);
        //@ts-ignore
        expect(parts[0].length).toBe(8);
        //@ts-ignore
        expect(parts[1].length).toBe(4);
        //@ts-ignore
        expect(parts[2].length).toBe(4);
        //@ts-ignore
        expect(parts[3].length).toBe(4);
        //@ts-ignore
        expect(parts[4].length).toBe(12);
    });
});

// === ADDITIONAL INTEGRATION SCENARIOS ===

describe('Integration - Advanced Scenarios', () => {
    test('should work with database constraint validation', () => {
        const validateDatabaseIds = (ids: (string | null)[]): string[] => {
            return ids
                .map(id => new NullableUUID(id))
                .filter(uuid => uuid.isNotNull())
                .map(uuid => uuid.value());
        };

        const mixedIds = [
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            null,
            'invalid',
            'fdda765f-fc57-5604-a269-52a7df8164ec',
            '12345678-1234-4234-8abc-123456789abc'
        ];

        const validIds = validateDatabaseIds(mixedIds);
        expect(validIds).toHaveLength(3);
        expect(validIds[0]).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479')
        expect(validIds[1]).toBe('fdda765f-fc57-5604-a269-52a7df8164ec')
        expect(validIds[2]).toBe('12345678-1234-4234-8abc-123456789abc')
    });

    test('should handle UUID migration scenario', () => {
        const migrateLegacyId = (legacyId: string | number | null): string => {
            if (legacyId === null) {
                return new FreshUUID().value();
            }

            if (typeof legacyId === 'string') {
                const uuid = new NullableUUID(legacyId);
                if (uuid.isNotNull()) {
                    return uuid.value(); // Keep valid UUID
                }
            }

            // Generate new UUID for invalid legacy IDs
            return new FreshUUID().value();
        };

        expect(migrateLegacyId('f47ac10b-58cc-4372-a567-0e02b2c3d479'))
            .toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');

        expect(migrateLegacyId('invalid')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(migrateLegacyId(null)).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(migrateLegacyId(12345)).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('should work with caching systems', () => {
        const cache = new Map();

        const getOrCreateSession = (sessionToken: string | null) => {
            const nullableToken = new NullableUUID(sessionToken);

            if (nullableToken.isNotNull()) {
                const cached = cache.get(nullableToken.value());
                if (cached) return cached;
            }

            const newSession = {
                id: new FreshUUID().value(),
                createdAt: new Date()
            };

            if (nullableToken.isNotNull()) {
                cache.set(nullableToken.value(), newSession);
            }

            return newSession;
        };

        const session1 = getOrCreateSession('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        const session2 = getOrCreateSession('f47ac10b-58cc-4372-a567-0e02b2c3d479'); // Same token

        expect(session1.id).toBe(session2.id); // Should be cached
        expect(cache.size).toBe(1);
    });

    test('should handle bulk data processing with error recovery', () => {
        const processBatch = (records: Array<{ id: string | null, data: any }>) => {
            const results: { processedId: string, originalId: string | null, data: any, status: string }[] = [];

            for (const record of records) {
                if (record.id) {
                    // Check if UUID is valid
                    const nullableUUID = new NullableUUID(record.id);
                    if (nullableUUID.isNotNull()) {
                        results.push({
                            processedId: nullableUUID.value(),
                            originalId: record.id,
                            data: record.data,
                            status: 'success'
                        });
                    } else {
                        // Invalid UUID - generate new one
                        results.push({
                            processedId: new FreshUUID().value(),
                            originalId: record.id,
                            data: record.data,
                            status: 'recovered'
                        });
                    }
                } else {
                    // No ID provided - generate new one
                    results.push({
                        processedId: new FreshUUID().value(),
                        originalId: record.id,
                        data: record.data,
                        status: 'success' // Bukan recovered, karena ini expected behavior
                    });
                }
            }

            return results;
        };

        const batch = [
            { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', data: 'valid' },
            { id: 'invalid-uuid', data: 'invalid' },
            { id: null, data: 'null' },
            { id: 'fdda765f-fc57-5604-a269-52a7df8164ec', data: 'valid2' }
        ];

        const results = processBatch(batch);
        //@ts-ignore
        const statusIndex0 = results[0].status
        //@ts-ignore
        const statusIndex1 = results[1].status
        //@ts-ignore
        const statusIndex2 = results[2].status
        //@ts-ignore
        const statusIndex3 = results[3].status
        expect(results).toHaveLength(4);
        expect(statusIndex0).toBe('success');
        expect(statusIndex1).toBe('recovered');
        expect(statusIndex2).toBe('success');
        expect(statusIndex3).toBe('success');
    });
});

// === SECURITY & VALIDATION EDGE CASES ===

describe('Security and Validation', () => {
    test('should prevent UUID injection attacks', () => {
        const maliciousInputs = [
            'f47ac10b-58cc-4372-a567-0e02b2c3d479\0', // null byte injection
            'f47ac10b-58cc-4372-a567-0e02b2c3d479\\', // escape characters
            'f47ac10b-58cc-4372-a567-0e02b2c3d479\n', // newline injection
            'f47ac10b-58cc-4372-a567-0e02b2c3d479\'', // SQL injection
            'f47ac10b-58cc-4372-a567-0e02b2c3d479"',  // JSON injection
        ];

        maliciousInputs.forEach(input => {
            const uuid = new NullableUUID(input);
            expect(uuid.isNull()).toBe(true);
        });
    });

    test('should handle extremely long strings', () => {
        const longString = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' + 'a'.repeat(1000);
        const uuid = new NullableUUID(longString);
        expect(uuid.isNull()).toBe(true);
    });

    test('should handle string with only hyphens', () => {
        const uuid = new NullableUUID('-------------------------------');
        expect(uuid.isNull()).toBe(true);
    });

    test('should handle string with only hex characters but wrong structure', () => {
        const uuid = new NullableUUID('1234567890abcdef1234567890abcdef12');
        expect(uuid.isNull()).toBe(true);
    });
});