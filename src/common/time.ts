import { OptTime, Time } from "./primitive.abstractions/primitive.unique.abstraction";

const errorNullNotVerified = "isNull()/isNotNull() must be called before unixTime()/date()/isoString()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"
const errorDataIsNeverUsed = "use data properly at least for verifying: use isNull()/isNotNull()"
const errorValueExistButNeverUsed = "value exist but never used: use unixTime()/date()/isoString() for notNull data value"

export class NullableTime implements OptTime {
    private readonly dateTime: Date | null = null
    private readonly isDateNull: boolean = true
    private nullValueNotVerified: boolean = true
    private valueNotUsed: boolean = true
    constructor(unknownData: unknown) {
        if (typeof unknownData === 'number') {
            if (this.isValidUnixTimestamp(unknownData)) {
                const date = new Date(unknownData)
                if (this.isValidDate(date)) {
                    this.dateTime = date
                    this.isDateNull = false
                }
            }
        }
    }
    private isValidUnixTimestamp(unixTimestamp: number): boolean {
        // number is not NaN
        return !Number.isNaN(unixTimestamp) &&
            // number must not BE Infinity
            isFinite(unixTimestamp) &&
            // Allow floats for millisecond precision
            unixTimestamp >= -8640000000000000 &&
            unixTimestamp <= 8640000000000000;
    }
    private isValidDate(date: Date): boolean {
        return !Number.isNaN(date.getTime())
    }
    private getDate(): Date {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (this.dateTime === null) {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        } else {
            this.valueNotUsed = false
            return this.dateTime
        }
    }
    public unixTime(): number {
        return this.getDate().getTime()
    }
    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isDateNull
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isDateNull
    }
    public date(): Date {
        return this.getDate()
    }
    public isoString(): string {
        return this.getDate().toISOString()
    }
    public finish(): void {
        if (this.nullValueNotVerified) throw new Error(errorDataIsNeverUsed)
        else if (!this.isDateNull && this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
}

export class NowTime implements Time {
    private readonly nowDate: Date
    private valueNotUsed: boolean = true
    constructor() {
        this.nowDate = new Date()
    }
    private valueIsUsed(): void {
        if (this.valueNotUsed) this.valueNotUsed = false
    }
    public unixTime(): number {
        this.valueIsUsed()
        return this.nowDate.getTime()
    }
    public date(): Date {
        this.valueIsUsed()
        return this.nowDate
    }
    public isoString(): string {
        this.valueIsUsed()
        return this.nowDate.toISOString()
    }
    public finish(): void {
        if (this.valueNotUsed) throw new Error(errorValueExistButNeverUsed)
    }
}