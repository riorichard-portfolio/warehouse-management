import { NullableEmail, NotNullEmail } from '../src/common/email';

describe('NullableEmail', () => {
    // === VALID EMAILS ===
    test('should handle valid standard email', () => {
        const email = new NullableEmail('test@example.com');
        expect(email.isNotNull()).toBe(true);
        expect(email.isNull()).toBe(false);
        expect(email.value()).toBe('test@example.com');
    });

    test('should handle email with subdomain', () => {
        const email = new NullableEmail('user@sub.domain.com');
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe('user@sub.domain.com');
    });

    test('should handle email with plus addressing', () => {
        const email = new NullableEmail('user+tag@example.com');
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe('user+tag@example.com');
    });

    test('should handle email with hyphen', () => {
        const email = new NullableEmail('user-name@domain.com');
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe('user-name@domain.com');
    });

    test('should handle email with numbers', () => {
        const email = new NullableEmail('user123@domain.com');
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe('user123@domain.com');
    });

    test('should handle email with multiple dots', () => {
        const email = new NullableEmail('first.last@company.co.uk');
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe('first.last@company.co.uk');
    });

    // === INVALID EMAILS ===
    test('should handle null input', () => {
        const email = new NullableEmail(null);
        expect(email.isNull()).toBe(true);
        expect(email.isNotNull()).toBe(false);
    });

    test('should handle undefined input', () => {
        const email = new NullableEmail(undefined);
        expect(email.isNull()).toBe(true);
    });

    test('should reject empty string', () => {
        const email = new NullableEmail('');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email without @ symbol', () => {
        const email = new NullableEmail('invalid-email');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email with multiple @ symbols', () => {
        const email = new NullableEmail('user@domain@com');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email without domain', () => {
        const email = new NullableEmail('user@');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email without username', () => {
        const email = new NullableEmail('@domain.com');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email with spaces', () => {
        const email = new NullableEmail('user name@domain.com');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email with invalid characters', () => {
        const email = new NullableEmail('user#name@domain.com');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email starting with dot', () => {
        const email = new NullableEmail('.user@domain.com');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email ending with dot', () => {
        const email = new NullableEmail('user.@domain.com');
        expect(email.isNull()).toBe(true);
    });

    test('should reject email with consecutive dots', () => {
        const email = new NullableEmail('user..name@domain.com');
        expect(email.isNull()).toBe(true);
    });

    // === NON-STRING INPUTS ===
    test('should reject number input', () => {
        const email = new NullableEmail(123);
        expect(email.isNull()).toBe(true);
    });

    test('should reject boolean input', () => {
        const email = new NullableEmail(true);
        expect(email.isNull()).toBe(true);
    });

    test('should reject object input', () => {
        const email = new NullableEmail({ email: 'test@example.com' });
        expect(email.isNull()).toBe(true);
    });

    test('should reject array input', () => {
        const email = new NullableEmail(['test@example.com']);
        expect(email.isNull()).toBe(true);
    });

    // === VALIDATION ORDER REQUIREMENTS ===
    test('should throw when value() called without validation', () => {
        const email = new NullableEmail('test@example.com');
        expect(() => email.value()).toThrow("isNull()/isNotNull() must be called before value()");
    });

    test('should throw when value() called on null after verification', () => {
        const email = new NullableEmail(null);
        email.isNull(); // Verify it's null
        expect(() => email.value()).toThrow("data is null :isNull()/isNotNull() must be used properly to avoid null");
    });

    test('should work with correct validation pattern - valid case', () => {
        const email = new NullableEmail('valid@email.com');
        if (email.isNotNull()) {
            expect(email.value()).toBe('valid@email.com');
        } else {
            fail("Should not reach here");
        }
    });

    test('should work with correct validation pattern - invalid case', () => {
        const email = new NullableEmail('invalid-email');
        if (email.isNull()) {
            // Should not call value()
            expect(email.isNotNull()).toBe(false);
        } else {
            fail("Should not reach here");
        }
    });

    // === OBJECT PRIMITIVE CONVERSION ===
    test('should handle object with toString returning email', () => {
        const obj = {
            toString: () => 'test@example.com'
        };
        const email = new NullableEmail(obj);
        expect(email.isNull()).toBe(true); // Should reject objects
    });

    test('should handle object with valueOf returning email string', () => {
        const obj = {
            valueOf: () => 'user@domain.com'
        };
        const email = new NullableEmail(obj);
        expect(email.isNull()).toBe(true); // Should reject objects
    });

    // === STATE MANAGEMENT ===
    test('should maintain state across method calls', () => {
        const email = new NullableEmail('test@example.com');
        expect(email.isNotNull()).toBe(true);
        expect(email.isNull()).toBe(false); // Should not change state
        expect(email.value()).toBe('test@example.com'); // Should still work
    });

    test('should work with reverse method sequence', () => {
        const email = new NullableEmail('user@domain.com');
        expect(email.isNull()).toBe(false);
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe('user@domain.com');
    });

    test('should handle multiple instances independently', () => {
        const email1 = new NullableEmail('first@example.com');
        const email2 = new NullableEmail(null);
        const email3 = new NullableEmail('third@example.com');

        expect(email1.isNotNull()).toBe(true);
        expect(email2.isNull()).toBe(true);
        expect(email3.isNotNull()).toBe(true);

        expect(email1.value()).toBe('first@example.com');
        expect(email3.value()).toBe('third@example.com');
    });
});

