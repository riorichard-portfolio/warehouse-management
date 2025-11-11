import { OptStr, Str } from "./primitive.abstractions/primitive.wrapper.abstraction"

const errorNullNotVerified = "isNull()/isNotNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForString = "value in NotNullString MUST be string"
const errorDataIsNeverUsed = "use data properly at least for verifying: use isNull()/isNotNull()"
const errorValueExistButNeverUsed = "value exist but never used: use value() for notNull data value"

export class NullableString implements OptStr {
    private readonly stringData: string | null = null
    private readonly isStringDataNull: boolean = true
    private nullValueNotVerified: boolean = true
    private valueNotUsed: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData === 'string') {
            this.stringData = unknownData
            this.isStringDataNull = false
        }
    }
    public value(): string {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.stringData === 'string') {
            this.valueNotUsed = false
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
    public finish(): void {
        if (this.nullValueNotVerified) throw new Error(errorDataIsNeverUsed)
        else if (!this.isStringDataNull && this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
}

export class NotNullString implements Str {
    private readonly stringData: string
    private valueNotUsed: boolean = true
    constructor(stringData: string) {
        if (typeof stringData === 'string') {
            this.stringData = stringData
        } else {
            throw new Error(errorInvalidTypeForString)
        }
    }
    public value(): string {
        this.valueNotUsed = false
        return this.stringData
    }
    public finish(): void {
        if (this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
}