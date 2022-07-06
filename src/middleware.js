import { Markup } from 'telegraf';
import {
    offMessages,
    onMessages,
    paySubscription,
    saveCategory,
    saveKeywords,
    saveServer,
    saveType,
    saveUser,
} from './utils.js';
import {
    CHOOSE_TYPE_MSG,
    getUserBalanceMessage,
    getUserInfoMessage,
    LINK_CONTRACT_BUTTON,
    LINK_CONTRACT_MSG,
    NOT_ENOUGH_BALANCE_MSG,
    OFF_MESSAGE_MSG,
    ON_MESSAGE_MSG,
    PAYMENT_MSG,
    SUPPORT_MSG,
    WELCOME_MSG,
    WITHOUT_SUBSCRIPTION_MSG,
    KEYWORDS_MSG,
} from './messages.js';
import {
    CATEGORIES_CALLBACKS,
    CATEGORY_KEYBOARD,
    getSubscriptionsKeyboard,
    MENU,
    MENU_KEYBOARD,
    PAYMENT_KEYBOARD,
    RATE_KEYBOARD,
    SERVERS_KEYBOARD,
    SERVES_CALLBACKS,
    SUPPORT_KEYBOARD,
    TYPE_CALLBACKS,
    TYPE_KEYBOARD,
} from './keyboards.js';

import { deletedSubscription, findSubscriptions, findUser } from './db.js';

const CONTRACT_URL = process.env.CONTRACT_URL;

export const start = async (ctx) => {
    const user = ctx.message.from;
    await saveUser(user);
    await ctx.reply(WELCOME_MSG, Markup.keyboard(MENU_KEYBOARD));
};

export const help = async (ctx) => {
    await ctx.reply(WELCOME_MSG, Markup.keyboard(MENU_KEYBOARD));
};

export const menu = async (ctx) => {
    await ctx.reply('Меню', Markup.keyboard(MENU_KEYBOARD));
};

export const turnOnMessage = async (ctx) => {
    const user = ctx.message.from;
    const curUser = await findUser(user.id);
    if (curUser.subscriptionUntil < new Date()) {
        await ctx.reply(WITHOUT_SUBSCRIPTION_MSG);
        return;
    }
    await onMessages(user);
    await ctx.reply(ON_MESSAGE_MSG);
};

export const turnOffMessage = async (ctx) => {
    const user = ctx.message.from;
    await offMessages(user);
    await ctx.reply(OFF_MESSAGE_MSG);
};

export const profile = async (ctx) => {
    const user = ctx.message.from;
    const curUser = await findUser(user.id);
    const subscriptions = await findSubscriptions(curUser.id);
    await ctx.reply(
        getUserInfoMessage(curUser, subscriptions),
        Markup.inlineKeyboard(getSubscriptionsKeyboard(subscriptions)).resize()
    );
};

export const notifications = async (ctx) => {
    await ctx.reply(
        'Выбери сервер',
        Markup.inlineKeyboard(SERVERS_KEYBOARD).resize()
    );
};

export const payment = async (ctx) => {
    await ctx.reply(PAYMENT_MSG, Markup.inlineKeyboard(PAYMENT_KEYBOARD));
};

export const accountManagement = async (ctx) => {
    const user = ctx.message.from;
    const curUser = await findUser(user.id);
    await ctx.reply(
        getUserBalanceMessage(curUser),
        Markup.inlineKeyboard(RATE_KEYBOARD)
    );
};

export const support = async (ctx) => {
    await ctx.reply(SUPPORT_MSG, Markup.inlineKeyboard(SUPPORT_KEYBOARD));
};

export const contract = async (ctx) => {
    // const filePath = path.join(process.cwd(), 'pdf', 'contract.pdf')
    // fs.readFile(filePath, { encoding: 'utf-8' },  async (err, data)  => {
    //     if (!err) {
    //         await ctx.replyWithDocument(data);
    //     } else {
    //         console.log(err)
    //     }
    // })
    await ctx.reply(
        LINK_CONTRACT_MSG,
        Markup.inlineKeyboard([
            Markup.button.url(LINK_CONTRACT_BUTTON, CONTRACT_URL),
        ]).resize()
    );
};

export const text = async (ctx) => {
    const message = ctx.message;
    const text = message.text;
    const user = message.from;
    if (!user.is_bot) {
        if (text.split(',').length > 1) {
            await ctx.reply(KEYWORDS_MSG);
        } else if (!MENU.includes(text)) {
            await saveKeywords(message);
            await ctx.reply("Нажмите 'Включить' для получения сообщений");
        }
    }
};

export const callback_query = async (ctx) => {
    const query = ctx.callbackQuery;
    const data = query.data;
    const user = query.from;
    if (SERVES_CALLBACKS.includes(data)) {
        await saveServer(query);
        await ctx.reply(
            'Выбери категорию',
            Markup.inlineKeyboard(CATEGORY_KEYBOARD)
        );
        console.log(data, 'база данных');
    } else if (CATEGORIES_CALLBACKS.includes(data)) {
        await saveCategory(query);
        await ctx.reply(CHOOSE_TYPE_MSG, Markup.inlineKeyboard(TYPE_KEYBOARD));
        console.log(data, 'база данных');
    } else if (TYPE_CALLBACKS.includes(data)) {
        await saveType(query);
        await ctx.reply(KEYWORDS_MSG);
        console.log(data, 'база данных');
    } else if (data.includes(' - ')) {
        const [server, category, type, ...keywords] = data.split(' - ');
        await deletedSubscription(user.id, server, category, type, keywords);
        await ctx.reply('Уведомление удалено:' + '\n' + data);
    } else if (data.includes('invoice')) {
        const value = Number(data.split(':')[1]);
        const curUser = await findUser(user.id);
        if (curUser.balance < value) {
            await ctx.reply(NOT_ENOUGH_BALANCE_MSG);
            return;
        }
        await paySubscription(curUser, value);
        await ctx.reply('Подписка оплачена на 7 дней');
    }
};
