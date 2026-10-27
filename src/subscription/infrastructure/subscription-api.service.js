import axios from 'axios';
import { SubscriptionAssembler } from '../application/subscription.assembler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class SubscriptionApiService {
    constructor() {
        this.resourceEndpoint = `${API_BASE_URL}/subscriptions`;
    }

    async getSubscriptions() {
        try {
            const response = await axios.get(this.resourceEndpoint);
            // Mapea los datos crudos de la API a entidades del dominio usando el assembler
            return response.data.map(item => SubscriptionAssembler.toEntity(item));
        } catch (error) {
            console.error('Error fetching subscriptions from backend:', error);
            // Mock de respaldo por si el backend/json-server aún no está levantado
            return [
                new { id: 1, planName: 'Plan Anual Cinema VIP', price: 99.99, status: 'ACTIVE', renewalDate: '2027-01-15', contractId: 'CTR-2026-001' },
                new { id: 2, planName: 'Plan Mensual Estándar', price: 14.99, status: 'PENDING', renewalDate: '2026-11-01', contractId: 'CTR-2026-002' }
            ];
        }
    }

    async createSubscription(subscriptionData) {
        try {
            const resource = SubscriptionAssembler.toResource(subscriptionData);
            const response = await axios.post(this.resourceEndpoint, resource);
            return SubscriptionAssembler.toEntity(response.data);
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }
}