import { ref } from 'vue';
import { BaseApi } from '../infrastructure/base-api.js';
import '../presentation/connected.css';

export function useBackend() {
    const http = new BaseApi().http;
    const busy = ref(false);
    const error = ref('');
    async function run(operation) {
        if (busy.value) return false;
        busy.value = true;
        error.value = '';
        try {
            await operation(http);
            return true;
        } catch (failure) {
            const data = failure.response?.data;
            error.value = data?.message || (data?.errors ? Object.values(data.errors).flat().join(' ') :
                `No se pudo completar la operación${failure.response ? ` (${failure.response.status})` : ': servidor no disponible'}.`);
            return false;
        } finally {
            busy.value = false;
        }
    }
    return { http, busy, error, run };
}
