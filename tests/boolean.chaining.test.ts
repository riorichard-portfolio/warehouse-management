import { NullableBoolean, NotNullBoolean } from '../src/common/boolean.wrapper';

describe('Boolean Wrapper - Chaining Operations', () => {

    // ✅ VALID CHAINING CASES
    describe('Valid Chaining Operations', () => {

        test('should handle 2-level AND chaining with null checks', () => {
            const bool1 = new NullableBoolean(true);
            const bool2 = new NotNullBoolean(false);

            expect(bool1.isNotNull()).toBe(true);
            const result = bool1.and(bool2);

            expect(result.condition()).toBe(false);

            bool1.finish();
            bool2.finish();
            result.finish();
        });

        test('should handle 3-level OR chaining with mixed types', () => {
            const bool1 = new NotNullBoolean(false);
            const bool2 = new NullableBoolean(false);
            const bool3 = new NotNullBoolean(true);

            expect(bool2.isNotNull()).toBe(true);
            const result = bool1.or(bool2).or(bool3);

            expect(result.condition()).toBe(true);

            bool1.finish();
            bool2.finish();
            bool3.finish();
            result.finish();
        });

        test('should handle 4-level complex chaining', () => {
            const a = new NotNullBoolean(true);
            const b = new NotNullBoolean(false);
            const c = new NullableBoolean(true);
            const d = new NotNullBoolean(true);

            expect(c.isNotNull()).toBe(true);
            const result = a.and(b.or(c)).and(d);

            expect(result.condition()).toBe(true);

            a.finish();
            b.finish();
            c.finish();
            d.finish();
            result.finish();
        });

        test('should handle 5-level nested chaining', () => {
            const a = new NotNullBoolean(true);
            const b = new NotNullBoolean(true);
            const c = new NullableBoolean(false);
            const d = new NotNullBoolean(true);
            const e = new NotNullBoolean(false);

            expect(c.isNotNull()).toBe(true);
            const result = a.and(b).or(c.and(d)).and(e.or(a));

            expect(result.condition()).toBe(true);

            a.finish();
            b.finish();
            c.finish();
            d.finish();
            e.finish();
            result.finish();
        });

        test('should handle chaining with yes()/no() methods', () => {
            const a = new NullableBoolean(true);
            const b = new NotNullBoolean(false);

            expect(a.isNotNull()).toBe(true);
            const result = a.yes() && b.no();

            expect(result).toBe(true);

            a.finish();
            b.finish();
        });
    });

    // ❌ INVALID CHAINING CASES
    describe('Invalid Chaining Operations - Enforcement Errors', () => {

        test('should throw when nullable boolean used in chaining without null check', () => {
            const nullableBool = new NullableBoolean(true);
            const normalBool = new NotNullBoolean(false);

            expect(() => {
                nullableBool.and(normalBool); // ❌ No null check first
            }).toThrow('isNull()/isNotNull() must be called before value()');

            // got circuit break because nullable violate procedure , so value never used
            expect(() => {
                normalBool.finish();
            }).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value');
            // verify never done violated procedural use , got error when finished call
            expect(() => {
                nullableBool.finish();
            }).toThrow('use data properly at least for verifying: use isNull()/isNotNull()');
        });

        test('should throw when chaining with null nullable boolean', () => {
            const nullBool = new NullableBoolean(null);
            const normalBool = new NotNullBoolean(true);

            expect(nullBool.isNull()).toBe(true);

            expect(() => {
                nullBool.and(normalBool); // ❌ Trying to use null value
            }).toThrow('data is null :isNull()/isNotNull() must be used properly to avoid null');

            // got circuit break because nullable violate procedure , so value never used
            expect(() => {
                normalBool.finish();
            }).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value');
            // verify never done violated procedural use , got error when finished call
            nullBool.finish() // handle null gracefully should not throw
        });

        test('should throw when nullable verified but never used in chaining', () => {
            const nullableBool = new NullableBoolean(true);

            nullableBool.isNotNull(); // ✅ Verified

            // ❌ But never used in any operation
            expect(() => {
                nullableBool.finish();
            }).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value');
        });

        test('should throw when notNull boolean never used after chaining creation', () => {
            const a = new NotNullBoolean(true);
            const b = new NotNullBoolean(false);

            const result = a.and(b); // ✅ Created but...

            // ❌ Result never used
            expect(() => {
                result.finish();
            }).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value');

            a.finish();
            b.finish();
        });

        test('should handle short-circuit in AND chaining with null', () => {
            const nullBool = new NullableBoolean(null);
            const normalBool = new NotNullBoolean(true);

            expect(nullBool.isNull()).toBe(true);

            // Should short-circuit - normalBool should never be accessed
            // This tests that the chain breaks properly
            expect(nullBool.isNull()).toBe(true);

            nullBool.finish();
            expect(() => normalBool.finish()).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value')
        });

        test('should handle complex invalid chaining scenario', () => {
            const a = new NotNullBoolean(true);
            const b = new NullableBoolean(false);
            const c = new NotNullBoolean(true);

            // b is nullable but never verified
            expect(() => {
                a.and(b.or(c)); // ❌ b not verified
            }).toThrow('isNull()/isNotNull() must be called before value()');
            // b got error at finish because violate verifying nullable data
            expect(() => b.finish()).toThrow('use data properly at least for verifying: use isNull()/isNotNull()');
            // because b is throwing at first place , a & c never operate which , a & c never used
            // happened because b is Nullable but never been verified
            expect(() => a.finish()).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value'); // ✅ a never used!
            expect(() => c.finish()).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value'); // ✅ c never used!
        });
    });

    // 🔄 MULTIPLE INSTANCE CHAINING
    describe('Multiple Instance Chaining Scenarios', () => {

        test('should handle independent chaining with multiple nullable booleans', () => {
            const userLoggedIn = new NullableBoolean(true);
            const hasPermission = new NullableBoolean(false);
            const isActive = new NotNullBoolean(true);

            expect(userLoggedIn.isNotNull()).toBe(true);
            expect(hasPermission.isNotNull()).toBe(true);

            const accessGranted = userLoggedIn.and(hasPermission.or(isActive));

            expect(accessGranted.condition()).toBe(true);

            userLoggedIn.finish();
            hasPermission.finish();
            isActive.finish();
            accessGranted.finish();
        });

        test('should throw with mixed valid/invalid usage in complex chain', () => {
            const a = new NullableBoolean(true);
            const b = new NotNullBoolean(false);
            const c = new NullableBoolean(null);
            const d = new NotNullBoolean(true);

            expect(a.isNotNull()).toBe(true);
            expect(c.isNull()).toBe(true);

            // a and b are valid, c is null but verified
            const firstChain = a.and(b);
            expect(firstChain.condition()).toBe(false);

            // Should throw if trying to use c in operations
            expect(() => {
                c.and(d);
            }).toThrow('data is null :isNull()/isNotNull() must be used properly to avoid null');

            a.finish();
            b.finish();
            c.finish();
            expect(() => d.finish()).toThrow('value exist but never used: use yes()/no()/conditon() for notNull data value'); // ✅ d never used!
            firstChain.finish();
        });
    });
});