import { NullableBoolean, NotNullBoolean } from '../src/common/boolean.wrapper';

describe('NullableBoolean', () => {
  // === BASIC FUNCTIONALITY ===
  test('should handle true', () => {
    const bool = new NullableBoolean(true);
    expect(bool.isNotNull()).toBe(true);
    expect(bool.isNull()).toBe(false);
    expect(bool.condition()).toBe(true);
    expect(bool.yes()).toBe(true);
    expect(bool.no()).toBe(false);
  });

  test('should handle false', () => {
    const bool = new NullableBoolean(false);
    expect(bool.isNotNull()).toBe(true);
    expect(bool.condition()).toBe(false);
    expect(bool.yes()).toBe(false);
    expect(bool.no()).toBe(true);
  });

  test('should handle null input', () => {
    const bool = new NullableBoolean(null);
    expect(bool.isNull()).toBe(true);
    expect(bool.isNotNull()).toBe(false);
  });

  test('should handle undefined input', () => {
    const bool = new NullableBoolean(undefined);
    expect(bool.isNull()).toBe(true);
  });

  // === REJECT NON-BOOLEANS ===
  test('should reject string input', () => {
    const bool = new NullableBoolean("true");
    expect(bool.isNull()).toBe(true);
  });

  test('should reject number input', () => {
    const bool = new NullableBoolean(1);
    expect(bool.isNull()).toBe(true);
  });

  test('should reject object input', () => {
    const bool = new NullableBoolean({ value: true });
    expect(bool.isNull()).toBe(true);
  });

  test('should reject array input', () => {
    const bool = new NullableBoolean([true]);
    expect(bool.isNull()).toBe(true);
  });

  test('should reject truthy values', () => {
    const bool = new NullableBoolean("non-empty string");
    expect(bool.isNull()).toBe(true);
  });

  test('should reject falsy values except null/undefined', () => {
    const bool = new NullableBoolean(0);
    expect(bool.isNull()).toBe(true);
  });

  // === VALIDATION ORDER REQUIREMENTS ===
  test('should throw when condition() called without validation', () => {
    const bool = new NullableBoolean(true);
    expect(() => bool.condition()).toThrow("isNull()/isNotNull() must be called before value()");
  });

  test('should throw when yes() called without validation', () => {
    const bool = new NullableBoolean(true);
    expect(() => bool.yes()).toThrow("isNull()/isNotNull() must be called before value()");
  });

  test('should throw when no() called without validation', () => {
    const bool = new NullableBoolean(false);
    expect(() => bool.no()).toThrow("isNull()/isNotNull() must be called before value()");
  });

  test('should throw when condition() called on null after verification', () => {
    const bool = new NullableBoolean(null);
    bool.isNull(); // Verify it's null
    expect(() => bool.condition()).toThrow("data is null :isNull()/isNotNull() must be used properly to avoid null");
  });

  test('should work with correct validation pattern - true case', () => {
    const bool = new NullableBoolean(true);
    if (bool.isNotNull()) {
      expect(bool.condition()).toBe(true);
      expect(bool.yes()).toBe(true);
      expect(bool.no()).toBe(false);
    } else {
      fail("Should not reach here");
    }
  });

  test('should work with correct validation pattern - false case', () => {
    const bool = new NullableBoolean(false);
    if (bool.isNotNull()) {
      expect(bool.condition()).toBe(false);
      expect(bool.yes()).toBe(false);
      expect(bool.no()).toBe(true);
    } else {
      fail("Should not reach here");
    }
  });

  test('should correctly handle null case', () => {
    const bool = new NullableBoolean(null);
    if (bool.isNull()) {
      // Should not call condition(), yes(), or no()
      expect(bool.isNotNull()).toBe(false);
    } else {
      fail("Should not reach here");
    }
  });

  // === OBJECT PRIMITIVE CONVERSION ===
  test('should handle object with valueOf returning boolean', () => {
    const obj = {
      valueOf: () => true
    };
    const bool = new NullableBoolean(obj);
    expect(bool.isNull()).toBe(true); // Should reject objects
  });

  test('should handle object with toString returning boolean string', () => {
    const obj = {
      toString: () => "false"
    };
    const bool = new NullableBoolean(obj);
    expect(bool.isNull()).toBe(true); // Should reject objects
  });

  // === STATE MANAGEMENT ===
  test('should maintain state across method calls', () => {
    const bool = new NullableBoolean(true);
    expect(bool.isNotNull()).toBe(true);
    expect(bool.isNull()).toBe(false); // Should not change state
    expect(bool.condition()).toBe(true); // Should still work
    expect(bool.yes()).toBe(true);
    expect(bool.no()).toBe(false);
  });

  test('should work with reverse method sequence', () => {
    const bool = new NullableBoolean(false);
    expect(bool.isNull()).toBe(false);
    expect(bool.isNotNull()).toBe(true);
    expect(bool.condition()).toBe(false);
    expect(bool.no()).toBe(true);
  });

  test('should handle multiple instances independently', () => {
    const bool1 = new NullableBoolean(true);
    const bool2 = new NullableBoolean(null);
    const bool3 = new NullableBoolean(false);

    expect(bool1.isNotNull()).toBe(true);
    expect(bool2.isNull()).toBe(true);
    expect(bool3.isNotNull()).toBe(true);

    expect(bool1.condition()).toBe(true);
    expect(bool3.condition()).toBe(false);
  });

  // === METHOD CONSISTENCY ===
  test('should have consistent yes() and condition() methods', () => {
    const bool = new NullableBoolean(true);
    bool.isNotNull();
    expect(bool.condition()).toBe(bool.yes());
  });

  test('should have consistent no() and condition() methods', () => {
    const bool = new NullableBoolean(false);
    bool.isNotNull();
    expect(bool.no()).toBe(!bool.condition());
  });
});

