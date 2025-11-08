import Constant from '@/common/constants'

const errorNullNotVerified = "isNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForString = "value in NotNullCharacters MUST be string"

export class NullableCharacters implements Constant.NullableCharacters {
    private readonly stringData: string | null = null
    private readonly isStringDataNull: boolean = true
    private nullValueNotVerified: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData === 'string') {
            this.stringData = unknownData
            this.isStringDataNull = false
        }
    }
    public value(): string {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.stringData === 'string') {
            return this.stringData
        } else {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        }
    }
    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isStringDataNull
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isStringDataNull
    }
}

export class NotNullCharacters implements Constant.NotNullCharacters {
    private readonly stringData: string
    constructor(stringData: string) {
        if (typeof stringData === 'string') {
            this.stringData = stringData
        } else {
            throw new Error(errorInvalidTypeForString)
        }
    }
    public value(): string {
        return this.stringData
    }
}