/** 
interface SetEntityProperties<
    TStringPropNames extends string,
    TNumberPropNames extends string,
    TBooleanPropNames extends string
> {
    SET_PRIMARY_ID(idValue: string): this
    SET_PROP_STRING(propName: TStringPropNames, propValue: string): this
    SET_PROP_NUMBER(propName: TNumberPropNames, propValue: number): this
    SET_PROP_BOOLEAN(propName: TBooleanPropNames, propValue: boolean): this
}

interface GetEntityProperties<
    TStringPropNames extends string,
    TNumberPropNames extends string,
    TBooleanPropNames extends string
> {
    GET_PRIMARY_ID(): string
    GET_PROP_STRING(propName: TStringPropNames): string
    GET_PROP_NUMBER(propName: TNumberPropNames): number
    GET_PROP_BOOLEAN(propName: TBooleanPropNames): boolean
    GET_DTO(): [TStringPropNames | TNumberPropNames | TBooleanPropNames, string | number | boolean][]
}

interface EntityProceduralEnforcement {
    FINISH_WITH_PROCEDURAL_ENFORCEMENT(): void
}
*/

type ValueType = 'string' | 'number' | 'boolean'
type IsUsed = boolean

type entityPropertyValue = string | number | boolean | null
type PropertyDetails = [
    isUsed: IsUsed,
    value: entityPropertyValue,
    valueType: ValueType
]

export default class Entity
    <
        TStringPropNames extends string,
        TNumberPropNames extends string,
        TBooleanPropNames extends string
    >
/** 
implements
SetEntityProperties<
    TStringPropNames,
    TNumberPropNames,
    TBooleanPropNames
>,
GetEntityProperties<
    TStringPropNames,
    TNumberPropNames,
    TBooleanPropNames
>,
EntityProceduralEnforcement 
*/
{
    private readonly properties: [TStringPropNames | TNumberPropNames | TBooleanPropNames, ...PropertyDetails][] = []

    private readonly entityName: string
    private entityId: string | null = null

    constructor(
        entityName: string,
        props: [
            (TStringPropNames | TNumberPropNames | TBooleanPropNames), ValueType
        ][]
    ) {
        this.entityName = entityName
        props.forEach(propNameAndType => {
            const propName = propNameAndType[0]
            const propValueType = propNameAndType[1]
            this.properties.push([
                propName,
                false,
                null,
                propValueType
            ])
        })
    }

    private idempotentSafeSet(
        propName: TStringPropNames | TNumberPropNames | TBooleanPropNames,
        propValue: entityPropertyValue
    ): void {
        for (const [indexProp, prop] of this.properties.entries()) {
            if (prop[0] === propName) {
                if (prop[2] !== null) {
                    throw new Error(
                        `invalid set operation: property ${propName} already set in entity ${this.entityName}`
                    )
                } else if (typeof propValue !== prop[3]) {
                    throw new Error(
                        `invalid set operation: property type of ${propName} does not match in registered type ${prop[3]}`
                    )
                }
                if (this.properties[indexProp] !== undefined) {
                    this.properties[indexProp][2] = propValue
                    return
                } else {
                    throw new Error(
                        `internal error: property ${propName} lost in entity ${this.entityName}`
                    )
                }
            }
        }
        throw new Error(
            `invalid property name: property ${propName} doesn't registered in entity ${this.entityName}`
        )
    }

    protected SET_PRIMARY_ID(id: string): this {
        if (this.entityId !== null) throw new Error(
            `invalid set primary id: primary id already set in entity ${this.entityName}`
        )
        this.entityId = id
        return this
    }
    protected SET_PROP_STRING(propName: TStringPropNames, propValue: string): this {
        this.idempotentSafeSet(propName, propValue)
        return this
    }
    protected SET_PROP_BOOLEAN(propName: TBooleanPropNames, propValue: boolean): this {
        this.idempotentSafeSet(propName, propValue)
        return this
    }
    protected SET_PROP_NUMBER(propName: TNumberPropNames, propValue: number): this {
        this.idempotentSafeSet(propName, propValue)
        return this
    }
    protected GET_PRIMARY_ID(): string {
        if (this.entityId === null) throw new Error(
            `invalid get primary id: primary id not set in entity ${this.entityName}`
        )
        return this.entityId
    }

    // function overload
    private getPropValueSafe(propName: TStringPropNames, propType: 'string'): string;
    private getPropValueSafe(propName: TNumberPropNames, propType: 'number'): number;
    private getPropValueSafe(propName: TBooleanPropNames, propType: 'boolean'): boolean;

    private getPropValueSafe(
        propName: TStringPropNames | TNumberPropNames | TBooleanPropNames,
        propType: ValueType
    ): string | number | boolean {
        let propValue: string | number | boolean | undefined
        for (const [indexProp, prop] of this.properties.entries()) {
            if (prop[0] === propName) {
                if (prop[2] === null) {
                    throw new Error(`invalid get operation: property ${propName} is null please set first`)
                } else if (typeof prop[2] !== propType) {
                    throw new Error(`invalid get operation: property ${propName} type is ${typeof prop[2]} please get properly`)
                }
                propValue = prop[2]
                if (this.properties[indexProp] !== undefined) {
                    this.properties[indexProp][1] = true
                } else {
                    throw new Error(
                        `internal error: property ${propName} lost in entity ${this.entityName}`
                    )
                }
            }
        }
        if (propValue === undefined) throw new Error(
            `invalid property name: property ${propName} doesn't registered in entity ${this.entityName}`
        )
        return propValue
    }

    protected GET_PROP_STRING(propName: TStringPropNames): string {
        return this.getPropValueSafe(propName, 'string')
    }
    protected GET_PROP_BOOLEAN(propName: TBooleanPropNames): boolean {
        return this.getPropValueSafe(propName, 'boolean')
    }
    protected GET_PROP_NUMBER(propName: TNumberPropNames): number {
        return this.getPropValueSafe(propName, 'number')
    }
    protected GET_DTO(): [TStringPropNames | TNumberPropNames | TBooleanPropNames, string | number | boolean][] {
        const DTO: [TStringPropNames | TNumberPropNames | TBooleanPropNames, string | number | boolean][] = []
        for (const [indexProp, prop] of this.properties.entries()) {
            if (prop[2] !== null) {
                DTO.push([
                    prop[0],
                    prop[2]
                ])
            }
            if (this.properties[indexProp] !== undefined) {
                this.properties[indexProp][1] = true
            } else {
                throw new Error(
                    `internal error: property ${prop[0]} lost in entity ${this.entityName}`
                )
            }
        }
        return DTO
    }
    protected FINISH_WITH_PROCEDURAL_ENFORCEMENT(): void {
        for (const [_, prop] of this.properties.entries()) {
            if (prop[2] !== null && !prop[1]) {
                throw new Error(`invalid entity use: property ${prop[0]} unused in ${this.entityName} please set & get properly to avoid unused entity prop`)
            }
        }
    }
}
