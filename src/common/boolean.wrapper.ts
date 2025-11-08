import Constant from '@/common/constants'

const errorNullNotVerified = "isNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isValidValue() must be used properly to avoid null"

export class NullableCondition implements Constant.NullableCondition {
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