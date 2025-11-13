import Config from "./_base.config";

type PostgreStringKeys =
    | "PG_HOST"
    | "PG_USER"
    | "PG_PASSWORD"
    | "PG_DATABASE"

type PostgreNumberKeys =
    | "PG_PORT"
    | "PG_MAX_POOL"


const postgreKeys: (PostgreStringKeys|PostgreNumberKeys)[] = [
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
}