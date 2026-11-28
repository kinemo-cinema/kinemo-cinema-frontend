<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { BaseApi } from '../../../shared/infrastructure/base-api.js';
import '../subscription.css';

const router = useRouter();
const { locale } = useI18n();
const api = new BaseApi();

const isSpanish = computed(() => locale.value.startsWith('es'));
const tr = (es, en) => isSpanish.value ? es : en;

const currentStep = ref(1);
const selectedPlan = ref(null);
const cinemaId = ref(null);
const plans = ref([]);
const plansLoading = ref(true);
const plansError = ref('');
const formError = ref('');
const submitting = ref(false);

const planType = plan =>
    String(plan?.planType || plan?.name || '').toLowerCase();

const planContent = computed(() => ({
  starter: {
    icon: 'pi pi-video',
    description: tr(
        'Ideal para cines independientes que buscan digitalizar sus operaciones.',
        'Ideal for independent cinemas looking to digitalize their operations.'
    ),
    features: [
      tr('Catálogo de películas y contenido sensorial', 'Movie and sensory content catalog'),
      tr('Programación de funciones', 'Show scheduling'),
      tr('Gestión de salas y asientos', 'Room and seat management'),
      tr('Control de ejecución 4D', '4D execution control'),
      tr('Gestión de mantenimiento', 'Maintenance management'),
      tr('Reportes operativos', 'Operational reports')
    ],
    support: tr('Soporte estándar', 'Standard support')
  },
  growth: {
    icon: 'pi pi-chart-line',
    description: tr(
        'Diseñado para cines en crecimiento con mayores necesidades operativas.',
        'Designed for growing cinemas with greater operational needs.'
    ),
    features: [
      tr('Todos los beneficios de Starter', 'All Starter benefits'),
      tr('Gestión de múltiples salas', 'Multi-screen management'),
      tr('Análisis de rendimiento', 'Performance analytics'),
      tr('Integraciones de ticketing', 'Ticketing integrations'),
      tr('Reportes operativos avanzados', 'Advanced operational reports'),
      tr('Soporte prioritario', 'Priority support')
    ],
    support: tr('Soporte prioritario', 'Priority support')
  },
  enterprise: {
    icon: 'pi pi-building',
    description: tr(
        'Una solución para complejos cinematográficos de mayor capacidad.',
        'A solution for large-scale cinema complexes.'
    ),
    features: [
      tr('Todos los beneficios de Growth', 'All Growth benefits'),
      tr('Operaciones de mayor capacidad', 'Large-scale operations'),
      tr('Gestión centralizada de salas', 'Centralized screen management'),
      tr('Acompañamiento en la implementación', 'Implementation assistance'),
      tr('Capacitación personalizada', 'Personalized training'),
      tr('Soporte técnico dedicado', 'Dedicated technical support')
    ],
    support: tr('Soporte dedicado', 'Dedicated support')
  }
}));

const getContent = plan =>
    planContent.value[planType(plan)] || {
      icon: 'pi pi-box',
      description: tr(
          'Plan de suscripción Kinemo.',
          'Kinemo subscription plan.'
      ),
      features: [],
      support: '—'
    };

const isRecommended = plan => planType(plan) === 'growth';

