import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URL ?? 'mongodb://localhost:27017/';

const client = new MongoClient(MONGO_URI);
// Database Name
const dbName = 'notify';

// Collection Names

const collectionUsersName = 'users';
const collectionSubscriptionName = 'subscriptions';
const collectionKeywordsName = 'keywords';
const collectionInvoicesName = 'invoices';

// Connect DB
const db = client.db(dbName);
client.connect();
console.log('Connected successfully to server');

export async function findUser(userId) {
    const collection = db.collection(collectionUsersName);
    return (await collection.find({ id: userId }).toArray())[0];
}

export async function findSubscriptions(userId) {
    const collection = db.collection(collectionSubscriptionName);
    return await collection.find({ user: userId }).toArray();
}

export async function insertUser(user) {
    const collection = db.collection(collectionUsersName);
    return await collection.insertOne(user);
}

export async function insertSubscription(user, serverName) {
    const collection = db.collection(collectionSubscriptionName);
    return await collection.insertOne({ user: user.id, server: serverName , createdAt: new Date()});
}

export async function updateSubscription(user, filter, values) {
    const collection = db.collection(collectionSubscriptionName);
    return await collection.updateOne(
        { ...filter, user: user.id },
        { $set: values }
    );
}

export async function insertKeyword(keyword) {
    const collection = db.collection(collectionKeywordsName);
    return await collection.insertMany(keyword);
}

export async function updateUser(userId, payload) {
    const collection = db.collection(collectionUsersName);
    return await collection.updateOne({ id: userId }, payload);
}

export async function deletedSubscription(
    userId,
    server,
    category,
    type,
    keywords
) {
    const collection = db.collection(collectionSubscriptionName);
    await collection.deleteOne({
        user: userId,
        server: server,
        category: category,
        type: type,
        keywords: { $all: keywords },
    });
}

export async function insertInvoice(user, value) {
    const collection = db.collection(collectionInvoicesName);
    return await collection.insertOne({user: user.id, value: value, createdAt: new Date()});
}