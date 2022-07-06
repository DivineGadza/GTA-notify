import {
    findUser,
    insertKeyword,
    insertUser,
    updateUser,
    insertSubscription,
    updateSubscription, insertInvoice,
} from './db.js';

export async function saveUser(user) {
    const currentUser = await findUser(user.id);
    if (!currentUser) {
        const date = new Date()
        console.log('New user => ', user);
        await insertUser({
            ...user,
            isActive: false,
            isPaid: false,
            balance: 0,
            createdAt: date,
            subscriptionUntil: date,
        });
        console.log('User saved');
    }
    console.log('done');
}

export async function saveServer(query) {
    const user = query.message.chat;
    await insertSubscription(user, query.data);
    console.log('server saved');
}

export async function saveCategory(query) {
    const user = query.message.chat;
    await updateSubscription(
        user,
        { category: null },
        { category: query.data }
    );
    console.log('category saved');
}

export async function saveType(query) {
    const user = query.message.chat;
    await updateSubscription(user, { type: null }, { type: query.data });
    console.log('type saved');
}

export async function saveKeywords(msg) {
    const user = msg.from;
    const keywords = msg.text.split(' ').map((kv) => kv.toLowerCase());
    await updateSubscription(user, { keywords: null }, { keywords: keywords });
    console.log('keywords saved');
}

export async function saveKeyword(keywords) {
    const keywordsArray = keywords
        .split(' ')
        .map((kw) => ({ value: kw.toLowerCase(), count: 1 }));
    await insertKeyword(keywordsArray);
}

export async function onMessages(user) {
    await updateUser(user.id, { $set: { isActive: true } });
}

export async function offMessages(user) {
    await updateUser(user.id, { $set: { isActive: false } });
}

export async function onPaid(user) {
    await updateUser(user.id, { $set: { isPaid: true } });
}

export async function offPaid(user) {
    await updateUser(user.id, { $set: { isPaid: false } });
}

export async function removeServer(user, serverName) {
    await updateUser(user.id, { $pull: { servers: serverName } });
}

export function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

export const paySubscription = async (curUser, value) => {
    await insertInvoice(curUser, value)
    await renewSubscription(curUser, value)
}

const renewSubscription = async (curUser, value) => {
    let newDate = new Date()
    if (curUser.subscriptionUntil < newDate) {
        newDate.setDate(newDate.getDate() + 7)
    } else {
        newDate = new Date( curUser.subscriptionUntil.setDate(curUser.subscriptionUntil.getDate() + 7))
    }
    await updateUser(curUser.id, {
        $set: {
            balance: curUser.balance - value,
            subscriptionUntil: newDate
        }
    }
    )
}