describe('NotNullBoolean', () => {
  // === VALID BOOLEANS ===
  test('should handle true', () => {
    const bool = new NotNullBoolean(true);
    expect(bool.condition()).toBe(true);
    expect(bool.yes()).toBe(true);
    expect(bool.no()).toBe(false);
  });

  test('should handle false', () => {
    const bool = new NotNullBoolean(false);
    expect(bool.condition()).toBe(false);
    expect(bool.yes()).toBe(false);
    expect(bool.no()).toBe(true);
  });

  // === REJECT INVALID INPUTS ===
  test('should throw on null input', () => {
    expect(() => new NotNullBoolean(null as any)).toThrow("value in NotNullBoolean MUST be boolean");
  });

  test('should throw on undefined input', () => {
    expect(() => new NotNullBoolean(undefined as any)).toThrow("value in NotNullBoolean MUST be boolean");
  });

  test('should throw on string input', () => {
    expect(() => new NotNullBoolean("true" as any)).toThrow("value in NotNullBoolean MUST be boolean");
  });

  test('should throw on number input', () => {
    expect(() => new NotNullBoolean(1 as any)).toThrow("value in NotNullBoolean MUST be boolean");
  });

  test('should throw on object input', () => {
    expect(() => new NotNullBoolean({} as any)).toThrow("value in NotNullBoolean MUST be boolean");
  });

  test('should throw on array input', () => {
    expect(() => new NotNullBoolean([true] as any)).toThrow("value in NotNullBoolean MUST be boolean");
  });

  // === METHOD CONSISTENCY ===
  test('should have consistent yes() and condition() for true', () => {
    const bool = new NotNullBoolean(true);
    expect(bool.yes()).toBe(bool.condition());
  });

  test('should have consistent no() and condition() for false', () => {
    const bool = new NotNullBoolean(false);
    expect(bool.no()).toBe(!bool.condition());
  });

  test('should have yes() opposite of no() for true', () => {
    const bool = new NotNullBoolean(true);
    expect(bool.yes()).toBe(!bool.no());
  });

  test('should have yes() opposite of no() for false', () => {
    const bool = new NotNullBoolean(false);
    expect(bool.yes()).toBe(!bool.no());
  });
});

describe('Integration: NullableBoolean and NotNullBoolean', () => {
  test('should work together in function parameters', () => {
    const checkFeature = (enabled: NotNullBoolean, optional: NullableBoolean): string => {
      if (enabled.yes()) {
        if (optional.isNotNull() && optional.yes()) {
          return "feature-enabled-with-option";
        }
        return "feature-enabled";
      }
      return "feature-disabled";
    };

    const result1 = checkFeature(new NotNullBoolean(true), new NullableBoolean(true));
    expect(result1).toBe("feature-enabled-with-option");

    const result2 = checkFeature(new NotNullBoolean(true), new NullableBoolean(null));
    expect(result2).toBe("feature-enabled");

    const result3 = checkFeature(new NotNullBoolean(false), new NullableBoolean(true));
    expect(result3).toBe("feature-disabled");
  });

  test('should convert between Nullable and NotNull safely', () => {
    const nullable = new NullableBoolean(true);
    if (nullable.isNotNull()) {
      const notNull = new NotNullBoolean(nullable.condition());
      expect(notNull.condition()).toBe(true);
    } else {
      fail("Should not reach here");
    }
  });

  test('should handle failed conversion gracefully', () => {
    const nullable = new NullableBoolean(null);
    if (nullable.isNotNull()) {
      fail("Should not reach here");
    } else {
      // Handle null case appropriately
      expect(nullable.isNull()).toBe(true);
    }
  });
});

