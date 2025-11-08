import { OptBool, Bool } from "@/common/primitive.abstractions/primitive.wrapper.abstraction"

const errorNullNotVerified = "isNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForBoolean = "value in NotNullBoolean MUST be boolean"

export class NullableBoolean implements OptBool {
    private readonly booleanData: boolean | null = null
    private readonly isBooleanDataNull: boolean = true
    private nullValueNotVerified: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData === 'boolean') {
            this.booleanData = unknownData
            this.isBooleanDataNull = false
        }
    }
    private getCondition(): boolean {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.booleanData === 'boolean') {
            return this.booleanData
        } else {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        }
    }
    public condition(): boolean {
        return this.getCondition()
    }
    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isBooleanDataNull
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isBooleanDataNull
    }
    public yes(): boolean {
        return this.getCondition()
    }
    public no(): boolean {
        return !this.getCondition()
    }
}

export class NotNullBoolean implements Bool {
    private readonly booleanData: boolean
    constructor(booleanData: boolean) {
        if(typeof booleanData === 'boolean') {
            this.booleanData = booleanData
        } else{
            throw new Error (errorInvalidTypeForBoolean)
        }
    }
    public condition(): boolean {
        return this.booleanData
    }
    public yes(): boolean {
        return this.booleanData
    }
    public no(): boolean {
        return !this.booleanData
    }
}