import Config from "./_base.config";

type KafkaStringKeys =
    | "KAFKA_BROKER_NODE"

const kafkaKeys: KafkaStringKeys[] = [
    "KAFKA_BROKER_NODE"
]

export default class KafkaConfig extends Config<KafkaStringKeys, never, never> {
    constructor(kafkaCfgName: string) {
        super(kafkaCfgName, kafkaKeys)
    }

    public getAllVars() {
        return {
            KAFKA_BROKER_NODE: this.GET_CONFIG_STRING("KAFKA_BROKER_NODE")
        }
    }
}