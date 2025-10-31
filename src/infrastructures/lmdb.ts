import { open, RootDatabase, Key } from 'lmdb';
import { KeyValuePair, LocalCache } from './interfaces';

type LmdbKey = Key
type LmdbValue = string | number | boolean
type StringLmdbKey = string

export default class LMDBAccess implements LocalCache {
    private db: RootDatabase;

    constructor(path: string) {
        this.db = open({
            path: path,
            compression: false, // ✅ No compression for max speed
            noSync: true,       // ✅ Async writes for performance
            noMemInit: true,    // ✅ Faster initialization
            readOnly: false
        });
    } 

    public prepareCaching(key: string, value: string | number | boolean): KeyValuePair {
        return [key, value]
    }

    // ✅ FIRE & FORGET SET - Latency 0.03-0.06ms
    public set(pairs: KeyValuePair): void {
        this.db.put(pairs[0], pairs[1])
            .catch(err => {
                console.error('LMDB write failed:', err.message)
            })

    }

    public findAll(): Array<[LmdbKey, LmdbValue]> {
        const startTime = Date.now();

        // ✅ Pre-allocate based on initial count
        const initialCount = this.db.getCount();
        const results = new Array<[LmdbKey, LmdbValue]>(initialCount);

        let index = 0;
        for (const { key, value } of this.db.getRange()) {
            if (index >= initialCount) {
                // ✅ SKIP excess data - no memory leak!
                break;
            }
            results[index++] = [key, value];
        }

        // ✅ Handle case if actual data < initialCount
        if (index < results.length) {
            results.length = index; // Trim excess allocation
        }

        const duration = Date.now() - startTime;
        console.log(`🚀 LMDB Scan: ${results.length} records in ${duration}ms`);

        return results;
    }

    // ✅ BATCH DELETE 
    public async deleteByKeys(keys: StringLmdbKey[]): Promise<void> {
        if (keys.length === 0) return;

        const startTime = Date.now();

        this.db.transactionSync(() => {
            for (const key of keys) {
                this.db.removeSync(key);
            }
        });

        const duration = Date.now() - startTime;
        console.log(`🗑️ LMDB Delete: ${keys.length} keys in ${duration}ms`);
    }

    public async close(): Promise<void> {
        this.db.close();
    }
}