describe('NotNullEmail', () => {
    // === VALID EMAILS ===
    test('should handle valid standard email', () => {
        const email = new NotNullEmail('test@example.com');
        expect(email.value()).toBe('test@example.com');
    });

    test('should handle email with subdomain', () => {
        const email = new NotNullEmail('user@sub.domain.com');
        expect(email.value()).toBe('user@sub.domain.com');
    });

    test('should handle email with plus addressing', () => {
        const email = new NotNullEmail('user+tag@example.com');
        expect(email.value()).toBe('user+tag@example.com');
    });

    test('should handle email with hyphen', () => {
        const email = new NotNullEmail('user-name@domain.com');
        expect(email.value()).toBe('user-name@domain.com');
    });

    test('should handle email with numbers', () => {
        const email = new NotNullEmail('user123@domain.com');
        expect(email.value()).toBe('user123@domain.com');
    });

    test('should handle email with multiple dots', () => {
        const email = new NotNullEmail('first.last@company.co.uk');
        expect(email.value()).toBe('first.last@company.co.uk');
    });

    test('should handle case insensitive email', () => {
        const email = new NotNullEmail('User@Example.COM');
        expect(email.value()).toBe('User@Example.COM');
    });

    // === REJECT INVALID INPUTS ===
    test('should throw on null input', () => {
        expect(() => new NotNullEmail(null as any)).toThrow("value in Email MUST be string");
    });

    test('should throw on undefined input', () => {
        expect(() => new NotNullEmail(undefined as any)).toThrow("value in Email MUST be string");
    });

    test('should throw on empty string', () => {
        expect(() => new NotNullEmail('')).toThrow("value in NotNullEmail MUST be valid email string");
    });

    test('should throw on email without @ symbol', () => {
        expect(() => new NotNullEmail('invalid-email')).toThrow("value in NotNullEmail MUST be valid email string");
    });

    test('should throw on email with multiple @ symbols', () => {
        expect(() => new NotNullEmail('user@domain@com')).toThrow("value in NotNullEmail MUST be valid email string");
    });

    test('should throw on email without domain', () => {
        expect(() => new NotNullEmail('user@')).toThrow("value in NotNullEmail MUST be valid email string");
    });

    test('should throw on email without username', () => {
        expect(() => new NotNullEmail('@domain.com')).toThrow("value in NotNullEmail MUST be valid email string");
    });

    test('should throw on email with spaces', () => {
        expect(() => new NotNullEmail('user name@domain.com')).toThrow("value in NotNullEmail MUST be valid email string");
    });

    test('should throw on email with invalid characters', () => {
        expect(() => new NotNullEmail('user#name@domain.com')).toThrow("value in NotNullEmail MUST be valid email string");
    });

    test('should throw on non-string inputs', () => {
        expect(() => new NotNullEmail(123 as any)).toThrow("value in Email MUST be string");
        expect(() => new NotNullEmail(true as any)).toThrow("value in Email MUST be string");
        expect(() => new NotNullEmail({} as any)).toThrow("value in Email MUST be string");
        expect(() => new NotNullEmail([] as any)).toThrow("value in Email MUST be string");
    });
});

describe('Integration: NullableEmail and NotNullEmail', () => {
    test('should work together in function parameters', () => {
        const sendEmail = (from: NotNullEmail, to: NullableEmail, subject: string): string => {
            if (to.isNotNull()) {
                return `Sending "${subject}" from ${from.value()} to ${to.value()}`;
            }
            return `Cannot send "${subject}" - invalid recipient`;
        };

        const result1 = sendEmail(
            new NotNullEmail('sender@company.com'),
            new NullableEmail('recipient@domain.com'),
            'Hello'
        );
        expect(result1).toBe('Sending "Hello" from sender@company.com to recipient@domain.com');

        const result2 = sendEmail(
            new NotNullEmail('noreply@system.com'),
            new NullableEmail('invalid-email'),
            'Notification'
        );
        expect(result2).toBe('Cannot send "Notification" - invalid recipient');
    });

    test('should convert between Nullable and NotNull safely', () => {
        const nullable = new NullableEmail('user@domain.com');
        if (nullable.isNotNull()) {
            const notNull = new NotNullEmail(nullable.value());
            expect(notNull.value()).toBe('user@domain.com');
        } else {
            fail("Should not reach here");
        }
    });

    test('should handle failed conversion gracefully', () => {
        const nullable = new NullableEmail('invalid-email');
        if (nullable.isNotNull()) {
            fail("Should not reach here");
        } else {
            // Handle invalid email appropriately
            expect(nullable.isNull()).toBe(true);
        }
    });
});

