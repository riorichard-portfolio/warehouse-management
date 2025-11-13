import Config from "./_base.config";

type PostgreStringKeys =
    | "PG_HOST"
    | "PG_USER"
    | "PG_PASSWORD"
    | "PG_DATABASE"

type PostgreNumberKeys =
    | "PG_PORT"
    | "PG_MAX_POOL"


const postgreKeys: (PostgreStringKeys | PostgreNumberKeys)[] = [
    "PG_HOST",
    "PG_USER",
    "PG_PASSWORD",
    "PG_DATABASE",
    "PG_PORT",
    "PG_MAX_POOL"
]
export default class PostgreConfig extends Config<PostgreStringKeys, PostgreNumberKeys, never> {
    constructor(pgCfgName: string) {
        super(pgCfgName, postgreKeys)
    }

    public getAllVars() {
        return {
            PG_HOST: this.GET_CONFIG_STRING("PG_HOST"),
            PG_USER: this.GET_CONFIG_STRING("PG_USER"),
            PG_PASSWORD: this.GET_CONFIG_STRING("PG_PASSWORD"),
            PG_DATABASE: this.GET_CONFIG_STRING("PG_DATABASE"),
            PG_PORT: this.GET_CONFIG_NUMBER("PG_PORT"),
            PG_MAX_POOL: this.GET_CONFIG_NUMBER("PG_MAX_POOL")
        }
    }
}