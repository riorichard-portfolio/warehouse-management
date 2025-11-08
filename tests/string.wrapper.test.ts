import { NullableString, NotNullString } from '../src/common/string.wrapper';
import { Str, OptStr } from '../src/common/primitive.abstractions/primitive.wrapper.abstraction'

describe('NullableString', () => {
    // === VALID CASES ===
    test('should handle valid string', () => {
        const str = new NullableString("hello");
        expect(str.isNull()).toBe(false);
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value()).toBe("hello");
        }
    });

    test('should handle empty string', () => {
        const str = new NullableString("");
        expect(str.isNull()).toBe(false);
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value()).toBe("");
        }
    });

    // === NULL/UNDEFINED CASES ===
    test('should handle null input', () => {
        const str = new NullableString(null);
        expect(str.isNull()).toBe(true);
        expect(str.isNotNull()).toBe(false);
    });

    test('should handle undefined input', () => {
        const str = new NullableString(undefined);
        expect(str.isNull()).toBe(true);
        expect(str.isNotNull()).toBe(false);
    });

    // === NON-STRING TYPES ===
    test('should reject number input', () => {
        const str = new NullableString(123);
        expect(str.isNull()).toBe(true);
        expect(str.isNotNull()).toBe(false);
    });

    test('should reject boolean input', () => {
        const str = new NullableString(true);
        expect(str.isNull()).toBe(true);
        expect(str.isNotNull()).toBe(false);
    });

    test('should reject object input', () => {
        const str = new NullableString({ key: "value" });
        expect(str.isNull()).toBe(true);
        expect(str.isNotNull()).toBe(false);
    });

    test('should reject array input', () => {
        const str = new NullableString(["hello"]);
        expect(str.isNull()).toBe(true);
        expect(str.isNotNull()).toBe(false);
    });

    // === DEVELOPER MISTAKES ===
    test('should throw when value() called without validation', () => {
        const str = new NullableString("test");
        expect(() => str.value()).toThrow("isNull() must be called before value()");
    });

    test('should throw when value() called on null after verification', () => {
        const str = new NullableString(null);
        str.isNull(); // Verify it's null
        expect(() => str.value()).toThrow("data is null :isNull()/isNotNull() must be used properly to avoid null");
    });

    // === CORRECT USAGE PATTERNS ===
    test('should work with correct validation pattern', () => {
        const str = new NullableString("world");
        if (str.isNotNull()) {
            expect(str.value()).toBe("world");
        }
    });

    test('should correctly handle null case', () => {
        const str = new NullableString(null);
        if (str.isNotNull()) {
            fail("This should not execute");
        } else {
            // Correctly handled null case
            expect(true).toBe(true);
        }
    });

    // === DANGEROUS/INJECTION DATA ===
    test('should handle object with toString', () => {
        const obj = { toString: () => "test" };
        const str = new NullableString(obj);
        expect(str.isNull()).toBe(true); // Should still reject
    });

    test('should handle object with evil toString', () => {
        const evilObj = {
            toString: () => { throw new Error("Evil toString") }
        };
        const str = new NullableString(evilObj);
        expect(str.isNull()).toBe(true);
    });

    test('should handle Symbol', () => {
        const str = new NullableString(Symbol("test"));
        expect(str.isNull()).toBe(true);
    });

    test('should handle Function', () => {
        const str = new NullableString(() => "hello");
        expect(str.isNull()).toBe(true);
    });

    // === METHOD SEQUENCE INTEGRITY ===
    test('should maintain state across method calls', () => {
        const str = new NullableString("sequence");
        expect(str.isNull()).toBe(false);
        expect(str.isNotNull()).toBe(true);
        expect(str.value()).toBe("sequence");
    });

    test('should work with reverse method sequence', () => {
        const str = new NullableString("reverse");
        expect(str.isNotNull()).toBe(true);
        expect(str.isNull()).toBe(false);
        expect(str.value()).toBe("reverse");
    });

    // === MULTIPLE INSTANCES ===
    test('should handle multiple instances independently', () => {
        const str1 = new NullableString("first");
        const str2 = new NullableString(null);
        const str3 = new NullableString("third");

        expect(str1.isNotNull()).toBe(true);
        expect(str2.isNotNull()).toBe(false);
        expect(str3.isNotNull()).toBe(true);
    });

    // === SPECIAL CHARACTERS ===
    test('should handle special characters', () => {
        const special = "hello\nworld\t!";
        const str = new NullableString(special);
        if (str.isNotNull()) {
            expect(str.value()).toBe(special);
        }
    });

    // === CONSTRUCTOR RESILIENCE ===
    test('should survive constructor exceptions', () => {
        const str = new NullableString({
            valueOf: () => { throw new Error("Evil") }
        });
        expect(str.isNull()).toBe(true);
    });
});

