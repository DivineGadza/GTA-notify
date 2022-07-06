export const WELCOME_MSG = 'Welcome';
export const ON_MESSAGE_MSG = 'Уведомления включены';
export const OFF_MESSAGE_MSG = 'Уведомления выключены';
export const CHOOSE_TYPE_MSG = 'Выберите тип объявления';
export const KEYWORDS_MSG = 'Введите фильтр (к примеру Audi RS5)' + '\n' +
    'Бот будет присылать вам только те сообщения, в которых есть все слова по точным совпадениям.' + '\n'  + '\n' +
    'Без ввода фильтра Вам будут все уведомления указанного типа'
;
export const SUPPORT_MSG = 'Обращение в тех.поддержку';
export const SUPPORT_FORM_MSG = 'Ссылка на Google форму';
export const PAYMENT_MSG = 'Пополнить счет можно по ссылке';
export const LINK_CONTRACT_MSG = 'Ссылка на договор оферты'
export const LINK_CONTRACT_BUTTON = 'Договор оферты - Google Drive'
export const NOT_ENOUGH_BALANCE_MSG = 'Недостаточно средств на вашем балансе'
export const WITHOUT_SUBSCRIPTION_MSG = 'Подписка не оформлена'

export const getUserBalanceMessage = (curUser) => {
    return `Ваш баланс: ${curUser.balance}₽` + `\n`
}

export const getUserNotifications = (curUser) => {
    return `Уведомления: ${curUser.isActive ? 'включены' : 'выключены'}` + `\n`
}

export const getUserAccount = (curUser) => {
    return `Подписка: ${curUser.isPaid ? 'оплачена' : 'не оплачена'}` + `\n`
}

export const getUserSubscriptions = (subscriptions) => {
    return `${
        subscriptions.length > 0
            ? 'Ваши уведомления (нажмите, чтобы удалить):'
            : 'Уведомлений нет'
    }` + `\n`
}

export const getUserInfoMessage = (curUser, subscriptions) => {
    return getUserBalanceMessage(curUser) +
        getUserNotifications(curUser) +
        getUserAccount(curUser) +
        getUserSubscriptions(subscriptions)
}
