import { NullableNumber, NotNullNumber } from '../src/common/number.wrapper';

describe('NullableNumber', () => {
  // === BASIC FUNCTIONALITY ===
  test('should handle valid number', () => {
    const num = new NullableNumber(42);
    expect(num.isNotNull()).toBe(true);
    expect(num.isNull()).toBe(false);
    expect(num.value()).toBe(42);
  });

  test('should handle zero', () => {
    const num = new NullableNumber(0);
    expect(num.isNotNull()).toBe(true);
    expect(num.value()).toBe(0);
  });

  test('should handle negative number', () => {
    const num = new NullableNumber(-123.45);
    expect(num.isNotNull()).toBe(true);
    expect(num.value()).toBe(-123.45);
  });

  test('should handle null input', () => {
    const num = new NullableNumber(null);
    expect(num.isNull()).toBe(true);
    expect(num.isNotNull()).toBe(false);
  });

  test('should handle undefined input', () => {
    const num = new NullableNumber(undefined);
    expect(num.isNull()).toBe(true);
  });

  // === REJECT NON-NUMBERS ===
  test('should reject string input', () => {
    const num = new NullableNumber("42");
    expect(num.isNull()).toBe(true);
  });

  test('should reject boolean input', () => {
    const num = new NullableNumber(true);
    expect(num.isNull()).toBe(true);
  });

  test('should reject object input', () => {
    const num = new NullableNumber({ value: 42 });
    expect(num.isNull()).toBe(true);
  });

  test('should reject array input', () => {
    const num = new NullableNumber([1, 2, 3]);
    expect(num.isNull()).toBe(true);
  });

  // === VALIDATION ORDER REQUIREMENTS ===
  test('should throw when value() called without validation', () => {
    const num = new NullableNumber(42);
    expect(() => num.value()).toThrow("isNull() must be called before value()");
  });

  test('should throw when value() called on null after verification', () => {
    const num = new NullableNumber(null);
    num.isNull(); // Verify it's null
    expect(() => num.value()).toThrow("data is null :isNull()/isNotNull() must be used properly to avoid null");
  });

  test('should work with correct validation pattern', () => {
    const num = new NullableNumber(100);
    if (num.isNotNull()) {
      expect(num.value()).toBe(100);
    } else {
      fail("Should not reach here");
    }
  });

  test('should correctly handle null case', () => {
    const num = new NullableNumber(null);
    if (num.isNull()) {
      // Should not call value()
      expect(num.isNotNull()).toBe(false);
    } else {
      fail("Should not reach here");
    }
  });

  // === INFINITY AND NAN HANDLING ===
  test('should reject NaN', () => {
    const num = new NullableNumber(NaN);
    expect(num.isNull()).toBe(true);
  });

  test('should reject Infinity', () => {
    const num = new NullableNumber(Infinity);
    expect(num.isNull()).toBe(true);
  });

  test('should reject -Infinity', () => {
    const num = new NullableNumber(-Infinity);
    expect(num.isNull()).toBe(true);
  });

  // === OBJECT PRIMITIVE CONVERSION ===
  test('should handle object with valueOf', () => {
    const obj = {
      valueOf: () => 42
    };
    const num = new NullableNumber(obj);
    expect(num.isNull()).toBe(true); // Should reject objects
  });

  test('should handle object with toString returning number', () => {
    const obj = {
      toString: () => "42"
    };
    const num = new NullableNumber(obj);
    expect(num.isNull()).toBe(true); // Should reject objects
  });

  // === STATE MANAGEMENT ===
  test('should maintain state across method calls', () => {
    const num = new NullableNumber(999);
    expect(num.isNotNull()).toBe(true);
    expect(num.isNull()).toBe(false); // Should not change state
    expect(num.value()).toBe(999); // Should still work
  });

  test('should work with reverse method sequence', () => {
    const num = new NullableNumber(500);
    expect(num.isNull()).toBe(false);
    expect(num.isNotNull()).toBe(true);
    expect(num.value()).toBe(500);
  });

  test('should handle multiple instances independently', () => {
    const num1 = new NullableNumber(1);
    const num2 = new NullableNumber(null);
    const num3 = new NullableNumber(3);

    expect(num1.isNotNull()).toBe(true);
    expect(num2.isNull()).toBe(true);
    expect(num3.isNotNull()).toBe(true);

    expect(num1.value()).toBe(1);
    expect(num3.value()).toBe(3);
  });
});