describe('NotNullString', () => {
    // === VALID CASES ===
    test('should handle valid string', () => {
        const str = new NotNullString("hello");
        expect(str.value()).toBe("hello");
    });

    test('should handle empty string', () => {
        const str = new NotNullString("");
        expect(str.value()).toBe("");
    });

    // === INVALID CASES ===
    test('should throw on null input', () => {
        expect(() => new NotNullString(null!)).toThrow("value in NotNullString MUST be string");
    });

    test('should throw on undefined input', () => {
        expect(() => new NotNullString(undefined!)).toThrow("value in NotNullString MUST be string");
    });

    test('should throw on number input', () => {
        expect(() => new NotNullString(123 as any)).toThrow("value in NotNullString MUST be string");
    });

    test('should throw on boolean input', () => {
        expect(() => new NotNullString(true as any)).toThrow("value in NotNullString MUST be string");
    });

    test('should throw on object input', () => {
        expect(() => new NotNullString({} as any)).toThrow("value in NotNullString MUST be string");
    });

    // === DANGEROUS INPUTS ===
    test('should throw on Symbol input', () => {
        expect(() => new NotNullString(Symbol() as any)).toThrow("value in NotNullString MUST be string");
    });

    test('should throw on Function input', () => {
        expect(() => new NotNullString((() => { }) as any)).toThrow("value in NotNullString MUST be string");
    });

    // === EDGE CASES ===
    test('should handle very long string', () => {
        const longStr = "a".repeat(10000);
        const str = new NotNullString(longStr);
        expect(str.value()).toBe(longStr);
    });

    test('should handle string with emojis', () => {
        const emojiStr = "Hello 🚀 World 🌍";
        const str = new NotNullString(emojiStr);
        expect(str.value()).toBe(emojiStr);
    });
});

// === INTEGRATION TESTS ===
describe('Integration: NullableString and NotNullString', () => {
    test('should work together in function parameters', () => {
        function processStrings(required: Str, optional: OptStr) {
            const requiredValue = required.value();
            let optionalValue: string | null = null;

            if (optional.isNotNull()) {
                optionalValue = optional.value();
            }

            return { requiredValue, optionalValue };
        }

        const result = processStrings(
            new NotNullString("required"),
            new NullableString("optional")
        );

        expect(result.requiredValue).toBe("required");
        expect(result.optionalValue).toBe("optional");
    });

    test('should handle null optional in integration', () => {
        function processStrings(required: Str, optional: OptStr) {
            const requiredValue = required.value();
            let optionalValue: string | null = null;

            if (optional.isNotNull()) {
                optionalValue = optional.value();
            }

            return { requiredValue, optionalValue };
        }

        const result = processStrings(
            new NotNullString("required"),
            new NullableString(null)
        );

        expect(result.requiredValue).toBe("required");
        expect(result.optionalValue).toBe(null);
    });
});

