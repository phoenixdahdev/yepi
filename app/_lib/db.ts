import "server-only";
import { MongoClient, type Collection, type Db } from "mongodb";
import type { ApplicationDoc } from "./application";

/**
 * Lazy connection. Next evaluates top-level module code at build time, so the
 * client must not be constructed on import — otherwise `next build` fails
 * before MONGODB_URI has been provisioned.
 *
 * The promise is cached on globalThis so dev HMR reuses one pool instead of
 * opening a new connection on every reload.
 */

const globalForMongo = globalThis as unknown as {
  _yepiMongo?: Promise<MongoClient>;
};

function connect(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Provision MongoDB Atlas and run `vercel env pull`.",
    );
  }
  return new MongoClient(uri).connect();
}

export async function getDb(): Promise<Db> {
  globalForMongo._yepiMongo ??= connect();
  const client = await globalForMongo._yepiMongo;
  return client.db(process.env.MONGODB_DB ?? "yepi");
}

export async function applications(): Promise<Collection<ApplicationDoc>> {
  const db = await getDb();
  return db.collection<ApplicationDoc>("applications");
}

/** Idempotent; safe to call on every write path. */
export async function ensureIndexes(): Promise<void> {
  const col = await applications();
  await Promise.all([
    col.createIndex({ id: 1 }, { unique: true }),
    col.createIndex({ "founder.email": 1 }),
    col.createIndex({ status: 1, submittedAt: -1 }),
  ]);
}
