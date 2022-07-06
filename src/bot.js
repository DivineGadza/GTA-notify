import { getInvoice } from './payment.js';
import {
    callback_query,
    contract,
    help,
    menu,
    turnOnMessage,
    start,
    text,
    turnOffMessage,
    profile,
    notifications,
    support,
    payment,
    accountManagement,
} from './middleware.js';
import { Telegraf } from 'telegraf';
import { MENU } from './keyboards.js';

const TOKEN =
    process.env.TOKEN ?? '5418152448:AAHKU5dAqz0iNuqiGSvNduDsRZMZ52SnUQg';

const bot = new Telegraf(TOKEN);

bot.use(Telegraf.log());

bot.start(start);
bot.help(help);
bot.command(menu);

bot.hears(`${MENU[0]}`, turnOnMessage);
bot.hears(`${MENU[1]}`, turnOffMessage);
bot.hears(`${MENU[2]}`, accountManagement);
bot.hears(`${MENU[3]}`, notifications);
bot.hears(`${MENU[4]}`, payment);
bot.hears(`${MENU[5]}`, profile);
bot.hears(`${MENU[6]}`, contract);
bot.hears(`${MENU[7]}`, support);

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)); // ответ на предварительный запрос по оплате

bot.on('successful_payment', async (ctx, next) => {
    // ответ в случае положительной оплаты
    await ctx.reply('SuccessfulPayment');
});

bot.hears('pay', (ctx) => {
    // это обработчик конкретного текста, данном случае это - "pay"
    return ctx.replyWithInvoice(getInvoice(ctx.from.id)); //  метод replyWithInvoice для выставления счета
});

bot.on('text', text);
bot.on('callback_query', callback_query);

bot.launch();
console.log('Bot launch');
