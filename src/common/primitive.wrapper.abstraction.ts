export interface Str {
    value(): string;
}
export interface OptStr extends Str { // nullable means also able to Notnullable
    isNotNull(): boolean;
    isNull(): boolean;
}
export interface Num {
    value(): number;
}
export interface OptNum extends Num {
    isNotNull(): boolean;
    isNull(): boolean;
}
export interface Bool {
    yes(): boolean // is it yes (value === true => output true , else false)
    no(): boolean // is it no (value === false => output true , else false)
    condition(): boolean // true or false
}
export interface OptBool extends Bool {
    isNotNull(): boolean;
    isNull(): boolean;
}