describe('NullableString - Deep Edge Cases', () => {
    // === PROTOTYPE POLLUTION ===
    test('should handle prototype polluted objects', () => {
        // Test null prototype
        const nullProto = Object.create(null);
        const str1 = new NullableString(nullProto);
        expect(str1.isNull()).toBe(true);

        // Test manipulated prototype
        const manipulated = {};
        manipulated.toString = () => "hacked";
        const str2 = new NullableString(manipulated);
        expect(str2.isNull()).toBe(true); // Should still reject objects

        // Restore prototype after test
        delete (manipulated as any).toString;
    });

    test('should handle global prototype pollution', () => {
        const originalToString = Object.prototype.toString;

        // Temporarily pollute global prototype
        Object.prototype.toString = () => "global pollution";

        try {
            const str = new NullableString({});
            expect(str.isNull()).toBe(true); // Should reject despite pollution
        } finally {
            // Always restore
            Object.prototype.toString = originalToString;
        }
    });

    // === EXOTIC OBJECTS ===
    test('should handle Proxy objects', () => {
        const proxy = new Proxy({}, {
            get: (target, prop) => {
                if (prop === Symbol.toPrimitive) return () => "proxy value";
                //@ts-ignore
                return target[prop];
            }
        });

        const str = new NullableString(proxy);
        expect(str.isNull()).toBe(true); // Should reject Proxy
    });

    test('should handle objects with Symbol.toPrimitive', () => {
        const primitiveObj = {
            [Symbol.toPrimitive]() { return "primitive value"; }
        };

        const str = new NullableString(primitiveObj);
        expect(str.isNull()).toBe(true); // Should reject objects
    });

    test('should handle objects with valueOf override', () => {
        const valueOfObj = {
            valueOf: () => "valueOf result"
        };

        const str = new NullableString(valueOfObj);
        expect(str.isNull()).toBe(true);
    });

    // === UNICODE & SPECIAL CHARACTERS ===
    test('should handle null character', () => {
        const str = new NullableString("\0");
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value()).toBe("\0");
        }
    });

    test('should handle escape characters', () => {
        const escapes = "\\\"\'\n\r\t\b\f";
        const str = new NullableString(escapes);
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value()).toBe(escapes);
        }
    });

    test('should handle Unicode astral planes', () => {
        const astral = "Hello \u{1F4A9} World \u{1F680}";
        const str = new NullableString(astral);
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value()).toBe(astral);
        }
    });

    test('should handle invalid UTF-16 sequences', () => {
        const invalidUTF16 = String.fromCharCode(55296); // Lone surrogate
        const str = new NullableString(invalidUTF16);
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value()).toBe(invalidUTF16);
        }
    });

    test('should handle zero-width characters', () => {
        const zeroWidth = "hello\u200Bworld";
        const str = new NullableString(zeroWidth);
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value()).toBe(zeroWidth);
        }
    });

    // === MEMORY & PERFORMANCE ===
    test('should handle very large strings', () => {
        const largeStr = "a".repeat(10 * 1024 * 1024); // 10MB string
        const str = new NullableString(largeStr);
        expect(str.isNotNull()).toBe(true);
        if (str.isNotNull()) {
            expect(str.value().length).toBe(10 * 1024 * 1024);
        }
    }, 10000); // Longer timeout

    test('should handle many instances', () => {
        const instances: any[] = [];
        for (let i = 0; i < 1000; i++) {
            instances.push(new NullableString(`instance_${i}`));
        }

        // Verify all work independently
        instances.forEach((str, i) => {
            expect(str.isNotNull()).toBe(true);
            if (str.isNotNull()) {
                expect(str.value()).toBe(`instance_${i}`);
            }
        });
    });

    // === CONCURRENT ACCESS ===
    test('should maintain state under concurrent access simulation', () => {
        const str = new NullableString("concurrent");

        // Simulate rapid method calls
        const results: any[] = [];
        for (let i = 0; i < 100; i++) {
            results.push(str.isNull());
            results.push(str.isNotNull());
        }

        // All calls should return consistent results
        expect(results.every(r => r === false || r === true)).toBe(true);
        expect(str.isNotNull()).toBe(true); // Final state should be consistent
    });

    // === RECURSIVE OBJECTS ===
    test('should handle recursive objects without stack overflow', () => {
        const recursive: any = {};
        recursive.self = recursive;
        recursive.toString = () => "recursive";

        const str = new NullableString(recursive);
        expect(str.isNull()).toBe(true); // Should reject object
    });

    // === EXCEPTION DOMINANCE ===
    test('should handle objects that throw from all primitive methods', () => {
        const evilObj = {
            valueOf: () => { throw new Error("valueOf failed") },
            toString: () => { throw new Error("toString failed") },
            [Symbol.toPrimitive]: () => { throw new Error("toPrimitive failed") }
        };

        const str = new NullableString(evilObj);
        expect(str.isNull()).toBe(true); // Should handle gracefully
    });

    // === TYPE BYPASS ATTEMPTS ===
    test('should handle TypeScript type assertion bypass', () => {
        const throughAssertion = new NullableString(null as unknown as string);
        expect(throughAssertion.isNull()).toBe(true);
    });

    test('should handle generic type exploits', () => {
        function evilWrapper<T>(value: T): NullableString {
            return new NullableString(value);
        }

        const result = evilWrapper<{ toString(): never }>({
            toString: () => { throw new Error("evil") }
        });
        expect(result.isNull()).toBe(true);
    });
});