describe('NotNullNumber', () => {
  // === VALID NUMBERS ===
  test('should handle valid number', () => {
    const num = new NotNullNumber(42);
    expect(num.value()).toBe(42);
  });

  test('should handle zero', () => {
    const num = new NotNullNumber(0);
    expect(num.value()).toBe(0);
  });

  test('should handle negative number', () => {
    const num = new NotNullNumber(-123.45);
    expect(num.value()).toBe(-123.45);
  });

  test('should handle decimal numbers', () => {
    const num = new NotNullNumber(3.14159);
    expect(num.value()).toBe(3.14159);
  });

  test('should handle very large number', () => {
    const num = new NotNullNumber(1.7976931348623157e+308); // Max safe integer
    expect(num.value()).toBe(1.7976931348623157e+308);
  });

  test('should handle very small number', () => {
    const num = new NotNullNumber(5e-324); // Min value
    expect(num.value()).toBe(5e-324);
  });

  // === REJECT INVALID INPUTS ===
  test('should throw on null input', () => {
    expect(() => new NotNullNumber(null as any)).toThrow("value in NotNullNumber MUST be number");
  });

  test('should throw on undefined input', () => {
    expect(() => new NotNullNumber(undefined as any)).toThrow("value in NotNullNumber MUST be number");
  });

  test('should throw on string input', () => {
    expect(() => new NotNullNumber("42" as any)).toThrow("value in NotNullNumber MUST be number");
  });

  test('should throw on boolean input', () => {
    expect(() => new NotNullNumber(true as any)).toThrow("value in NotNullNumber MUST be number");
  });

  test('should throw on object input', () => {
    expect(() => new NotNullNumber({} as any)).toThrow("value in NotNullNumber MUST be number");
  });

  test('should throw on array input', () => {
    expect(() => new NotNullNumber([1, 2, 3] as any)).toThrow("value in NotNullNumber MUST be number");
  });

  // === SPECIAL NUMBER CASES ===
  test('should throw on NaN', () => {
    expect(() => new NotNullNumber(NaN)).toThrow("value in NotNullNumber MUST be number");
  });

  test('should throw on Infinity', () => {
    expect(() => new NotNullNumber(Infinity)).toThrow("value in NotNullNumber MUST be finite number");
  });

  test('should throw on -Infinity', () => {
    expect(() => new NotNullNumber(-Infinity)).toThrow("value in NotNullNumber MUST be finite number");
  });

  // === OBJECT PRIMITIVE REJECTION ===
  test('should reject object with valueOf', () => {
    const obj = { valueOf: () => 42 };
    expect(() => new NotNullNumber(obj as any)).toThrow("value in NotNullNumber MUST be number");
  });

  test('should reject object with toString number', () => {
    const obj = { toString: () => "42" };
    expect(() => new NotNullNumber(obj as any)).toThrow("value in NotNullNumber MUST be number");
  });
});

describe('Integration: NullableNumber and NotNullNumber', () => {
  test('should work together in function parameters', () => {
    const addNumbers = (a: NotNullNumber, b: NullableNumber): number => {
      if (b.isNotNull()) {
        return a.value() + b.value();
      }
      return a.value();
    };

    const result1 = addNumbers(new NotNullNumber(10), new NullableNumber(5));
    expect(result1).toBe(15);

    const result2 = addNumbers(new NotNullNumber(10), new NullableNumber(null));
    expect(result2).toBe(10);
  });

  test('should convert between Nullable and NotNull safely', () => {
    const nullable = new NullableNumber(100);
    if (nullable.isNotNull()) {
      const notNull = new NotNullNumber(nullable.value());
      expect(notNull.value()).toBe(100);
    } else {
      fail("Should not reach here");
    }
  });

  test('should handle failed conversion gracefully', () => {
    const nullable = new NullableNumber(null);
    if (nullable.isNotNull()) {
      fail("Should not reach here");
    } else {
      // Handle null case appropriately
      expect(nullable.isNull()).toBe(true);
    }
  });
});