const formatPrice = price =>
    new Intl.NumberFormat(isSpanish.value ? 'es-PE' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(Number(price));

const comparisonRows = computed(() => [
  {
    label: tr('Precio mensual', 'Monthly price'),
    values: plans.value.map(plan => formatPrice(plan.price))
  },
  {
    label: tr('Máximo de salas', 'Maximum screens'),
    values: plans.value.map(plan => plan.maxScreens)
  },
  {
    label: tr('Catálogo y contenido sensorial', 'Catalog and sensory content'),
    values: plans.value.map(() => true)
  },
  {
    label: tr('Programación de funciones', 'Show scheduling'),
    values: plans.value.map(() => true)
  },
  {
    label: tr('Gestión de salas y asientos', 'Room and seat management'),
    values: plans.value.map(() => true)
  },
  {
    label: tr('Ejecución 4D', '4D execution'),
    values: plans.value.map(() => true)
  },
  {
    label: tr('Seguridad y emergencias', 'Safety and emergencies'),
    values: plans.value.map(() => true)
  },
  {
    label: tr('Gestión de mantenimiento', 'Maintenance management'),
    values: plans.value.map(() => true)
  },
  {
    label: tr('Reportes operativos', 'Operational reports'),
    values: plans.value.map(() => true)
  },
  {
    label: tr('Análisis de rendimiento*', 'Performance analytics*'),
    values: plans.value.map(plan =>
        planType(plan) === 'starter'
            ? tr('Básico', 'Basic')
            : tr('Avanzado', 'Advanced')
    )
  },
  {
    label: tr('Integración de ticketing*', 'Ticketing integration*'),
    values: plans.value.map(plan => planType(plan) !== 'starter')
  },
  {
    label: tr('Capacitación personalizada*', 'Personalized training*'),
    values: plans.value.map(plan => planType(plan) === 'enterprise')
  },
  {
    label: tr('Nivel de soporte*', 'Support level*'),
    values: plans.value.map(plan => getContent(plan).support)
  }
]);

const loadPlans = async () => {
  plansLoading.value = true;
  plansError.value = '';

  try {
    const { data } = await api.http.get('/subscription-plans');
    const records = data.value ?? data;

    plans.value = Array.isArray(records)
        ? [...records].sort((a, b) => a.price - b.price)
        : [];
  } catch {
    plansError.value = tr(
        'No se pudieron consultar los planes.',
        'Unable to load subscription plans.'
    );
  } finally {
    plansLoading.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const choosePlan = plan => {
  selectedPlan.value = plan;
  currentStep.value = 2;
  formError.value = '';
  scrollToTop();
};

const backToPlans = () => {
  currentStep.value = 1;
  formError.value = '';
  scrollToTop();
};

const submitRequest = async () => {
  if (submitting.value || !selectedPlan.value) return;

  formError.value = '';

  if (!Number.isInteger(cinemaId.value) || cinemaId.value < 1) {
    formError.value = tr(
        'Ingresa un identificador de cine válido.',
        'Enter a valid cinema identifier.'
    );

    return;
  }

  submitting.value = true;

  try {
    await api.http.post('/subscriptions', {
      cinemaId: cinemaId.value,
      planId: selectedPlan.value.id
    });

    currentStep.value = 3;
    scrollToTop();
  } catch (error) {
    formError.value =
        error.response?.data?.message ||
        tr(
            'No se pudo registrar la suscripción.',
            'Unable to register the subscription.'
        );
  } finally {
    submitting.value = false;
  }
};

const goToLogin = () => router.push('/');
const goToManagement = () => router.push('/subscriptions/manage');

onMounted(loadPlans);
</script>

<template>
  <div class="sb-public">
    <header class="sb-public-header">
      <router-link to="/" class="sb-brand">
        Kinemo<span>.</span>
      </router-link>

      <div class="sb-actions">
        <div class="sb-language">
          <button
              type="button"
              :class="{ 'sb-selected': !isSpanish }"
              @click="locale = 'en'"
          >
            EN
          </button>

          <button
              type="button"
              :class="{ 'sb-selected': isSpanish }"
              @click="locale = 'es'"
          >
            ES
          </button>
        </div>

        <button
            type="button"
            class="sb-button sb-secondary"
            :disabled="submitting"
            @click="goToLogin"
        >
          <i class="pi pi-sign-in"/>
          {{ tr('Iniciar sesión', 'Sign In') }}
        </button>
      </div>
    </header>

    <main class="sb-public-content">
      <div v-if="currentStep !== 3" class="sb-steps">
        <div
            class="sb-step"
            :class="{ 'sb-step-active': currentStep >= 1 }"
        >
          <span>
            <i v-if="currentStep > 1" class="pi pi-check"/>
            <template v-else>1</template>
          </span>

          {{ tr('Elegir plan', 'Choose Plan') }}
        </div>

        <div class="sb-step-line"/>

        <div
            class="sb-step"
            :class="{ 'sb-step-active': currentStep >= 2 }"
        >
          <span>2</span>
          {{ tr('Información', 'Your Information') }}
        </div>
      </div>

      <template v-if="currentStep === 1">
        <section class="sb-public-heading sb-pricing-heading">
          <p class="sb-eyebrow">
            {{ tr('Planes Kinemo', 'Kinemo Plans') }}
          </p>

          <h1>
            {{ tr('Un plan para cada cine', 'A plan for every cinema') }}<span>.</span>
          </h1>

          <p>
            {{
              tr(
                  'Simplifica tus operaciones y lleva la experiencia 4D de tu cine al siguiente nivel.',
                  'Simplify your operations and take your cinema’s 4D experience to the next level.'
              )
            }}
          </p>

          <div class="sb-billing-label">
            <i class="pi pi-calendar"/>
            {{ tr('Suscripción mensual', 'Monthly subscription') }}
          </div>
        </section>

        <div v-if="plansError" class="sb-alert sb-error" role="alert">
          <i class="pi pi-exclamation-circle"/>
          {{ plansError }}

          <button
              type="button"
              class="sb-button sb-secondary"
              @click="loadPlans"
          >
            {{ tr('Reintentar', 'Retry') }}
          </button>
        </div>

        <div
            v-else-if="plansLoading || !plans.length"
            class="sb-card sb-empty"
        >
          <i :class="plansLoading ? 'pi pi-spin pi-spinner' : 'pi pi-box'"/>

          <h3>
            {{
              plansLoading
                  ? tr('Consultando planes...', 'Loading plans...')
                  : tr('No hay planes disponibles', 'No plans available')
            }}
          </h3>

          <p v-if="!plansLoading">
            {{
              tr(
                  'Los planes registrados aparecerán aquí.',
                  'Registered plans will appear here.'
              )
            }}
          </p>
        </div>

        <template v-else>
          <section class="sb-plans">
            <article
                v-for="plan in plans"
                :key="plan.id"
                class="sb-plan sb-pricing-card"
                :class="{ 'sb-plan-recommended': isRecommended(plan) }"
            >
              <div class="sb-plan-top">
                <div class="sb-module-icon">
                  <i :class="getContent(plan).icon"/>
                </div>

                <span
                    v-if="isRecommended(plan)"
                    class="sb-recommended-label"
                >
                  <i class="pi pi-star-fill"/>
                  {{ tr('Recomendado', 'Recommended') }}
                </span>
              </div>

              <div class="sb-plan-intro">
                <h2>{{ plan.name }}</h2>

                <p class="sb-plan-description">
                  {{ getContent(plan).description }}
                </p>
              </div>

              <div class="sb-price-section">
                <div class="sb-price-line">
                  <strong class="sb-price">
                    {{ formatPrice(plan.price) }}
                  </strong>

                  <span>{{ tr('/ mes', '/ month') }}</span>
                </div>

                <small>USD</small>
              </div>

              <button
                  type="button"
                  class="sb-button"
                  :class="isRecommended(plan) ? 'sb-primary' : 'sb-secondary'"
                  @click="choosePlan(plan)"
              >
                {{ tr('Elegir', 'Choose') }} {{ plan.name }}
                <i class="pi pi-arrow-right"/>
              </button>

              <div class="sb-plan-capacity">
                <i class="pi pi-desktop"/>

                <div>
                  <strong>
                    {{ tr('Hasta', 'Up to') }}
                    {{ plan.maxScreens }}
                    {{ tr('salas', 'screens') }}
                  </strong>

                  <small>
                    {{ tr('Capacidad del plan', 'Plan capacity') }}
                  </small>
                </div>
              </div>

              <div class="sb-benefits">
                <h3>{{ tr('Beneficios del plan', 'Plan benefits') }}</h3>

                <div
                    v-for="feature in getContent(plan).features"
                    :key="feature"
                    class="sb-benefit"
                >
                  <i class="pi pi-check"/>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </article>
          </section>

          <section class="sb-trust">
            <div class="sb-trust-item">
              <i class="pi pi-shield"/>

              <div>
                <strong>
                  {{ tr('Seguridad en todos los planes', 'Safety in every plan') }}
                </strong>

                <p>
                  {{ tr('Control operativo y de emergencias.', 'Operational and emergency control.') }}
                </p>
              </div>
            </div>

            <div class="sb-trust-item">
              <i class="pi pi-chart-line"/>

              <div>
                <strong>
                  {{ tr('Crece con Kinemo', 'Grow with Kinemo') }}
                </strong>

                <p>
                  {{ tr('Cambia de plan según tus necesidades.', 'Change plans as your needs evolve.') }}
                </p>
              </div>
            </div>

            <div class="sb-trust-item">
              <i class="pi pi-cog"/>

              <div>
                <strong>
                  {{ tr('Gestión centralizada', 'Centralized management') }}
                </strong>

                <p>
                  {{ tr('Tus operaciones en una plataforma.', 'Your operations in one platform.') }}
                </p>
              </div>
            </div>
          </section>

        </template>

        <div class="sb-alert sb-info sb-payment-notice">
          <i class="pi pi-info-circle"/>

          {{
            tr(
                'Seleccionar un plan no genera ningún cargo. Los pagos aún no están habilitados.',
                'Selecting a plan does not generate any charges. Payments are not enabled yet.'
            )
          }}
        </div>
      </template>

      <template v-else-if="currentStep === 2 && selectedPlan">
        <section class="sb-public-heading">
          <p class="sb-eyebrow">
            {{ tr('Tu información', 'Your Information') }}
          </p>

          <h1>{{ tr('Registra tu cine', 'Register your cinema') }}</h1>

          <p>
            {{
              tr(
                  'Completa la información necesaria para registrar tu suscripción.',
                  'Complete the required information to register your subscription.'
              )
            }}
          </p>
        </section>

        <div class="sb-checkout">
          <article class="sb-card">
            <header class="sb-card-header">
              <div>
                <h2>{{ tr('Información del cine', 'Cinema Information') }}</h2>

                <p>
                  {{ tr('Completa los datos requeridos.', 'Complete the required information.') }}
                </p>
              </div>
            </header>

            <div class="sb-card-body">
              <form
                  class="sb-checkout-form"
                  @submit.prevent="submitRequest"
              >
                <div class="sb-field">
                  <label for="cinema-id">
                    {{ tr('Identificador del cine', 'Cinema ID') }}
                  </label>

                  <input
                      id="cinema-id"
                      v-model.number="cinemaId"
                      class="sb-input"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="1"
                      required
                      :disabled="submitting"
                  />
                </div>

                <div
                    v-if="formError"
                    class="sb-alert sb-error"
                    role="alert"
                >
                  <i class="pi pi-exclamation-circle"/>
                  {{ formError }}
                </div>

                <div class="sb-alert sb-info">
                  <i class="pi pi-info-circle"/>

                  {{
                    tr(
                        'No se realizará ningún cobro al registrar la suscripción.',
                        'No payment will be charged when registering your subscription.'
                    )
                  }}
                </div>

                <button
                    type="submit"
                    class="sb-button sb-primary"
                    :disabled="submitting"
                >
                  <i :class="submitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"/>

                  {{ tr('Registrar suscripción', 'Register Subscription') }}
                </button>

                <button
                    type="button"
                    class="sb-button sb-secondary"
                    :disabled="submitting"
                    @click="backToPlans"
                >
                  <i class="pi pi-arrow-left"/>
                  {{ tr('Volver a los planes', 'Back to Plans') }}
                </button>
              </form>
            </div>
          </article>

          <article class="sb-plan sb-checkout-summary">
            <p class="sb-eyebrow">
              {{ tr('Resumen de suscripción', 'Subscription Summary') }}
            </p>

            <div class="sb-module-icon">
              <i :class="getContent(selectedPlan).icon"/>
            </div>

            <h2>{{ selectedPlan.name }}</h2>

            <div class="sb-price-line">
              <strong class="sb-price">
                {{ formatPrice(selectedPlan.price) }}
              </strong>

              <span>{{ tr('/ mes', '/ month') }}</span>
            </div>

            <p class="sb-plan-description">
              {{ getContent(selectedPlan).description }}
            </p>

            <div class="sb-plan-capacity">
              <i class="pi pi-desktop"/>

              <strong>
                {{ tr('Hasta', 'Up to') }}
                {{ selectedPlan.maxScreens }}
                {{ tr('salas', 'screens') }}
              </strong>
            </div>

            <div class="sb-benefits">
              <div
                  v-for="feature in getContent(selectedPlan).features"
                  :key="feature"
                  class="sb-benefit"
              >
                <i class="pi pi-check"/>
                <span>{{ feature }}</span>
              </div>
            </div>

            <button
                type="button"
                class="sb-button sb-secondary"
                :disabled="submitting"
                @click="backToPlans"
            >
              {{ tr('Cambiar plan', 'Change Plan') }}
            </button>
          </article>
        </div>
      </template>

      <template v-else-if="currentStep === 3">
        <section class="sb-confirmation">
          <div class="sb-confirmation-icon">
            <i class="pi pi-check"/>
          </div>

          <p class="sb-eyebrow">
            {{ tr('Suscripción registrada', 'Subscription Registered') }}
          </p>

          <h1>
            {{ tr('¡Gracias por elegir Kinemo!', 'Thanks for choosing Kinemo!') }}
          </h1>

          <p>
            {{
              tr(
                  'Tu suscripción se ha registrado correctamente.',
                  'Your subscription has been registered successfully.'
              )
            }}
          </p>

          <div class="sb-information">
            <div class="sb-info-item">
              <span>{{ tr('Plan seleccionado', 'Selected Plan') }}</span>
              <strong>{{ selectedPlan.name }}</strong>
            </div>

            <div class="sb-info-item">
              <span>Cinema ID</span>
              <strong>#{{ cinemaId }}</strong>
            </div>

            <div class="sb-info-item">
              <span>{{ tr('Precio mensual', 'Monthly Price') }}</span>
              <strong>{{ formatPrice(selectedPlan.price) }}</strong>
            </div>

            <div class="sb-info-item">
              <span>{{ tr('Máximo de salas', 'Maximum Screens') }}</span>
              <strong>{{ selectedPlan.maxScreens }}</strong>
            </div>
          </div>

          <button
              type="button"
              class="sb-button sb-primary"
              @click="goToLogin"
          >
            {{ tr('Volver al inicio de sesión', 'Back to Sign In') }}
            <i class="pi pi-arrow-right"/>
          </button>

          <button
              type="button"
              class="sb-button sb-secondary"
              @click="goToManagement"
          >
            {{ tr('Ver suscripciones', 'View Subscriptions') }}
          </button>

          <p>
            {{ tr('No se ha procesado ningún pago.', 'No payment has been processed.') }}
          </p>
        </section>
      </template>
    </main>

    <footer class="sb-public-footer">
      <router-link to="/" class="sb-brand">
        Kinemo<span>.</span>
      </router-link>

      <p>
        © {{ new Date().getFullYear() }} Kinemo.
        {{ tr('Todos los derechos reservados.', 'All rights reserved.') }}
      </p>
    </footer>
  </div>
</template>
