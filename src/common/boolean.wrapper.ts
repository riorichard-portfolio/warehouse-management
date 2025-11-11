import { OptBool, Bool } from "@/common/primitive.abstractions/primitive.wrapper.abstraction"

const errorNullNotVerified = "isNull()/isNotNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForBoolean = "value in NotNullBoolean MUST be boolean"
const errorDataIsNeverUsed = "use data properly at least for verifying: use isNull()/isNotNull()"
const errorValueExistButNeverUsed = "value exist but never used: use value() for notNull data value"

export class NullableBoolean implements OptBool {
    private readonly booleanData: boolean | null = null
    private nullValueNotVerified: boolean = true
    private valueNotUsed: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData === 'boolean') {
            this.booleanData = unknownData
        }
    }
    private getCondition(): boolean {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.booleanData === 'boolean') {
            this.valueNotUsed = false
            return this.booleanData
        } else {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        }
    }
    private isBooleanDataNull(): boolean {
        return this.booleanData === null
    }
    public condition(): boolean {
        return this.getCondition()
    }
    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isBooleanDataNull()
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isBooleanDataNull()
    }
    public yes(): boolean {
        return this.getCondition()
    }
    public no(): boolean {
        return !this.getCondition()
    }
    public finish(): void {
        if (this.nullValueNotVerified) throw new Error(errorDataIsNeverUsed)
        else if (!this.isBooleanDataNull() && this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
    public and(booleanData: Bool): Bool {
        return new NotNullBoolean(this.getCondition() && booleanData.condition())
    }
    public or(booleanData: Bool): Bool {
        return new NotNullBoolean(this.getCondition() || booleanData.condition())
    }
}

export class NotNullBoolean implements Bool {
    private readonly booleanData: boolean
    private valueNotUsed: boolean = true
    constructor(booleanData: boolean) {
        if (typeof booleanData === 'boolean') {
            this.booleanData = booleanData
        } else {
            throw new Error(errorInvalidTypeForBoolean)
        }
    }
    private getConditionAndFlagUsed(): boolean {
        this.valueNotUsed = false
        return this.booleanData
    }
    public condition(): boolean {
        return this.getConditionAndFlagUsed()
    }
    public yes(): boolean {
        return this.getConditionAndFlagUsed()
    }
    public no(): boolean {
        return !this.getConditionAndFlagUsed()
    }
    public finish(): void {
        if (this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
    public and(booleanData: Bool): Bool {
        return new NotNullBoolean(this.getConditionAndFlagUsed() && booleanData.condition())
    }
    public or(booleanData: Bool): Bool {
        return new NotNullBoolean(this.getConditionAndFlagUsed() || booleanData.condition())
    }
}