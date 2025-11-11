export interface Str {
    value(): string;
    finish(): void;
}
export interface OptStr extends Str { // nullable means also able to Notnullable
    isNotNull(): boolean;
    isNull(): boolean;
}
export interface Num {
    value(): number;
    finish(): void;
    multiplyBy(number: Num): Num
    dividedBy(number: Num): Num
    add(number: Num): Num
    minus(number: Num): Num
    greaterThan(number: Num): Bool
    greaterOrEqualThan(number: Num): Bool
    lessThan(number: Num): Bool
    lessOrEqualThan(number: Num): Bool
    equalTo(number: Num): Bool
}
export interface OptNum extends Num {
    isNotNull(): boolean;
    isNull(): boolean;
}
export interface Bool {
    yes(): boolean // is it yes (value === true => output true , else false)
    no(): boolean // is it no (value === false => output true , else false)
    condition(): boolean // true or false
    finish(): void;
    or(condition: Bool): Bool;
    and(condition: Bool): Bool;
}
export interface OptBool extends Bool {
    isNotNull(): boolean;
    isNull(): boolean;
}