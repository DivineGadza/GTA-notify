import { Markup } from 'telegraf';
import { sliceIntoChunks } from './utils.js';
import { SubsTypeEnum } from './enums.js';
import { SUPPORT_FORM_MSG, SUPPORT_MSG } from './messages.js';

const SUPPORT_URL = process.env.SUPPORT_URL;

export const MENU = [
    'Включить',
    'Выключить',
    'Управление подпиской',
    'Создать уведомление',
    'Пополнение счета',
    'Мой профиль',
    'Договор оферты',
    'Техническая поддержка',
];

export const MENU_KEYBOARD = sliceIntoChunks(MENU, 2);

export const SERVERS = [
    'DOWNTOWN',
    // 'STRAWBERRY',
    // 'VINEWOOD',
    // 'BLACKBERRY',
    // 'INSQUAD',
    // 'SUNRISE',
    // 'RAINBOW',
    // 'RICHMAN',
    // 'ECLIPSE',
    // 'LAMESA',
    // 'BURTON',
    // 'ROCKFORD',
    // 'ALTA',
];

export const CATEGORIES = [
    'Транспорт',
    // 'Недвижимость',
    // 'Бизнес',
    // 'Оказание услуг',
    // 'Барахолка',
    // 'Одежда',
    // 'Черный рынок',
];

export const SERVES_CALLBACKS = SERVERS.map((i) => i.toLowerCase());
export const CATEGORIES_CALLBACKS = CATEGORIES.map((i) =>
    oneWordCallback(i).toLowerCase()
);

export const CATEGORY_KEYBOARD = CATEGORIES.map((item) => getCallback(item));

export const SERVERS_KEYBOARD = SERVERS.map((item) => getCallback(item));

export const PAYMENT_KEYBOARD = [
    Markup.button.url(
        'Пополнение счета по ссылке',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    ),
];

export function oneWordCallback(text) {
    const collocation = text.split(' ');
    return collocation.length > 1 ? collocation[1] : text;
}

export function getCallback(item) {
    return [Markup.button.callback(item, oneWordCallback(item).toLowerCase())];
}

export const getSubscriptionsKeyboard = (subscriptions) => {
    return subscriptions.map((s) => [
        Markup.button.callback(
            `${s.server.toUpperCase()}` +
                ' - ' +
                `${s.category}` +
                ' - ' +
                `${TYPES[TYPE_CALLBACKS.indexOf(s.type)]}` +
                `${s.keywords ? ' - ' + s.keywords.join(' ') : ''}`,
            `${s.server}` +
                ' - ' +
                `${s.category}` +
                ' - ' +
                `${s.type}` +
                `${s.keywords ? ' - ' + s.keywords.join(' - ') : ''}`
        ),
    ]);
};

export const TYPE_CALLBACKS = Object.values(SubsTypeEnum);

export const TYPES = ['продам', 'обменяю', 'куплю', 'любое'];
export const TYPE_KEYBOARD = TYPES.map((value, index) =>
    Markup.button.callback(value, TYPE_CALLBACKS[index])
);

const RATE_TABLE = [{ text: '100₽ за 7 дней', rate: 100 }];

export const RATE_KEYBOARD = RATE_TABLE.map((value) =>
    Markup.button.callback(value.text, 'invoice' + ':' + value.rate)
);

export const SUPPORT_KEYBOARD = [
    Markup.button.url(SUPPORT_FORM_MSG, SUPPORT_URL),
];
