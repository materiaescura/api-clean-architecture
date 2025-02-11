import { MongoClient, Collection } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const MongoHelper = {
  client: null as MongoClient | null,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  async clearCollection(name: string): Promise<void> {
    this.client.db().collection(name).deleteMany({})
  },
}
