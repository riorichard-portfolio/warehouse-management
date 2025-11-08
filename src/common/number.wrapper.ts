import Constant from '@/common/constants'

const errorNullNotVerified = "isNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isValidValue() must be used properly to avoid null"

export default class NullableDecimal implements Constant.NullableDecimal {
    private readonly numberData: number | null = null
    private readonly isNumberDataNull: boolean = true
    private nullValueNotVerified: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData === 'number' && this.isNotNaNNumber(unknownData)) {
            if (this.isNumberNotInfinity(unknownData)) {
                this.numberData = unknownData
                this.isNumberDataNull = false
            }
        }
    }
    private isNotNaNNumber(unknownData: unknown): boolean {
        return !Number.isNaN(unknownData)
    }
    private isNumberNotInfinity(unknownNumberData: number) {
        return isFinite(unknownNumberData)
    }
    public value(): number {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.numberData === 'number') {
            return this.numberData
        } else {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        }
    }
    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isNumberDataNull
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isNumberDataNull
    }
}