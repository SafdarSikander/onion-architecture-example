import { createClient } from "redis";

export class RedisStreamService {
  private client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    this.client.connect();
  }

  async publishMessage(streamKey: string, message: string): Promise<void> {
    await this.client.xAdd(streamKey, "*", { message });
  }

  async consumeMessages(
    streamKey: string,
    callback: (message: string) => void
  ): Promise<void> {
    const lastId = "0";
    while (true) {
      const response = await this.client.xRead(
        { key: streamKey, id: lastId },
        { BLOCK: 0 }
      );
      if (response) {
        for (const stream of response) {
          for (const message of stream.messages) {
            callback(message.message.message);
          }
        }
      }
    }
  }
}
