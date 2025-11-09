import { NullableBoolean, NotNullBoolean } from '../src/common/boolean.wrapper';
import { NullableEmail, NotNullEmail } from '../src/common/email';
import { NullableNumber, NotNullNumber } from '../src/common/number.wrapper';
import { NullableString, NotNullString } from '../src/common/string.wrapper';
import { NullableUUID, FreshUUID } from '../src/common/uuid';

describe('Wrapper finish() methods comprehensive tests', () => {

    // ==================== NULLABLE TYPES ====================
    describe('Nullable Types finish() behavior', () => {
        test('NullableString - should succeed when null verified and not used', () => {
            const str = new NullableString(null);
            str.isNull(); // Verify null
            expect(() => str.finish()).not.toThrow();
        });

        test('NullableString - should succeed when not-null verified and used', () => {
            const str = new NullableString("hello");
            str.isNotNull(); // Verify not null
            str.value(); // Use value
            expect(() => str.finish()).not.toThrow();
        });

        test('NullableString - should throw when never verified', () => {
            const str = new NullableString("test");
            expect(() => str.finish()).toThrow("use data properly at least for verifying");
        });

        test('NullableString - should throw when verified not-null but never used', () => {
            const str = new NullableString("world");
            str.isNotNull(); // Verify but never use value
            expect(() => str.finish()).toThrow("value exist but never used");
        });

        test('NullableNumber - should succeed when null verified and not used', () => {
            const num = new NullableNumber(null);
            num.isNull();
            expect(() => num.finish()).not.toThrow();
        });

        test('NullableNumber - should succeed when not-null verified and used', () => {
            const num = new NullableNumber(42);
            num.isNotNull();
            num.value();
            expect(() => num.finish()).not.toThrow();
        });

        test('NullableNumber - should throw when verified not-null but never used', () => {
            const num = new NullableNumber(100);
            num.isNotNull();
            expect(() => num.finish()).toThrow("value exist but never used");
        });

        test('NullableBoolean - should succeed when null verified and not used', () => {
            const bool = new NullableBoolean(null);
            bool.isNull();
            expect(() => bool.finish()).not.toThrow();
        });

        test('NullableBoolean - should succeed when not-null verified and used via condition()', () => {
            const bool = new NullableBoolean(true);
            bool.isNotNull();
            bool.condition();
            expect(() => bool.finish()).not.toThrow();
        });

        test('NullableBoolean - should succeed when not-null verified and used via yes()', () => {
            const bool = new NullableBoolean(false);
            bool.isNotNull();
            bool.yes();
            expect(() => bool.finish()).not.toThrow();
        });

        test('NullableBoolean - should succeed when not-null verified and used via no()', () => {
            const bool = new NullableBoolean(true);
            bool.isNotNull();
            bool.no();
            expect(() => bool.finish()).not.toThrow();
        });

        test('NullableBoolean - should throw when verified not-null but never used', () => {
            const bool = new NullableBoolean(false);
            bool.isNotNull();
            expect(() => bool.finish()).toThrow("value exist but never used");
        });

        test('NullableUUID - should succeed when null verified and not used', () => {
            const uuid = new NullableUUID(null);
            uuid.isNull();
            expect(() => uuid.finish()).not.toThrow();
        });

        test('NullableUUID - should succeed when not-null verified and used', () => {
            const uuid = new NullableUUID("f47ac10b-58cc-4372-a567-0e02b2c3d479");
            uuid.isNotNull();
            uuid.value();
            expect(() => uuid.finish()).not.toThrow();
        });

        test('NullableUUID - should throw when verified not-null but never used', () => {
            const uuid = new NullableUUID("f47ac10b-58cc-4372-a567-0e02b2c3d479");
            uuid.isNotNull();
            expect(() => uuid.finish()).toThrow("value exist but never used");
        });

        test('NullableEmail - should succeed when null verified and not used', () => {
            const email = new NullableEmail(null);
            email.isNull();
            expect(() => email.finish()).not.toThrow();
        });

        test('NullableEmail - should succeed when not-null verified and used', () => {
            const email = new NullableEmail("test@example.com");
            email.isNotNull();
            email.value();
            expect(() => email.finish()).not.toThrow();
        });

        test('NullableEmail - should throw when verified not-null but never used', () => {
            const email = new NullableEmail("user@domain.com");
            email.isNotNull();
            expect(() => email.finish()).toThrow("value exist but never used");
        });
    });

    // ==================== NOT-NULL TYPES ====================
    describe('NotNull Types finish() behavior', () => {
        test('NotNullString - should succeed when value used', () => {
            const str = new NotNullString("hello");
            str.value();
            expect(() => str.finish()).not.toThrow();
        });

        test('NotNullString - should throw when value never used', () => {
            const str = new NotNullString("world");
            expect(() => str.finish()).toThrow("value exist but never used");
        });

        test('NotNullNumber - should succeed when value used', () => {
            const num = new NotNullNumber(42);
            num.value();
            expect(() => num.finish()).not.toThrow();
        });

        test('NotNullNumber - should throw when value never used', () => {
            const num = new NotNullNumber(100);
            expect(() => num.finish()).toThrow("value exist but never used");
        });

        test('NotNullBoolean - should succeed when value used via condition()', () => {
            const bool = new NotNullBoolean(true);
            bool.condition();
            expect(() => bool.finish()).not.toThrow();
        });

        test('NotNullBoolean - should succeed when value used via yes()', () => {
            const bool = new NotNullBoolean(false);
            bool.yes();
            expect(() => bool.finish()).not.toThrow();
        });

        test('NotNullBoolean - should succeed when value used via no()', () => {
            const bool = new NotNullBoolean(true);
            bool.no();
            expect(() => bool.finish()).not.toThrow();
        });

        test('NotNullBoolean - should throw when value never used', () => {
            const bool = new NotNullBoolean(false);
            expect(() => bool.finish()).toThrow("value exist but never used");
        });

        test('FreshUUID - should succeed when value used', () => {
            const uuid = new FreshUUID();
            uuid.value();
            expect(() => uuid.finish()).not.toThrow();
        });

        test('FreshUUID - should throw when value never used', () => {
            const uuid = new FreshUUID();
            expect(() => uuid.finish()).toThrow("value exist but never used");
        });

        test('NotNullEmail - should succeed when value used', () => {
            const email = new NotNullEmail("test@example.com");
            email.value();
            expect(() => email.finish()).not.toThrow();
        });

        test('NotNullEmail - should throw when value never used', () => {
            const email = new NotNullEmail("user@domain.com");
            expect(() => email.finish()).toThrow("value exist but never used");
        });
    });

    // ==================== EDGE CASES ====================
    describe('Finish() Edge Cases', () => {
        test('NullableString - multiple verifications should not affect finish()', () => {
            const str = new NullableString("test");
            str.isNotNull();
            str.isNull(); // Reverse verify
            str.isNotNull(); // Verify again
            str.value();
            expect(() => str.finish()).not.toThrow();
        });

        test('NullableBoolean - mixed method usage should mark as used', () => {
            const bool = new NullableBoolean(true);
            bool.isNotNull();
            bool.yes(); // Use once
            bool.no();  // Use again - should still work
            expect(() => bool.finish()).not.toThrow();
        });

        test('NotNullBoolean - any usage method should prevent finish() error', () => {
            const bool = new NotNullBoolean(false);
            bool.yes(); // Use once
            // Don't use other methods
            expect(() => bool.finish()).not.toThrow();
        });

        test('Multiple instances should not interfere with each other', () => {
            const str1 = new NullableString("one");
            const str2 = new NullableString(null);
            const num = new NotNullNumber(42);

            str1.isNotNull();
            str1.value();
            str2.isNull();
            num.value();

            expect(() => str1.finish()).not.toThrow();
            expect(() => str2.finish()).not.toThrow();
            expect(() => num.finish()).not.toThrow();
        });

        test('Finish should be idempotent - can be called multiple times', () => {
            const str = new NullableString("test");
            str.isNotNull();
            str.value();

            // First call
            expect(() => str.finish()).not.toThrow();
            // Second call - should still not throw
            expect(() => str.finish()).not.toThrow();
        });

        test('Empty string should be considered as used when accessed', () => {
            const str = new NullableString("");
            str.isNotNull();
            str.value(); // Access empty string
            expect(() => str.finish()).not.toThrow();
        });

        test('Zero number should be considered as used when accessed', () => {
            const num = new NullableNumber(0);
            num.isNotNull();
            num.value(); // Access zero
            expect(() => num.finish()).not.toThrow();
        });

        test('False boolean should be considered as used when accessed', () => {
            const bool = new NullableBoolean(false);
            bool.isNotNull();
            bool.condition(); // Access false
            expect(() => bool.finish()).not.toThrow();
        });
    });

    // ==================== CROSS-WRAPPER CONSISTENCY ====================
    describe('Cross-wrapper finish() consistency', () => {
        test('All nullable types should have same finish() behavior for null case', () => {
            const nullables = [
                new NullableString(null),
                new NullableNumber(null),
                new NullableBoolean(null),
                new NullableUUID(null),
                new NullableEmail(null)
            ];

            nullables.forEach(nullable => {
                nullable.isNull();
                expect(() => nullable.finish()).not.toThrow();
            });
        });

        test('All not-null types should throw when value never used', () => {
            const notNulls = [
                () => new NotNullString("test"),
                () => new NotNullNumber(42),
                () => new NotNullBoolean(true),
                () => new FreshUUID(),
                () => new NotNullEmail("test@example.com")
            ];

            notNulls.forEach(creator => {
                const instance = creator();
                expect(() => instance.finish()).toThrow("value exist but never used");
            });
        });

        test('All not-null types should succeed when value used', () => {
            const notNulls = [
                () => { const s = new NotNullString("test"); s.value(); return s; },
                () => { const n = new NotNullNumber(42); n.value(); return n; },
                () => { const b = new NotNullBoolean(true); b.condition(); return b; },
                () => { const u = new FreshUUID(); u.value(); return u; },
                () => { const e = new NotNullEmail("test@example.com"); e.value(); return e; }
            ];

            notNulls.forEach(creator => {
                const instance = creator();
                expect(() => instance.finish()).not.toThrow();
            });
        });
    });
});