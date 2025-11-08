import { OptNum, Num } from "@/common/primitive.wrapper.abstraction"

const errorNullNotVerified = "isNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForNumber = "value in NotNullNumber MUST be number"
const errorNumberIsInfinity = "value in NotNullNumber MUST be finite number"

export class NullableNumber implements OptNum {
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

export class NotNullNumber implements Num {
    private readonly numberData: number
    constructor(numberData: number) {
        if (typeof numberData === 'number' && this.isNotNaNNumber(numberData)) {
            if (this.isNumberNotInfinity(numberData)) {
                this.numberData = numberData
            } else {
                throw new Error(errorNumberIsInfinity)
            }
        } else {
            throw new Error(errorInvalidTypeForNumber)
        }
    }
    private isNotNaNNumber(numberData: number): boolean {
        return !Number.isNaN(numberData)
    }
    private isNumberNotInfinity(unknownNumberData: number) {
        return isFinite(unknownNumberData)
    }
    public value(): number {
        return this.numberData
    }
}