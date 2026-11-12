import axios from 'axios';
import { SubscriptionAssembler } from '../application/subscription.assembler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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
            throw error;
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