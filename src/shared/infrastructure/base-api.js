import axios from "axios";

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "/api/v1";

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

        this.#http.interceptors.response.use(response => response, error => {
            const problem = error.response?.data;
            if (problem && typeof problem === 'object') {
                error.message = problem.errors ? Object.values(problem.errors).flat().join(' ') :
                    problem.detail || problem.title || problem.message || error.message;
            }
            return Promise.reject(error);
        });

    }

    get http() {
        return this.#http;
    }
}
