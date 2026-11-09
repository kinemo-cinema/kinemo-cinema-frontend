import axios from "axios";

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3000/api";

const apiTimeout =
    Number(
        import.meta.env.VITE_API_TIMEOUT_MS
    ) || 15000;


export class BaseApi {

    #http;

    constructor() {

        this.#http = axios.create({

            baseURL: apiBaseUrl,

            timeout: apiTimeout,

            headers: {
                Accept: "application/json"
            }

        });

    }

    get http() {
        return this.#http;
    }
}