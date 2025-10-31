type SqlString = string
type SqlParam = string

export type SqlArrayRow = readonly any[]
export type SqlParams = readonly SqlParam[]
export type SqlArrayRows = readonly SqlArrayRow[]
export type SqlStatement = readonly [SqlString, SqlParams]

export interface SqlDB {
    command(statement: SqlStatement): Promise<void>
    query(statement: SqlStatement): Promise<SqlArrayRows>
    prepareSql(sql: string, params?: string[]): SqlStatement 
}

type CacheKey = string
type CacheValue = string | number | boolean

export type KeyValuePair = [CacheKey, CacheValue]

export interface LocalCache {
    prepareCaching(key: string, value: string | number | boolean): KeyValuePair
    set(statement: KeyValuePair): void
}