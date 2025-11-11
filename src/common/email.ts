import { OptEmail, Email } from "./primitive.abstractions/primitive.unique.abstraction";

const emailRegex = /^(?!\.)(?!.*\.$)(?!.*\.\.)[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const errorNullNotVerified = "isNull()/isNotNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForEmail = "value in NotNullEmail MUST be string"
const errorStringIsNotAnEmail = "value in NotNullEmail MUST be valid email string"
const errorDataIsNeverUsed = "use data properly at least for verifying: use isNull()/isNotNull()"
const errorValueExistButNeverUsed = "value exist but never used: use value() for notNull data value"

export class NullableEmail implements OptEmail {
    private readonly email: string | null = null;
    private readonly isEmailNull: boolean = true
    private nullValueNotVerified: boolean = true;
    private valueNotUsed: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData == 'string') {
            if (this.isEmailValid(unknownData)) {
                this.email = unknownData
                this.isEmailNull = false
            }
        }
    }
    private isEmailValid(unknownString: string): boolean {
        return emailRegex.test(unknownString)
    }

    public value(): string {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.email === 'string') {
            this.valueNotUsed = false
            return this.email
        } else {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        }
    }

    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isEmailNull
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isEmailNull
    }
    public finish(): void {
        if (this.nullValueNotVerified) throw new Error(errorDataIsNeverUsed)
        else if (!this.isEmailNull && this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
}

export class NotNullEmail implements Email {
    private readonly email: string
    private valueNotUsed: boolean = true
    constructor(stringData: string) {
        if (typeof stringData === 'string') {
            if (this.isEmailValid(stringData)) {
                this.email = stringData
            } else {
                throw new Error(errorStringIsNotAnEmail)
            }
        } else {
            throw new Error(errorInvalidTypeForEmail)
        }
    }
    private isEmailValid(unknownString: string): boolean {
        return emailRegex.test(unknownString)
    }
    public value(): string {
        this.valueNotUsed = false
        return this.email
    }
    public finish(): void {
        if (this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
}