import crypto from 'crypto'

import { OptUUID, UUID } from "@/common/primitive.abstractions/primitive.unique.abstraction";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[45][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const errorNullNotVerified = "isNull()/isNotNull() must be called before value()"
const errorNotProperNullVerifyUse = "data is null :isNull()/isNotNull() must be used properly to avoid null"

export default class NullableUUID implements OptUUID {
    private readonly uuid: string | null = null;
    private readonly isUUIDNull: boolean = true
    private nullValueNotVerified: boolean = true;

    constructor(unknownData: unknown) {
        if (typeof unknownData == 'string') {
            if (this.isUUIDValid(unknownData)) {
                this.uuid = unknownData
                this.isUUIDNull = false
            }
        }
    }
    private isUUIDValid(unknownString: string): boolean {
        return uuidRegex.test(unknownString)
    }
    public value(): string {
        if (this.nullValueNotVerified) throw new Error(errorNullNotVerified)
        if (typeof this.uuid === 'string') {
            return this.uuid
        } else {
            // if this triggered means value === null 
            // means accessing null value not in condition isNotNull after verifying
            // or still using it if it already verified null
            throw new Error(errorNotProperNullVerifyUse)
        }
    }

    public isNotNull(): boolean {
        this.nullValueNotVerified = false
        return !this.isUUIDNull
    }
    public isNull(): boolean {
        this.nullValueNotVerified = false
        return this.isUUIDNull
    }

}

export class FreshUUID implements UUID {
    private readonly uuid: string
    constructor() {
        this.uuid = crypto.randomUUID()
    }
    public value(): string {
        return this.uuid
    }
}