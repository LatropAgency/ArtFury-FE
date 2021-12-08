export class MessageService {
    static #messages = {
        'No active account found with the given credentials': 'Неверный логин или пароль',
        'This password is too short. It must contain at least 8 characters.': 'Пароль слишком короткий. Пароль должен содердать хотя бы 8 символов',
        'Enter a valid email address.': 'Введите валидный email',
        'This password is too common.': 'Пароль слишком простой',
        'This password is entirely numeric.': 'Пароль полностью состоит из цифр',
        'A user with that username already exists.': 'Пользователь с таким логином уже зарегистрирован',
        "Password fields didn't match.": 'Пароли не совпадают',
        'Old password is not correct': 'Неверный текущий пароль',
    }
    static getRUMessage = (engMessage) => {
        let message = this.#messages[engMessage];
        return message ? message : 'Что-то пошло не так';
    };
}