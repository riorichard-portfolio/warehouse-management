import { OptEmail, Email } from "@/common/primitive.abstractions/primitive.unique.abstraction";

const emailRegex = /^(?!\.)(?!.*\.$)(?!.*\.\.)[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const errorNullNotVerified = "isNull()/isNotNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForEmail = "value in NotNullEmail MUST be string"
const errorStringIsNotAnEmail = "value in NotNullEmail MUST be valid email string"

export class NullableEmail implements OptEmail {
    private readonly email: string | null = null;
    private readonly isEmailNull: boolean = true
    private nullValueNotVerified: boolean = true;

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
}

export class NotNullEmail implements Email {
    private readonly email: string
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
        return this.email
    }
}