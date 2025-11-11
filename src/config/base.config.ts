import { StringToNumber } from "src/common/string.to.number.parser";
import { OptStr } from "../common/primitive.abstractions/primitive.wrapper.abstraction";

export interface SetConfig<
    TStringKeys extends string,
    TNumberKeys extends string,
    TBooleanKeys extends string
> {
    SET_CONFIG_STRING(configKey: TStringKeys, configString: OptStr): this
    SET_CONFIG_NUMBER(configKey: TNumberKeys, configString: OptStr): this
    SET_CONFIG_BOOLEAN(configKey: TBooleanKeys, configString: OptStr): this
}

export interface GetConfig<
    TStringKeys extends string,
    TNumberKeys extends string,
    TBooleanKeys extends string
> {
    GET_CONFIG_STRING(configKey: TStringKeys): string
    GET_CONFIG_NUMBER(configKey: TNumberKeys): number
    GET_CONFIG_BOOLEAN(configKey: TBooleanKeys): boolean
}

export default class Config<
    TStringKeys extends string,
    TNumberKeys extends string,
    TBooleanKeys extends string
>
    implements
    SetConfig<TStringKeys, TNumberKeys, TBooleanKeys>,
    GetConfig<TStringKeys, TNumberKeys, TBooleanKeys> {
    private config: Record<string, string | number | boolean | null> = {}
    private nameOfConfig: string;
    constructor(nameOfConfig: string, configKeys: (TStringKeys | TNumberKeys | TBooleanKeys)[]) {
        this.nameOfConfig = nameOfConfig
        configKeys.forEach(configKey => this.config[configKey] = null)
    }
    public SET_CONFIG_STRING(configKey: TStringKeys, configString: OptStr): this {
        if (configKey in this.config) {
            if (this.config[configKey] !== null) throw new Error(`invalid set operation: ${configKey} is already set ${this.nameOfConfig}`)
            if (configString.isNotNull()) {
                this.config[configKey] = configString.value()
                return this
            } else {
                throw new Error(`invalid config value: ${configKey} is not set yet for ${this.nameOfConfig}`)
            }
        } else {
            throw new Error(`invalid config key: ${configKey} is not registerd in config ${this.nameOfConfig}`)
        }
    }

    public SET_CONFIG_NUMBER(configKey: TNumberKeys, configString: OptStr): this {
        if (configKey in this.config) {
            if (this.config[configKey] !== null) throw new Error(`invalid set operation: ${configKey} is already set ${this.nameOfConfig}`)
            if (configString.isNotNull()) {
                const numberConfig = StringToNumber(configString)
                if (numberConfig.isNotNull()) {
                    this.config[configKey] = numberConfig.value()
                    return this
                } else {
                    throw new Error(`invalid config value: ${configKey} is not a number in config ${this.nameOfConfig}`)

                }
            } else {
                throw new Error(`invalid config value: ${configKey} is not set yet for ${this.nameOfConfig}`)
            }
        } else {
            throw new Error(`invalid config key: ${configKey} is not registerd in config ${this.nameOfConfig}`)
        }
    }

    public SET_CONFIG_BOOLEAN(configKey: TBooleanKeys, configString: OptStr): this {
        if (configKey in this.config) {
            if (this.config[configKey] !== null) throw new Error(`invalid set operation: ${configKey} is already set ${this.nameOfConfig}`)
            if (configString.isNotNull()) {
                if (configString.value().toLowerCase() === 'true' || configString.value().toLowerCase() === 'false') {
                    this.config[configKey] = configString.value().toLocaleLowerCase() === 'true'
                    return this
                } else {
                    throw new Error(`invalid config value: ${configKey} is not a boolean in config ${this.nameOfConfig}`)
                }
            } else {
                throw new Error(`invalid config value: ${configKey} is not set yet for ${this.nameOfConfig}`)
            }
        } else {
            throw new Error(`invalid config key: ${configKey} is not registerd in config ${this.nameOfConfig}`)
        }
    }
    // ✅ FUNCTION OVERLOAD SIGNATURES
    private getSaveConfig(configKey: TStringKeys, valueType: 'string'): string;
    private getSaveConfig(configKey: TNumberKeys, valueType: 'number'): number;
    private getSaveConfig(configKey: TBooleanKeys, valueType: 'boolean'): boolean;
    // ONLY IMPLEMENT ONCE FROM OVERLOAD SIGNATURES
    private getSaveConfig(
        configKey: TStringKeys | TNumberKeys | TBooleanKeys,
        valueType: 'string' | 'number' | 'boolean'
    ): string | number | boolean {
        if (this.config[configKey] !== undefined) {
            if (this.config[configKey] === null) {
                throw new Error(
                    `invalid value for key ${configKey}: please set value for the key first 
                    in config ${this.nameOfConfig}`
                )
            } else {
                if (typeof this.config[configKey] === valueType) {
                    return this.config[configKey]
                } else {
                    throw new Error(
                        `invalid value type for key ${configKey}: please get with proper type value for the key
                        in config ${this.nameOfConfig}`
                    )
                }
            }
        } else {
            throw new Error(
                `invalid config key: ${configKey} is not registerd in config ${this.nameOfConfig} 
                use registered key instead to get config string`
            )
        }
    }
    public GET_CONFIG_STRING(configKey: TStringKeys): string {
        return this.getSaveConfig(configKey, 'string')
    }

    public GET_CONFIG_NUMBER(configKey: TNumberKeys): number {
        return this.getSaveConfig(configKey, 'number')
    }
    public GET_CONFIG_BOOLEAN(configKey: TBooleanKeys): boolean {
        return this.getSaveConfig(configKey, 'boolean')
    }
    public ALL_SET(): void {
        const nullKeys = Object.keys(this.config).filter(key => this.config[key] === null)
        if (nullKeys.length > 0) {
            throw new Error(`missing env variables: please set ${nullKeys.join(', ')} in ${this.nameOfConfig}`)
        }
    }
}
