import { NullableNumber, NotNullNumber } from '../src/common/number.wrapper';

describe('Number Wrapper - Math Operations Comprehensive', () => {
    // ==================== NOTNULLNUMBER MATH OPERATIONS ====================
    describe('NotNullNumber - Math Operations', () => {
        test('should add two positive numbers', () => {
            const a = new NotNullNumber(10);
            const b = new NotNullNumber(5);
            const result = a.add(b);
            expect(result.value()).toBe(15);
            a.finish(); b.finish(); result.finish();
        });

        test('should subtract numbers', () => {
            const a = new NotNullNumber(10);
            const b = new NotNullNumber(3);
            const result = a.minus(b);
            expect(result.value()).toBe(7);
            a.finish(); b.finish(); result.finish();
        });

        test('should multiply numbers', () => {
            const a = new NotNullNumber(7);
            const b = new NotNullNumber(6);
            const result = a.multiplyBy(b);
            expect(result.value()).toBe(42);
            a.finish(); b.finish(); result.finish();
        });

        test('should divide numbers', () => {
            const a = new NotNullNumber(15);
            const b = new NotNullNumber(3);
            const result = a.dividedBy(b);
            expect(result.value()).toBe(5);
            a.finish(); b.finish(); result.finish();
        });

        test('should handle negative number addition', () => {
            const a = new NotNullNumber(-8);
            const b = new NotNullNumber(3);
            const result = a.add(b);
            expect(result.value()).toBe(-5);
            a.finish(); b.finish(); result.finish();
        });

        test('should handle negative number multiplication', () => {
            const a = new NotNullNumber(-5);
            const b = new NotNullNumber(4);
            const result = a.multiplyBy(b);
            expect(result.value()).toBe(-20);
            a.finish(); b.finish(); result.finish();
        });

        test('should handle decimal number operations', () => {
            const a = new NotNullNumber(2.5);
            const b = new NotNullNumber(1.5);
            const result = a.add(b);
            expect(result.value()).toBe(4);
            a.finish(); b.finish(); result.finish();
        });

        test('should handle zero in multiplication', () => {
            const a = new NotNullNumber(7);
            const zero = new NotNullNumber(0);
            const result = a.multiplyBy(zero);
            expect(result.value()).toBe(0);
            a.finish(); zero.finish(); result.finish();
        });
    });

    // ==================== NOTNULLNUMBER COMPARISON OPERATIONS ====================
    describe('NotNullNumber - Comparison Operations', () => {
        test('should correctly identify greater than', () => {
            const bigger = new NotNullNumber(10);
            const smaller = new NotNullNumber(5);
            expect(bigger.greaterThan(smaller).yes()).toBe(true);
            expect(smaller.greaterThan(bigger).yes()).toBe(false);
            bigger.finish(); smaller.finish();
        });

        test('should correctly identify less than', () => {
            const smaller = new NotNullNumber(3);
            const bigger = new NotNullNumber(8);
            expect(smaller.lessThan(bigger).yes()).toBe(true);
            expect(bigger.lessThan(smaller).yes()).toBe(false);
            smaller.finish(); bigger.finish();
        });

        test('should correctly identify equality', () => {
            const a = new NotNullNumber(5);
            const b = new NotNullNumber(5);
            const c = new NotNullNumber(6);
            expect(a.equalTo(b).yes()).toBe(true);
            expect(a.equalTo(c).yes()).toBe(false);
            a.finish(); b.finish(); c.finish();
        });

        test('should handle greater or equal comparisons', () => {
            const a = new NotNullNumber(10);
            const b = new NotNullNumber(10);
            const c = new NotNullNumber(9);
            expect(a.greaterOrEqualThan(b).yes()).toBe(true);
            expect(a.greaterOrEqualThan(c).yes()).toBe(true);
            expect(c.greaterOrEqualThan(a).yes()).toBe(false);
            a.finish(); b.finish(); c.finish();
        });

        test('should handle less or equal comparisons', () => {
            const a = new NotNullNumber(5);
            const b = new NotNullNumber(5);
            const c = new NotNullNumber(6);
            expect(a.lessOrEqualThan(b).yes()).toBe(true);
            expect(a.lessOrEqualThan(c).yes()).toBe(true);
            expect(c.lessOrEqualThan(a).yes()).toBe(false);
            a.finish(); b.finish(); c.finish();
        });

        test('should compare negative numbers correctly', () => {
            const negative = new NotNullNumber(-5);
            const positive = new NotNullNumber(3);
            expect(negative.lessThan(positive).yes()).toBe(true);
            expect(positive.greaterThan(negative).yes()).toBe(true);
            negative.finish(); positive.finish();
        });

        test('should compare decimal numbers correctly', () => {
            const a = new NotNullNumber(2.5);
            const b = new NotNullNumber(2.7);
            expect(a.lessThan(b).yes()).toBe(true);
            expect(b.greaterThan(a).yes()).toBe(true);
            a.finish(); b.finish();
        });
    });

    // ==================== NOTNULLNUMBER INFINITY PROTECTION ====================
    describe('NotNullNumber - Infinity Protection', () => {
        test('should throw when division by zero produces Infinity', () => {
            const a = new NotNullNumber(10);
            const zero = new NotNullNumber(0);
            expect(() => a.dividedBy(zero)).toThrow('value in NotNullNumber MUST be finite number');
            a.finish(); zero.finish();
        });

        test('should throw when multiplication produces Infinity', () => {
            const large = new NotNullNumber(Number.MAX_VALUE);
            const multiplier = new NotNullNumber(2);
            expect(() => large.multiplyBy(multiplier)).toThrow('value in NotNullNumber MUST be finite number');
            large.finish(); multiplier.finish();
        });

        test('should throw when addition produces Infinity', () => {
            const large = new NotNullNumber(Number.MAX_VALUE);
            const large2 = new NotNullNumber(Number.MAX_VALUE);
            expect(() => large.add(large2)).toThrow('value in NotNullNumber MUST be finite number');
            large.finish(); large2.finish();
        });

        test('should throw when subtraction produces -Infinity', () => {
            const min = new NotNullNumber(-Number.MAX_VALUE);
            const large = new NotNullNumber(Number.MAX_VALUE);
            expect(() => min.minus(large)).toThrow('value in NotNullNumber MUST be finite number');
            min.finish(); large.finish();
        });

        test('should allow operations within safe bounds', () => {
            const a = new NotNullNumber(Number.MAX_SAFE_INTEGER);
            const b = new NotNullNumber(1);
            const result = a.add(b);
            expect(result.value()).toBe(Number.MAX_SAFE_INTEGER + 1);
            a.finish(); b.finish(); result.finish();
        });
    });

    // ==================== NULLABLENUMBER MATH OPERATIONS ====================
    describe('NullableNumber - Math Operations', () => {
        test('should perform math operations on non-null numbers', () => {
            const nullableNum = new NullableNumber(15);
            const normalNum = new NotNullNumber(3);
            expect(nullableNum.isNotNull()).toBe(true);
            const result = nullableNum.dividedBy(normalNum);
            expect(result.value()).toBe(5);
            nullableNum.finish(); normalNum.finish(); result.finish();
        });

        test('should fail math operations on null numbers', () => {
            const nullNum = new NullableNumber(null);
            const normalNum = new NotNullNumber(5);

            expect(nullNum.isNull()).toBe(true);

            // ✅ ERROR MESSAGE YANG BENAR:
            expect(() => nullNum.add(normalNum)).toThrow('data is null :isNull()/isNotNull() must be used properly to avoid null');

            nullNum.finish();
            // normalNum.finish();
        });

        test('should handle nullable number addition', () => {
            const a = new NullableNumber(20);
            const b = new NotNullNumber(10);
            expect(a.isNotNull()).toBe(true)
            const result = a.add(b);
            expect(result.value()).toBe(30);
            a.finish(); b.finish(); result.finish();
        });

        test('should handle nullable number multiplication', () => {
            const a = new NullableNumber(7);
            const b = new NotNullNumber(6);
            expect(a.isNotNull()).toBe(true)
            const result = a.multiplyBy(b);
            expect(result.value()).toBe(42);
            a.finish(); b.finish(); result.finish();
        });
    });

    // ==================== NULLABLENUMBER COMPARISON OPERATIONS ====================
    describe('NullableNumber - Comparison Operations', () => {
        test('should compare non-null nullable numbers', () => {
            const a = new NullableNumber(10);
            const b = new NotNullNumber(5);
            expect(a.isNotNull()).toBe(true)
            expect(a.greaterThan(b).yes()).toBe(true);
            a.finish(); b.finish();
        });

        test('should fail comparison on null nullable numbers', () => {
            const nullNum = new NullableNumber(null);
            expect(nullNum.isNull()).toBe(true)
            const normalNum = new NotNullNumber(5);
            expect(() => nullNum.lessThan(normalNum)).toThrow('data is null :isNull()/isNotNull() must be used properly to avoid null');
            nullNum.finish();
            // normalNum.finish();
        });

        test('should handle equality comparison with nullable', () => {
            const nullable = new NullableNumber(8);
            const normal = new NotNullNumber(8);
            expect(nullable.isNotNull()).toBe(true)
            expect(nullable.equalTo(normal).yes()).toBe(true);
            nullable.finish(); normal.finish();
        });
    });

    // ==================== NULLABLENUMBER INFINITY PROTECTION ====================
    describe('NullableNumber - Infinity Protection', () => {
        test('should treat Infinity as null in constructor', () => {
            const num = new NullableNumber(Infinity);
            expect(num.isNull()).toBe(true);
            num.finish();
        });

        test('should throw when operation produces Infinity', () => {
            const nullableNum = new NullableNumber(10);
            const zero = new NotNullNumber(0);
            expect(nullableNum.isNotNull()).toBe(true);
            expect(() => nullableNum.dividedBy(zero)).toThrow('value in NotNullNumber MUST be finite number');
            nullableNum.finish(); zero.finish();
        });
    });

    // ==================== USAGE TRACKING IN OPERATIONS ====================
    describe('Usage Tracking in Math Operations', () => {
        test('should track usage when values are actually used', () => {
            const a = new NotNullNumber(5);
            const b = new NotNullNumber(3);
            const result = a.add(b);

            // ✅ PAKAI semua values
            const finalValue = result.value(); // ← INI yang mark sebagai used

            expect(finalValue).toBe(8);
            expect(() => a.finish()).not.toThrow(); // ✅ a sudah used
            expect(() => b.finish()).not.toThrow(); // ✅ b sudah used  
            expect(() => result.finish()).not.toThrow(); // ✅ result sudah used
        });

        test('should throw when math result never used', () => {
            const a = new NotNullNumber(5);
            const b = new NotNullNumber(3);
            const result = a.add(b); // ← Create result TAPI belum panggil .value()

            // ❌ result belum dipakai valuenya
            expect(() => result.finish()).toThrow('value exist but never used');

            a.finish(); b.finish();
        });

        test('should throw when operands used but result never used', () => {
            const a = new NotNullNumber(5);
            const b = new NotNullNumber(3);

            a.value(); // ✅ a used
            b.value(); // ✅ b used  
            const result = a.add(b); // ❌ result never used

            expect(() => result.finish()).toThrow('value exist but never used');
            expect(() => a.finish()).not.toThrow();
            expect(() => b.finish()).not.toThrow();
        });

        test('should track usage in complex scenario', () => {
            const a = new NotNullNumber(10);
            const b = new NotNullNumber(2);
            const c = new NotNullNumber(3);

            const temp = a.multiplyBy(b); // temp created
            const final = temp.add(c);    // final created
            const finalValue = final.value(); // ✅ FINALLY used!

            expect(finalValue).toBe(23);
            expect(() => a.finish()).not.toThrow();
            expect(() => b.finish()).not.toThrow();
            expect(() => c.finish()).not.toThrow();
            expect(() => temp.finish()).not.toThrow();
            expect(() => final.finish()).not.toThrow();
        });
    });

    // ==================== EDGE CASES & BOUNDARY VALUES ====================
    describe('Edge Cases & Boundary Values', () => {
        test('should handle Number.MAX_SAFE_INTEGER', () => {
            const max = new NotNullNumber(Number.MAX_SAFE_INTEGER);
            const one = new NotNullNumber(1);
            const result = max.minus(one);
            expect(result.value()).toBe(Number.MAX_SAFE_INTEGER - 1);
            max.finish(); one.finish(); result.finish();
        });

        test('should handle Number.MIN_SAFE_INTEGER', () => {
            const min = new NotNullNumber(Number.MIN_SAFE_INTEGER);
            const one = new NotNullNumber(1);
            const result = min.add(one);
            expect(result.value()).toBe(Number.MIN_SAFE_INTEGER + 1);
            min.finish(); one.finish(); result.finish();
        });

        test('should handle zero values correctly', () => {
            const zero = new NotNullNumber(0);
            const positive = new NotNullNumber(5);
            expect(zero.lessThan(positive).yes()).toBe(true);
            expect(zero.equalTo(new NotNullNumber(0)).yes()).toBe(true);
            zero.finish(); positive.finish();
        });

        test('should handle very small decimal numbers', () => {
            const small = new NotNullNumber(0.0000001);
            const smaller = new NotNullNumber(0.00000005);
            expect(small.greaterThan(smaller).yes()).toBe(true);
            small.finish(); smaller.finish();
        });
    });

    // ==================== REAL-WORLD SCENARIOS ====================
    describe('Real-World Scenarios', () => {
        test('SUCCESS: price calculation', () => {
            const unitPrice = new NotNullNumber(25.99);
            const quantity = new NotNullNumber(3);
            const subtotal = unitPrice.multiplyBy(quantity);
            expect(subtotal.value()).toBeCloseTo(77.97, 2);
            unitPrice.finish(); quantity.finish(); subtotal.finish();
        });

        test('SUCCESS: percentage calculation', () => {
            const value = new NotNullNumber(200);
            const percentage = new NotNullNumber(15);
            const result = value.multiplyBy(percentage).dividedBy(new NotNullNumber(100));
            expect(result.value()).toBe(30);
            value.finish(); percentage.finish(); result.finish();
        });

        test('FAILURE: division by zero in real scenario', () => {
            const total = new NotNullNumber(100);
            const zeroCount = new NotNullNumber(0);
            expect(() => total.dividedBy(zeroCount)).toThrow('value in NotNullNumber MUST be finite number');
            total.finish(); zeroCount.finish();
        });

        test('SUCCESS: temperature conversion', () => {
            const celsius = new NotNullNumber(25);
            const fahrenheit = celsius.multiplyBy(new NotNullNumber(9))
                .dividedBy(new NotNullNumber(5))
                .add(new NotNullNumber(32));
            expect(fahrenheit.value()).toBe(77);
            celsius.finish(); fahrenheit.finish();
        });
    });
});
