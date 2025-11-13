import PostgreConfig from "./config.instances/postgre.config";
import KafkaConfig from "./config.instances/kafka.config";

export type EnvPostgreConfig = {
    PG_HOST: string,
    PG_USER: string,
    PG_PASSWORD: string,
    PG_DATABASE: string,
    PG_PORT: number,
    PG_MAX_POOL: number
}
export type EnvKafkaConfig = {
    KAFKA_BROKER_NODE: string
}

interface EnvLoader {
    load(): void
    pgEnvVars(): EnvPostgreConfig
    kafkaEnvVars(): EnvKafkaConfig
}

type NodeEnv = 'local' | 'development' | 'staging' | 'production'

const errorInvalidNodeEnv = 'invalid node env: must set either local | development | staging | production'
const errorNotIdempotentLoad = 'env inproper load: must load env only once'
const errorNoLoadEnv = 'env not loaded : please load the env first with load()'
const errorForcedGetNullEnvVars = 'env load with null: please properly load the env first'

export default class Env implements EnvLoader {
    private readonly nodeEnv: NodeEnv = 'local'
    private envLoaded: boolean = false
    private loadedPgEnvVars: EnvPostgreConfig | null = null
    private loadedKafkaEnvVars: EnvKafkaConfig | null = null

    constructor(nodeEnv?: NodeEnv) {
        if (nodeEnv !== undefined) {
            if (this.nodeEnvIsValid(nodeEnv)) {
                this.nodeEnv = nodeEnv
            } else {
                throw new Error(errorInvalidNodeEnv)
            }
        }
    }

    private nodeEnvIsValid(nodeEnv?: NodeEnv): boolean {
        if (typeof nodeEnv === 'string') {
            if (nodeEnv === 'local' || nodeEnv === 'development' || nodeEnv === 'staging' || nodeEnv === 'production') {
                return true
            }
        }
        return false
    }

    public load(): void {
        if (this.envLoaded) throw new Error(errorNotIdempotentLoad)
        const pg1EnvVars = new PostgreConfig('pgConfig1')
        const kafkaBroker1EnvVars = new KafkaConfig('kafkaConfig1')
        if (this.nodeEnv === 'local') {
            require('dotenv').config({ path: '.env.local' })
        }
        pg1EnvVars.SET_CONFIG_STRING('PG_DATABASE', process.env['PG_DATABASE'])
        pg1EnvVars.SET_CONFIG_STRING('PG_USER', process.env['PG_USER'])
        pg1EnvVars.SET_CONFIG_STRING('PG_PASSWORD', process.env['PG_PASSWORD'])
        pg1EnvVars.SET_CONFIG_STRING('PG_HOST', process.env['PG_HOST'])
        pg1EnvVars.SET_CONFIG_NUMBER('PG_PORT', process.env['PG_PORT'])
        pg1EnvVars.SET_CONFIG_NUMBER('PG_MAX_POOL', process.env['PG_MAX_POOL'])

        kafkaBroker1EnvVars.SET_CONFIG_STRING('KAFKA_BROKER_NODE', process.env['KAFKA_BROKER_NODE'])

        this.loadedPgEnvVars = pg1EnvVars.getAllVars()
        this.loadedKafkaEnvVars = kafkaBroker1EnvVars.getAllVars()
        pg1EnvVars.FINISH(); kafkaBroker1EnvVars.FINISH()
        this.envLoaded = true
    }

    public kafkaEnvVars(): EnvKafkaConfig {
        if (!this.envLoaded) throw new Error(errorNoLoadEnv)
        if (this.loadedKafkaEnvVars !== null) {
            return this.loadedKafkaEnvVars
        } else {
            throw new Error(errorForcedGetNullEnvVars)
        }
    }

    public pgEnvVars(): EnvPostgreConfig {
        if (!this.envLoaded) throw new Error(errorNoLoadEnv)
        if (this.loadedPgEnvVars !== null) {
            return this.loadedPgEnvVars
        } else {
            throw new Error(errorForcedGetNullEnvVars)
        }
    }
}