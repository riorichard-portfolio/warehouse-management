import Config from "./_base.config";

type KafkaStringKeys =
    | "KAFKA_BROKER_HOST"

const kafkaKeys: KafkaStringKeys[] = [
    "KAFKA_BROKER_HOST"
]

export default class KafkaConfig extends Config<KafkaStringKeys, never, never> {
    constructor(kafkaCfgName: string) {
        super(kafkaCfgName, kafkaKeys)
    }
}