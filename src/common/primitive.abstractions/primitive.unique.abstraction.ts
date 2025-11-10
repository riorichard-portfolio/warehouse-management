export interface Email {
    value(): string;
    finish(): void;
}

export interface OptEmail extends Email {
    isNotNull(): boolean;
    isNull(): boolean;
}

export interface UUID {
    value(): string;
    finish(): void;
}

export interface OptUUID extends UUID {
    isNotNull(): boolean;
    isNull(): boolean;
}

export interface Time {
    unixTime(): number;
    isoString(): string;
    date(): Date;
    finish(): void;
}

export interface OptTime extends Time {
    isNotNull(): boolean;
    isNull(): boolean;
}
