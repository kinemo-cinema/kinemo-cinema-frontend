<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentStep = ref(1)
const selectedPlan = ref(null)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const company = ref('')
const phone = ref('')

const formError = ref('')

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$490',
    period: '/month',
    description: 'For small cinemas starting their 4D experience.',
    features: [
      'Up to 3 connected screens',
      'Basic synchronization',
      'Unified control panel',
      'Email support within 48h',
      'Monthly analytics reports'
    ]
  },

  {
    id: 'growth',
    name: 'Growth',
    price: '$1190',
    period: '/month',
    description: 'For growing cinema operators that need advanced tools.',
    popular: true,
    features: [
      'Up to 12 connected screens',
      'Advanced frame synchronization',
      'Incident and telemetry management',
      'Priority support within 4h',
      'Real-time analytics',
      'Full integration API'
    ]
  },

  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large cinema chains with multiple locations.',
    features: [
      'Unlimited connected screens',
      '99.9% guaranteed SLA',
      'Custom system integrations',
      'Dedicated account manager',
      'On-site onboarding',
      'Flexible contracts'
    ]
  }
]

const choosePlan = (plan) => {
  selectedPlan.value = plan
  currentStep.value = 2

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const submitRequest = () => {
  formError.value = ''

  if (
      !firstName.value ||
      !lastName.value ||
      !email.value ||
      !company.value ||
      !phone.value
  ) {
    formError.value = 'Please complete all required fields.'
    return
  }

  currentStep.value = 3

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const backToPlans = () => {
  currentStep.value = 1
}

const goToLogin = () => {
  router.push('/')
}
</script>


<template>

  <div class="subscription-page">

    <!-- ============================= -->
    <!-- HEADER -->
    <!-- ============================= -->

    <header class="subscription-header">

      <button
          class="brand"
          @click="goToLogin"
      >
        Kinemo<span>•</span>
      </button>


      <div
          v-if="currentStep !== 3"
          class="header-login"
      >
        <span>Already have an account?</span>

        <button @click="goToLogin">
          Sign In
        </button>
      </div>

    </header>


    <!-- ============================= -->
    <!-- STEPS -->
    <!-- ============================= -->

    <div
        v-if="currentStep !== 3"
        class="steps"
    >

      <div
          class="step"
          :class="{ active: currentStep >= 1 }"
      >
        <span>1</span>
        Choose plan
      </div>

      <div class="step-line"></div>

      <div
          class="step"
          :class="{ active: currentStep >= 2 }"
      >
        <span>2</span>
        Your information
      </div>

    </div>



    <!-- ===================================================== -->
    <!-- STEP 1 - PLANES -->
    <!-- ===================================================== -->

    <main
        v-if="currentStep === 1"
        class="plans-page"
    >

      <section class="plans-heading">

        <p class="eyebrow">
          KINEMO PLANS
        </p>

        <h1>
          Choose the plan that fits your cinema
        </h1>

        <p>
          Select the option that best fits your operation.
          You can scale your plan as your cinema grows.
        </p>

      </section>


      <section class="plans-grid">

        <article
            v-for="plan in plans"
            :key="plan.id"
            class="plan-card"
            :class="{ featured: plan.popular }"
        >

          <div
              v-if="plan.popular"
              class="popular"
          >
            MOST POPULAR
          </div>


          <p class="plan-name">
            {{ plan.name }}
          </p>


          <div class="price">

            <strong>
              {{ plan.price }}
            </strong>

            <span>
              {{ plan.period }}
            </span>

          </div>


          <p class="plan-description">
            {{ plan.description }}
          </p>


          <div class="divider"></div>


          <ul>

            <li
                v-for="feature in plan.features"
                :key="feature"
            >
              <span>✓</span>

              {{ feature }}
            </li>

          </ul>


          <button
              class="select-plan"
              @click="choosePlan(plan)"
          >
            {{
              plan.id === 'enterprise'
                  ? 'Request Enterprise'
                  : 'Choose ' + plan.name
            }}
          </button>

        </article>

      </section>

    </main>



    <!-- ===================================================== -->
    <!-- STEP 2 - DATOS -->
    <!-- ===================================================== -->

    <main
        v-if="currentStep === 2"
        class="information-page"
    >

      <section class="information-heading">

        <p class="eyebrow">
          YOUR INFORMATION
        </p>

        <h1>
          Tell us about your cinema
        </h1>

        <p>
          Complete your information and our team will
          contact you to continue with your Kinemo subscription.
        </p>

      </section>


      <div class="information-container">


        <!-- FORMULARIO -->

        <section class="information-card">

          <form @submit.prevent="submitRequest">


            <div class="form-row">

              <div class="form-group">

                <label>
                  First name
                </label>

                <input
                    v-model="firstName"
                    type="text"
                    placeholder="Andrea"
                />

              </div>


              <div class="form-group">

                <label>
                  Last name
                </label>

                <input
                    v-model="lastName"
                    type="text"
                    placeholder="Correa"
                />

              </div>

            </div>



            <div class="form-group">

              <label>
                Business email
              </label>

              <input
                  v-model="email"
                  type="email"
                  placeholder="name@cinema.com"
              />

            </div>



            <div class="form-group">

              <label>
                Cinema or company name
              </label>

              <input
                  v-model="company"
                  type="text"
                  placeholder="Cinema company"
              />

            </div>



            <div class="form-group">

              <label>
                Phone number
              </label>

              <input
                  v-model="phone"
                  type="tel"
                  placeholder="+51 999 999 999"
              />

            </div>


            <p
                v-if="formError"
                class="form-error"
            >
              {{ formError }}
            </p>


            <button
                type="submit"
                class="continue-button"
            >
              Submit subscription request
            </button>


            <button
                type="button"
                class="back-button"
                @click="backToPlans"
            >
              ← Back to plans
            </button>


          </form>

        </section>



        <!-- PLAN ELEGIDO -->

        <aside class="selected-plan">

          <p class="summary-label">
            SELECTED PLAN
          </p>

          <h2>
            {{ selectedPlan.name }}
          </h2>


          <div class="summary-price">

            <strong>
              {{ selectedPlan.price }}
            </strong>

            <span>
              {{ selectedPlan.period }}
            </span>

          </div>


          <div class="summary-divider"></div>


          <ul>

            <li
                v-for="feature in selectedPlan.features"
                :key="feature"
            >
              <span>✓</span>

              {{ feature }}
            </li>

          </ul>


          <button
              class="change-plan"
              @click="backToPlans"
          >
            Change plan
          </button>

        </aside>


      </div>

    </main>



    <!-- ===================================================== -->
    <!-- STEP 3 - CONFIRMACIÓN -->
    <!-- ===================================================== -->

    <main
        v-if="currentStep === 3"
        class="success-page"
    >

      <section class="success-card">


        <div class="success-icon">
          ✓
        </div>


        <p class="eyebrow">
          REQUEST RECEIVED
        </p>


        <h1>
          Thanks for choosing Kinemo!
        </h1>


        <p class="success-text">
          We've received your subscription request for the
          <strong>{{ selectedPlan.name }}</strong> plan.
        </p>


        <p class="success-contact">
          Our team will review your information and
          <strong>contact you soon</strong> to continue
          with the activation of your Kinemo account.
        </p>


        <div class="request-summary">

          <div>
            <span>Plan</span>
            <strong>{{ selectedPlan.name }}</strong>
          </div>

          <div>
            <span>Company</span>
            <strong>{{ company }}</strong>
          </div>

          <div>
            <span>Contact</span>
            <strong>{{ email }}</strong>
          </div>

        </div>


        <button
            class="return-login"
            @click="goToLogin"
        >
          Back to Sign In
        </button>


        <p class="simulation-note">
          No payment has been processed.
        </p>

      </section>

    </main>


  </div>

</template>


<style scoped>

/* ==========================================
   GENERAL
========================================== */

.subscription-page {
  width: 100%;
  min-height: 100vh;

  background:
      radial-gradient(
          circle at 50% 0%,
          rgba(139, 92, 246, 0.13),
          transparent 32%
      ),
      #0e0f17;

  color: #ffffff;

  font-family: Inter, Arial, sans-serif;
}


/* ==========================================
   HEADER
========================================== */

.subscription-header {
  width: 100%;
  height: 72px;

  padding: 0 5%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #2d2f45;
}


.brand {
  padding: 0;

  color: #34d6b0;

  background: transparent;
  border: none;

  font-size: 23px;
  font-weight: 800;

  cursor: pointer;
}


.brand span {
  color: #8b5cf6;
}


.header-login {
  display: flex;
  align-items: center;

  gap: 18px;

  color: #94a3b8;

  font-size: 13px;
}


.header-login button {
  padding: 9px 20px;

  color: white;

  background: transparent;

  border: 1px solid #454755;
  border-radius: 8px;

  cursor: pointer;
}


.header-login button:hover {
  border-color: #8b5cf6;
}


/* ==========================================
   PROGRESS
========================================== */

.steps {
  padding-top: 36px;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: 14px;
}


.step {
  display: flex;
  align-items: center;

  gap: 8px;

  color: #666876;

  font-size: 12px;
  font-weight: 600;
}


.step span {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #454755;
  border-radius: 50%;
}


.step.active {
  color: #ffffff;
}


.step.active span {
  color: white;

  background: #8b5cf6;

  border-color: #8b5cf6;
}


.step-line {
  width: 55px;
  height: 1px;

  background: #343642;
}


/* ==========================================
   HEADINGS
========================================== */

.eyebrow {
  color: #a78bfa;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 1.4px;
}


.plans-heading,
.information-heading {
  max-width: 700px;

  margin: 0 auto 45px;

  text-align: center;
}


.plans-heading h1,
.information-heading h1 {
  margin: 10px 0;

  font-size: clamp(30px, 4vw, 43px);

  letter-spacing: -1px;
}


.plans-heading > p:last-child,
.information-heading > p:last-child {
  color: #94a3b8;

  line-height: 1.6;

  font-size: 14px;
}


/* ==========================================
   PLAN PAGE
========================================== */

.plans-page {
  width: min(1180px, 92%);

  margin: 0 auto;

  padding: 48px 0 70px;
}


.plans-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 20px;
}


.plan-card {
  position: relative;

  min-height: 515px;

  padding: 31px;

  display: flex;
  flex-direction: column;

  background: #16171e;

  border: 1px solid #2d2f45;
  border-radius: 16px;
}


.plan-card.featured {
  border-color: #8b5cf6;

  background:
      linear-gradient(
          180deg,
          rgba(139, 92, 246, 0.13),
          #16171e 45%
      );
}


.popular {
  position: absolute;

  top: -13px;
  left: 50%;

  transform: translateX(-50%);

  padding: 6px 15px;

  background: #8b5cf6;

  border-radius: 30px;

  font-size: 10px;
  font-weight: 800;
}


.plan-name {
  margin: 0;

  color: #a78bfa;

  font-size: 13px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.7px;
}


.price {
  margin-top: 23px;

  display: flex;
  align-items: baseline;

  gap: 6px;
}


.price strong {
  font-size: 36px;
}


.price span {
  color: #94a3b8;

  font-size: 12px;
}


.plan-description {
  min-height: 43px;

  color: #a7a8b2;

  font-size: 13px;
  line-height: 1.5;
}


.divider,
.summary-divider {
  height: 1px;

  margin: 22px 0;

  background: #2d2f45;
}


.plan-card ul,
.selected-plan ul {
  padding: 0;

  list-style: none;
}


.plan-card li,
.selected-plan li {
  margin-bottom: 14px;

  color: #d8d8df;

  font-size: 13px;
}


.plan-card li span,
.selected-plan li span {
  margin-right: 8px;

  color: #34d6b0;
}


.select-plan {
  width: 100%;
  height: 46px;

  margin-top: auto;

  color: white;

  background: #292a34;

  border: 1px solid #3b3d49;
  border-radius: 8px;

  font-weight: 700;

  cursor: pointer;
}


.featured .select-plan {
  background: #8b5cf6;

  border-color: #8b5cf6;
}


.select-plan:hover {
  background: #7c4df1;

  border-color: #7c4df1;
}


/* ==========================================
   INFORMATION PAGE
========================================== */

.information-page {
  width: min(950px, 92%);

  margin: 0 auto;

  padding: 48px 0 80px;
}


.information-container {
  display: grid;

  grid-template-columns: 1.4fr 0.8fr;

  gap: 25px;

  align-items: start;
}


.information-card,
.selected-plan {
  padding: 32px;

  background: #16171e;

  border: 1px solid #2d2f45;
  border-radius: 16px;
}


.form-row {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 15px;
}


.form-group {
  margin-bottom: 19px;
}


.form-group label {
  display: block;

  margin-bottom: 8px;

  color: #d7d7dd;

  font-size: 12px;
  font-weight: 600;
}


.form-group input {
  width: 100%;
  height: 47px;

  padding: 0 14px;

  color: white;

  background: #101118;

  border: 1px solid #353744;
  border-radius: 8px;

  outline: none;

  font-family: inherit;
}


.form-group input:focus {
  border-color: #8b5cf6;

  box-shadow:
      0 0 0 3px rgba(139, 92, 246, 0.1);
}


.form-error {
  padding: 10px;

  color: #fca5a5;

  background: rgba(239, 68, 68, 0.07);

  border-radius: 7px;

  font-size: 12px;
}


.continue-button {
  width: 100%;
  height: 48px;

  margin-top: 5px;

  color: white;

  background: #8b5cf6;

  border: none;
  border-radius: 8px;

  font-weight: 700;

  cursor: pointer;
}


.continue-button:hover {
  background: #7c4df1;
}


.back-button {
  width: 100%;

  margin-top: 16px;

  color: #94a3b8;

  background: transparent;

  border: none;

  cursor: pointer;
}


/* SUMMARY */

.summary-label {
  color: #a78bfa;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 1px;
}


.selected-plan h2 {
  margin-bottom: 8px;

  font-size: 22px;
}


.summary-price {
  display: flex;
  align-items: baseline;

  gap: 5px;
}


.summary-price strong {
  font-size: 28px;
}


.summary-price span {
  color: #94a3b8;

  font-size: 11px;
}


.change-plan {
  padding: 0;

  color: #a78bfa;

  background: transparent;

  border: none;

  font-weight: 700;

  cursor: pointer;
}


/* ==========================================
   SUCCESS
========================================== */

.success-page {
  min-height: calc(100vh - 72px);

  padding: 60px 20px;

  display: flex;
  justify-content: center;
  align-items: center;
}


.success-card {
  width: 100%;
  max-width: 600px;

  padding: 48px;

  text-align: center;

  background: #16171e;

  border: 1px solid #2d2f45;
  border-radius: 16px;
}


.success-icon {
  width: 65px;
  height: 65px;

  margin: 0 auto 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;

  background: #34d6b0;

  border-radius: 50%;

  font-size: 28px;
  font-weight: 800;

  box-shadow:
      0 0 35px rgba(52, 214, 176, 0.18);
}


.success-card h1 {
  margin: 9px 0 17px;

  font-size: 31px;
}


.success-text,
.success-contact {
  color: #a8aab4;

  line-height: 1.65;

  font-size: 14px;
}


.success-text strong,
.success-contact strong {
  color: white;
}


.request-summary {
  margin: 30px 0;

  padding: 20px;

  background: #101118;

  border: 1px solid #2d2f45;
  border-radius: 10px;

  text-align: left;
}


.request-summary div {
  padding: 10px 0;

  display: flex;
  justify-content: space-between;

  gap: 20px;

  border-bottom: 1px solid #242631;
}


.request-summary div:last-child {
  border-bottom: none;
}


.request-summary span {
  color: #747684;

  font-size: 12px;
}


.request-summary strong {
  font-size: 12px;
}


.return-login {
  width: 100%;
  height: 48px;

  color: white;

  background: #8b5cf6;

  border: none;
  border-radius: 8px;

  font-weight: 700;

  cursor: pointer;
}


.return-login:hover {
  background: #7c4df1;
}


.simulation-note {
  margin: 17px 0 0;

  color: #5f616e;

  font-size: 10px;
}


/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 850px) {

  .plans-grid {
    grid-template-columns: 1fr;

    max-width: 500px;

    margin: auto;
  }


  .information-container {
    grid-template-columns: 1fr;
  }


  .selected-plan {
    order: -1;
  }

}


@media (max-width: 550px) {

  .subscription-header {
    padding: 0 20px;
  }


  .header-login span {
    display: none;
  }


  .steps {
    gap: 8px;
  }


  .step-line {
    width: 25px;
  }


  .step {
    font-size: 10px;
  }


  .form-row {
    grid-template-columns: 1fr;
  }


  .information-card,
  .selected-plan,
  .success-card {
    padding: 24px;
  }

}

</style>