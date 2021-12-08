const axios = require("axios").default;


export class APIService {

    static #HOST = process.env.HOST || "0.0.0.0";
    static #PORT = process.env.PORT || 8000;
    static #PROTOCOL = process.env.PROTOCOL || 'http';

    static #getJsonHeaders = (accessToken = null) => {
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };
        if (accessToken)
            headers.Authorization = `Bearer ${accessToken}`;
        return headers;
    };


    static #getMultipartHeaders = (accessToken = null) => {
        let headers = {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
        };
        if (accessToken)
            headers.Authorization = `Bearer ${accessToken}`;
        return headers;
    }

    static #send_request = (method, url, {data, params, type} = {}) => {
        const accessToken = localStorage.getItem('accessToken');
        let headers;
        if (type === "multipart")
            headers = this.#getMultipartHeaders(accessToken);
        else
            headers = this.#getJsonHeaders(accessToken);
        return axios(
            {
                baseURL: `${this.#PROTOCOL}://${this.#HOST}:${this.#PORT}`,
                method: method,
                url: url,
                data: data,
                params: params,
                headers: headers
            }
        );
    };

    static signIn = (username, password) => {
        return this.#send_request(
            'POST',
            'api/token/',
            {
                data: {
                    username: username,
                    password: password,
                },
            }
        );
    };

    static updateTokens = (refreshToken) => {
        return this.#send_request(
            'POST',
            'api/token/refresh/',
            {
                data: {
                    refresh: refreshToken,
                },
            }
        );
    };

    static signUp = (username, firstName, lastName, email, password, password2) => {
        return this.#send_request(
            'POST',
            'api/user/signup/',
            {
                data: {
                    username: username,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password,
                    password2: password2,
                },
            }
        );
    };

    static changeUserPassword = (oldPassword, password, password2) => {
        return this.#send_request(
            'PUT',
            'api/user/password/',
            {
                data: {
                    old_password: oldPassword,
                    password: password,
                    password2: password2,
                },
            }
        );
    };

    static getCurrentUser = () => {
        return this.#send_request(
            'GET',
            'api/user/',
        );
    };


    static getOrders = (params = {}) => {
        return this.#send_request(
            'GET',
            `api/orders/`,
            {params: params}
        );
    };
    static getUserOrders = (params = {}) => {
        return this.#send_request(
            'GET',
            `api/user/orders/`,
            {params: params}
        );
    };
    static getOrder = (id) => {
        return this.#send_request(
            'GET',
            `api/orders/${id}/`,
        );
    };
    static switchOrderStatus = (id) => {
        return this.#send_request(
            'GET',
            `api/orders/${id}/switch/`,
        );
    };
    static getAuthors = () => {
        return this.#send_request(
            'GET',
            `api/authors/`,
        );
    };
    static getAuthor = (id) => {
        return this.#send_request(
            'GET',
            `api/authors/${id}/`,
        );
    };
    static getAuthorComments = (id) => {
        return this.#send_request(
            'GET',
            `api/comments/${id}/user/`,
        );
    };
    static createComment = (userId, message) => {
        return this.#send_request(
            'POST',
            `api/comments/`,
            {
                data: {
                    user: userId,
                    message: message
                }
            }
        );
    };
    static getCategories = () => {
        return this.#send_request(
            'GET',
            `api/categories/`,
        );
    };
    static getChats = (page) => {
        return this.#send_request(
            'GET',
            `api/chats/`,
            {
                params: {
                    page: page
                }
            }
        );
    };
    static getChat = (id) => {
        return this.#send_request(
            'GET',
            `api/chats/${id}`,
        );
    };
    static createChat = (orderId, producerId, consumerId) => {
        return this.#send_request(
            'POST',
            `api/chats/`,
            {
                data: {
                    order: orderId,
                    producer: producerId,
                    consumer: consumerId
                }
            }
        );
    };
    static createOrder = (formData) => {
        return this.#send_request(
            'POST',
            `api/orders/`,
            {
                data: formData,
                type: "multipart"
            }
        );
    };
    static updateOrder = (id, formData) => {
        return this.#send_request(
            'PUT',
            `api/orders/${id}/`,
            {
                data: formData,
                type: "multipart"
            }
        );
    };
    static getChatMessages = (id, page) => {
        return this.#send_request(
            'GET',
            `api/chats/${id}/messages/`,
            {
                params: {
                    page: page
                },
            }
        );
    };
    static updateProfile = (firstName, lastName) => {
        return this.#send_request(
            'PUT',
            `api/user/`,
            {
                data: {
                    first_name: firstName,
                    last_name: lastName
                },
            }
        );
    };
}