describe('NotNullString - Deep Edge Cases', () => {
    // === CONSTRUCTOR EXCEPTION SAFETY ===
    test('should not leave partial instance when constructor throws', () => {
        let instance: any = undefined;

        try {
            instance = new NotNullString(123 as any);
        } catch (e) {
            // Constructor should throw
            expect((e as any).message).toContain("MUST be string");
        }

        // Instance should not be accessible or partially created
        expect(instance).toBeUndefined();
    });

    test('should handle inheritance correctly', () => {
        class ExtendedString extends NotNullString {
            extraMethod(): string {
                return this.value() + " extended";
            }
        }

        const extended = new ExtendedString("base");
        expect(extended.value()).toBe("base");
        expect(extended.extraMethod()).toBe("base extended");
    });

    // === ENVIRONMENT-SPECIFIC OBJECTS ===
    test('should reject DOM elements in browser-like environment', () => {
        // Mock DOM element
        const mockElement = {
            nodeType: 1,
            tagName: 'DIV',
            toString: () => '[object HTMLDivElement]'
        };

        expect(() => new NotNullString(mockElement as any)).toThrow("MUST be string");
    });

    test('should reject Buffer objects in Node-like environment', () => {
        // Mock Buffer
        const mockBuffer = {
            constructor: { name: 'Buffer' },
            toString: () => 'buffer content'
        };

        expect(() => new NotNullString(mockBuffer as any)).toThrow("MUST be string");
    });

    // === STRING OBJECT VS STRING PRIMITIVE ===
    test('should handle String object vs string primitive', () => {
        // String object (typeof "object")
        const stringObj = new String("object wrapper");
        expect(() => new NotNullString(stringObj as any)).toThrow("MUST be string");

        // String primitive (typeof "string") 
        const stringPrimitive = "primitive";
        const str = new NotNullString(stringPrimitive);
        expect(str.value()).toBe("primitive");
    });

    // === EXOTIC STRING CASES ===
    test('should handle template literals', () => {
        const name = "world";
        const template = `Hello ${name}!`;
        const str = new NotNullString(template);
        expect(str.value()).toBe("Hello world!");
    });

    test('should handle String.raw', () => {
        const raw = String.raw`Hello\nWorld`;
        const str = new NotNullString(raw);
        expect(str.value()).toBe("Hello\\nWorld");
    });

    // === MEMORY LEAK POTENTIAL ===
    test('should not create memory leaks with repeated instantiation', () => {
        //@ts-ignore
        const initialMemory = process.memoryUsage?.().heapUsed || 0;

        // Create many instances
        for (let i = 0; i < 1000; i++) {
            const str = new NotNullString(`test_${i}`);
            expect(str.value()).toBe(`test_${i}`);
        }

        // Note: Actual memory test would need proper memory profiling
        // This just verifies no crashes
        expect(true).toBe(true);
    });
});

// === CROSS-CLASS INTEGRATION EDGE CASES ===
describe('Cross-Class Integration Edge Cases', () => {
    test('should convert between Nullable and NotNull safely', () => {
        const nullable = new NullableString("convertible");

        if (nullable.isNotNull()) {
            const notNull = new NotNullString(nullable.value());
            expect(notNull.value()).toBe("convertible");
        } else {
            fail("Should be convertible");
        }
    });

    test('should handle failed conversion gracefully', () => {
        const nullable = new NullableString(null);

        if (nullable.isNotNull()) {
            fail("Should not be convertible");
            // This block should not execute
            //@ts-ignore
            const notNull = new NotNullString(nullable.value());
        } else {
            // Correctly handled - cannot convert null to NotNull
            expect(() => new NotNullString(null!)).toThrow();
        }
    });

    test('should work with array of mixed types', () => {
        const mixedArray = [
            new NotNullString("required"),
            new NullableString("optional"),
            new NullableString(null),
            new NotNullString("another")
        ];

        const results = mixedArray.map(item => {
            if ('isNotNull' in item) {
                // It's NullableString
                return item.isNotNull() ? item.value() : null;
            } else {
                // It's NotNullString
                return item.value();
            }
        });

        expect(results).toEqual(["required", "optional", null, "another"]);
    });
});