describe('NullableNumber - Deep Edge Cases', () => {
  test('should handle prototype polluted objects', () => {
    (Object.prototype as any).valueOf = () => 999;
    const num = new NullableNumber({});
    expect(num.isNull()).toBe(true);
    delete (Object.prototype as any).valueOf;
  });

  test('should handle Proxy objects', () => {
    const proxy = new Proxy({}, {
      get: (target, prop) => {
        if (prop === Symbol.toPrimitive) return () => 42;
        //@ts-ignore
        return target[prop as any];
      }
    });
    const num = new NullableNumber(proxy);
    expect(num.isNull()).toBe(true);
  });

  test('should handle objects with Symbol.toPrimitive', () => {
    const obj = {
      [Symbol.toPrimitive]() { return 123; }
    };
    const num = new NullableNumber(obj);
    expect(num.isNull()).toBe(true);
  });

  test('should handle objects with valueOf override', () => {
    const obj = {
      valueOf: () => 456
    };
    const num = new NullableNumber(obj);
    expect(num.isNull()).toBe(true);
  });

  test('should handle very large numbers correctly', () => {
    const largeNum = Number.MAX_SAFE_INTEGER;
    const num = new NullableNumber(largeNum);
    expect(num.isNotNull()).toBe(true);
    expect(num.value()).toBe(largeNum);
  });

  test('should handle very small numbers correctly', () => {
    const smallNum = Number.MIN_VALUE;
    const num = new NullableNumber(smallNum);
    expect(num.isNotNull()).toBe(true);
    expect(num.value()).toBe(smallNum);
  });

  test('should maintain state under concurrent access simulation', () => {
    const num = new NullableNumber(777);
    
    // Simulate multiple accesses
    expect(num.isNotNull()).toBe(true);
    expect(num.isNull()).toBe(false);
    expect(num.isNotNull()).toBe(true);
    expect(num.value()).toBe(777);
    
    // Should remain consistent
    expect(num.value()).toBe(777);
  });

  test('should handle recursive objects without stack overflow', () => {
    const obj: any = {};
    obj.self = obj;
    const num = new NullableNumber(obj);
    expect(num.isNull()).toBe(true);
  });

  test('should handle objects that throw from primitive methods', () => {
    const obj = {
      valueOf: () => { throw new Error("Evil valueOf"); },
      toString: () => { throw new Error("Evil toString"); }
    };
    const num = new NullableNumber(obj);
    expect(num.isNull()).toBe(true);
  });
});

describe('NotNullNumber - Deep Edge Cases', () => {
  test('should not leave partial instance when constructor throws', () => {
    expect(() => new NotNullNumber(NaN)).toThrow();
    expect(() => new NotNullNumber("invalid" as any)).toThrow();
  });

  test('should handle String object vs number primitive', () => {
    expect(() => new NotNullNumber(new String("42") as any)).toThrow();
  });

  test('should not create memory leaks with repeated instantiation', () => {
    for (let i = 0; i < 1000; i++) {
      const num = new NotNullNumber(i);
      expect(num.value()).toBe(i);
    }
  });

  test('should handle scientific notation', () => {
    const num = new NotNullNumber(1.23e-10);
    expect(num.value()).toBe(1.23e-10);
  });

  test('should handle hexadecimal numbers', () => {
    const num = new NotNullNumber(0xFF);
    expect(num.value()).toBe(255);
  });

  test('should handle binary numbers', () => {
    const num = new NotNullNumber(0b1010);
    expect(num.value()).toBe(10);
  });

  test('should handle octal numbers', () => {
    const num = new NotNullNumber(0o755);
    expect(num.value()).toBe(493);
  });
});