import { OptNum, Num, Bool } from "./primitive.abstractions/primitive.wrapper.abstraction"
import { NotNullBoolean } from "./boolean.wrapper"

const errorNullNotVerified = "isNull()/isNotNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorInvalidTypeForNumber = "value in NotNullNumber MUST be number"
const errorNumberIsInfinity = "value in NotNullNumber MUST be finite number"
const errorDataIsNeverUsed = "use data properly at least for verifying: use isNull()/isNotNull()"
const errorValueExistButNeverUsed = "value exist but never used: use value() for notNull data value"

export class NullableNumber implements OptNum {
    private readonly numberData: number | null = null
    private nullValueNotVerified: boolean = true
    private valueNotUsed: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData === 'number' && this.isNotNaNNumber(unknownData)) {
            if (this.isNumberNotInfinity(unknownData)) {
                this.numberData = unknownData
            }
        }
    }
    private isNotNaNNumber(unknownData: unknown): boolean {
        return !Number.isNaN(unknownData)
    }
    private isNumberNotInfinity(unknownNumberData: number) {
        return isFinite(unknownNumberData)
    }
    private getSafeValue(): number {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.numberData === 'number') {
            this.valueNotUsed = false
            return this.numberData
        } else {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        }
    }
    public value(): number {
        return this.getSafeValue()
    }
    private isNumberDataNull(): boolean {
        return this.numberData === null
    }
    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isNumberDataNull()
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isNumberDataNull()
    }
    public finish(): void {
        if (this.nullValueNotVerified) throw new Error(errorDataIsNeverUsed)
        else if (!this.isNumberDataNull() && this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
    private mathOperation(
        operation: '+' | '-' | '*' | '/',
        withNumber: Num
    ): Num {
        switch (operation) {
            case '+': return new NotNullNumber(this.getSafeValue() + withNumber.value());
            case '-': return new NotNullNumber(this.getSafeValue() - withNumber.value());
            case '*': return new NotNullNumber(this.getSafeValue() * withNumber.value());
            case '/': return new NotNullNumber(this.getSafeValue() / withNumber.value());
        }
    }
    public multiplyBy(number: Num): Num {
        return this.mathOperation('*', number)
    }
    public add(number: Num): Num {
        return this.mathOperation('+', number)
    }
    public minus(number: Num): Num {
        return this.mathOperation('-', number)
    }
    public dividedBy(number: Num): Num {
        return this.mathOperation('/', number)
    }
    public equalTo(number: Num): Bool {
        return new NotNullBoolean(this.getSafeValue() === number.value())
    }
    public greaterOrEqualThan(number: Num): Bool {
        return new NotNullBoolean(this.getSafeValue() >= number.value())
    }
    public greaterThan(number: Num): Bool {
        return new NotNullBoolean(this.getSafeValue() > number.value())
    }
    public lessOrEqualThan(number: Num): Bool {
        return new NotNullBoolean(this.getSafeValue() <= number.value())
    }
    public lessThan(number: Num): Bool {
        return new NotNullBoolean(this.getSafeValue() < number.value())
    }
}

export class NotNullNumber implements Num {
    private readonly numberData: number
    private valueNotUsed: boolean = true
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
    private getValueAndFlagUsed(): number {
        this.valueNotUsed = false
        return this.numberData
    }
    public value(): number {
        return this.getValueAndFlagUsed()
    }
    public finish(): void {
        if (this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
    private mathOperation(
        operation: '+' | '-' | '*' | '/',
        withNumber: Num
    ): Num {
        switch (operation) {
            case '+': return new NotNullNumber(this.getValueAndFlagUsed() + withNumber.value());
            case '-': return new NotNullNumber(this.getValueAndFlagUsed() - withNumber.value());
            case '*': return new NotNullNumber(this.getValueAndFlagUsed() * withNumber.value());
            case '/': return new NotNullNumber(this.getValueAndFlagUsed() / withNumber.value());
        }
    }
    public multiplyBy(number: Num): Num {
        return this.mathOperation('*', number)
    }
    public add(number: Num): Num {
        return this.mathOperation('+', number)
    }
    public minus(number: Num): Num {
        return this.mathOperation('-', number)
    }
    public dividedBy(number: Num): Num {
        return this.mathOperation('/', number)
    }
    public equalTo(number: Num): Bool {
        return new NotNullBoolean(this.getValueAndFlagUsed() === number.value())
    }
    public greaterOrEqualThan(number: Num): Bool {
        return new NotNullBoolean(this.getValueAndFlagUsed() >= number.value())
    }
    public greaterThan(number: Num): Bool {
        return new NotNullBoolean(this.getValueAndFlagUsed() > number.value())
    }
    public lessOrEqualThan(number: Num): Bool {
        return new NotNullBoolean(this.getValueAndFlagUsed() <= number.value())
    }
    public lessThan(number: Num): Bool {
        return new NotNullBoolean(this.getValueAndFlagUsed() < number.value())
    }
}