describe('NullableBoolean - Deep Edge Cases', () => {
  test('should handle prototype polluted objects', () => {
    (Object.prototype as any).valueOf = () => true;
    const bool = new NullableBoolean({});
    expect(bool.isNull()).toBe(true);
    delete (Object.prototype as any).valueOf;
  });

  test('should handle Proxy objects', () => {
    const proxy = new Proxy({}, {
      get: (target, prop) => {
        if (prop === Symbol.toPrimitive) return () => true;
        //@ts-ignore
        return target[prop as any];
      }
    });
    const bool = new NullableBoolean(proxy);
    expect(bool.isNull()).toBe(true);
  });

  test('should handle objects with Symbol.toPrimitive', () => {
    const obj = {
      [Symbol.toPrimitive]() { return false; }
    };
    const bool = new NullableBoolean(obj);
    expect(bool.isNull()).toBe(true);
  });

  test('should handle objects with valueOf override', () => {
    const obj = {
      valueOf: () => true
    };
    const bool = new NullableBoolean(obj);
    expect(bool.isNull()).toBe(true);
  });

  test('should maintain state under concurrent access simulation', () => {
    const bool = new NullableBoolean(true);
    
    // Simulate multiple accesses
    expect(bool.isNotNull()).toBe(true);
    expect(bool.isNull()).toBe(false);
    expect(bool.isNotNull()).toBe(true);
    expect(bool.condition()).toBe(true);
    expect(bool.yes()).toBe(true);
    expect(bool.no()).toBe(false);
    
    // Should remain consistent
    expect(bool.condition()).toBe(true);
  });

  test('should handle recursive objects without stack overflow', () => {
    const obj: any = {};
    obj.self = obj;
    const bool = new NullableBoolean(obj);
    expect(bool.isNull()).toBe(true);
  });

  test('should handle objects that throw from primitive methods', () => {
    const obj = {
      valueOf: () => { throw new Error("Evil valueOf"); },
      toString: () => { throw new Error("Evil toString"); }
    };
    const bool = new NullableBoolean(obj);
    expect(bool.isNull()).toBe(true);
  });

  test('should handle Boolean object wrapper', () => {
    const boolObj = new Boolean(true);
    const bool = new NullableBoolean(boolObj);
    expect(bool.isNull()).toBe(true); // Should reject Boolean object
  });
});

describe('NotNullBoolean - Deep Edge Cases', () => {
  test('should not leave partial instance when constructor throws', () => {
    expect(() => new NotNullBoolean("invalid" as any)).toThrow();
    expect(() => new NotNullBoolean(null as any)).toThrow();
  });

  test('should handle Boolean object vs boolean primitive', () => {
    expect(() => new NotNullBoolean(new Boolean(true) as any)).toThrow();
  });

  test('should not create memory leaks with repeated instantiation', () => {
    for (let i = 0; i < 1000; i++) {
      const bool = new NotNullBoolean(i % 2 === 0);
      expect(bool.condition()).toBe(i % 2 === 0);
    }
  });

  test('should handle rapid true/false alternation', () => {
    for (let i = 0; i < 500; i++) {
      const bool1 = new NotNullBoolean(true);
      const bool2 = new NotNullBoolean(false);
      expect(bool1.yes()).toBe(true);
      expect(bool2.no()).toBe(true);
    }
  });
});

describe('Cross-Class Boolean Integration', () => {
  test('should work with logical operations', () => {
    const processConditions = (
      condition1: NotNullBoolean,
      condition2: NullableBoolean,
      condition3: NotNullBoolean
    ): string => {
      if (condition1.yes() && condition3.yes()) {
        if (condition2.isNotNull()) {
          return condition2.yes() ? "all-true" : "mixed-with-false";
        }
        return "main-true-optional-null";
      }
      return "main-false";
    };

    const result1 = processConditions(
      new NotNullBoolean(true),
      new NullableBoolean(true),
      new NotNullBoolean(true)
    );
    expect(result1).toBe("all-true");

    const result2 = processConditions(
      new NotNullBoolean(true),
      new NullableBoolean(false),
      new NotNullBoolean(true)
    );
    expect(result2).toBe("mixed-with-false");

    const result3 = processConditions(
      new NotNullBoolean(true),
      new NullableBoolean(null),
      new NotNullBoolean(true)
    );
    expect(result3).toBe("main-true-optional-null");
  });
});