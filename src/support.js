import { Telegraf } from 'telegraf';

const TOKEN = process.env.SUPPORT_TOKEN;
export const OWNER_ID_1 = process.env.OWNER_ID_1;
export const OWNER_ID_2 = process.env.OWNER_ID_2;

const bot = new Telegraf(TOKEN);

export const sendSupportBot = async (text) => {
    await bot.sendMessage(OWNER_ID_1, text);
    await bot.sendMessage(OWNER_ID_2, text);
};