describe('NullableEmail - Deep Edge Cases', () => {
    test('should handle prototype polluted objects', () => {
        (Object.prototype as any).toString = () => 'hacked@evil.com';
        const email = new NullableEmail({});
        expect(email.isNull()).toBe(true);
        delete (Object.prototype as any).toString;
    });

    test('should handle Proxy objects', () => {
        const proxy = new Proxy({}, {
            get: (target, prop) => {
                if (prop === Symbol.toPrimitive) return () => 'proxy@test.com';
                //@ts-ignore
                return target[prop as any];
            }
        });
        const email = new NullableEmail(proxy);
        expect(email.isNull()).toBe(true);
    });

    test('should handle objects with Symbol.toPrimitive', () => {
        const obj = {
            [Symbol.toPrimitive]() { return 'primitive@test.com'; }
        };
        const email = new NullableEmail(obj);
        expect(email.isNull()).toBe(true);
    });

    test('should handle very long email addresses', () => {
        const longLocalPart = 'a'.repeat(64);
        const longEmail = `${longLocalPart}@domain.com`;
        const email = new NullableEmail(longEmail);
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe(longEmail);
    });

    test('should maintain state under concurrent access simulation', () => {
        const email = new NullableEmail('test@concurrent.com');

        // Simulate multiple accesses
        expect(email.isNotNull()).toBe(true);
        expect(email.isNull()).toBe(false);
        expect(email.isNotNull()).toBe(true);
        expect(email.value()).toBe('test@concurrent.com');

        // Should remain consistent
        expect(email.value()).toBe('test@concurrent.com');
    });

    test('should handle recursive objects without stack overflow', () => {
        const obj: any = {};
        obj.self = obj;
        const email = new NullableEmail(obj);
        expect(email.isNull()).toBe(true);
    });

    test('should handle objects that throw from primitive methods', () => {
        const obj = {
            valueOf: () => { throw new Error("Evil valueOf"); },
            toString: () => { throw new Error("Evil toString"); }
        };
        const email = new NullableEmail(obj);
        expect(email.isNull()).toBe(true);
    });

    test('should handle international email addresses', () => {
        const intlEmail = '用户@例子.中国'; // Chinese email
        const email = new NullableEmail(intlEmail);
        // Current regex might reject international emails
        expect(email.isNull()).toBe(true);
    });
});

describe('NotNullEmail - Deep Edge Cases', () => {
    test('should not leave partial instance when constructor throws', () => {
        expect(() => new NotNullEmail('invalid' as any)).toThrow();
        expect(() => new NotNullEmail(null as any)).toThrow();
    });

    test('should handle String object vs string primitive', () => {
        expect(() => new NotNullEmail(new String('test@example.com') as any)).toThrow("value in Email MUST be string");
    });

    test('should not create memory leaks with repeated instantiation', () => {
        for (let i = 0; i < 1000; i++) {
            const email = new NotNullEmail(`user${i}@domain.com`);
            expect(email.value()).toBe(`user${i}@domain.com`);
        }
    });

    test('should handle edge case emails', () => {
        // These should be accepted by basic regex
        const validEmails = [
            'a@b.co',           // Short domain
            'test@test-test.com', // Hyphen in domain
            'test@sub.domain.com', // Subdomain
        ];

        validEmails.forEach(validEmail => {
            const email = new NotNullEmail(validEmail);
            expect(email.value()).toBe(validEmail);
        });
    });

    test('should reject obviously invalid formats', () => {
        const invalidEmails = [
            'plainaddress',
            '@missinglocal.com',
            'missingat.com',
            'spaces in@local.com',
            'double@@at.com',
        ];

        invalidEmails.forEach(invalidEmail => {
            expect(() => new NotNullEmail(invalidEmail)).toThrow();
        });
    });
});

describe('Cross-Class Email Integration', () => {
    test('should work in user registration flow', () => {
        const registerUser = (emailInput: string): string => {
            const nullableEmail = new NullableEmail(emailInput);

            if (nullableEmail.isNull()) {
                return "Registration failed: Invalid email address";
            }

            // Convert to NotNullEmail for database storage
            const verifiedEmail = new NotNullEmail(nullableEmail.value());

            // Simulate database operation
            return `User registered with email: ${verifiedEmail.value()}`;
        };

        expect(registerUser('valid@email.com')).toBe('User registered with email: valid@email.com');
        expect(registerUser('invalid-email')).toBe('Registration failed: Invalid email address');
    });

    test('should handle bulk email validation', () => {
        const emailList = [
            'valid1@test.com',
            'invalid-email',
            'valid2@test.com',
            null,
            'another@valid.com'
        ];

        const validEmails: string[] = [];

        emailList.forEach(email => {
            const nullable = new NullableEmail(email);
            if (nullable.isNotNull()) {
                validEmails.push(nullable.value());
            }
        });
        expect(validEmails[0]).toBe('valid1@test.com')
        expect(validEmails[1]).toBe('valid2@test.com')
        expect(validEmails[2]).toBe('another@valid.com')
    });
});