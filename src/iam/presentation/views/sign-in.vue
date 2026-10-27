<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')

const signIn = () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  // Login temporal hasta conectar el backend.
  localStorage.setItem('kinemo-authenticated', 'true')

  router.push('/dashboard')
}

const goToSubscription = () => {
  router.push('/subscriptions')
}
</script>

<template>
  <div class="login-page">

    <!-- Branding superior -->
    <header class="login-header">
      <div class="brand">
        Kinemo<span class="brand-dot">•</span>
      </div>
    </header>

    <!-- Contenido -->
    <main class="login-content">

      <section class="login-card">

        <div class="login-heading">
          <div class="logo-icon">K</div>

          <h1>Welcome back</h1>

          <p>
            Sign in to manage your 4D cinema experience.
          </p>
        </div>

        <form @submit.prevent="signIn">

          <!-- Email -->
          <div class="form-group">
            <label for="email">Email address</label>

            <input
                id="email"
                v-model="email"
                type="email"
                placeholder="name@cinema.com"
                autocomplete="email"
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <div class="password-label">
              <label for="password">Password</label>

              <button
                  type="button"
                  class="forgot-button"
              >
                Forgot password?
              </button>
            </div>

            <div class="password-input">
              <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  autocomplete="current-password"
              />

              <button
                  type="button"
                  class="show-password"
                  @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <p
              v-if="errorMessage"
              class="error-message"
          >
            {{ errorMessage }}
          </p>

          <!-- Login -->
          <button
              type="submit"
              class="sign-in-button"
          >
            Sign In
          </button>

        </form>

        <!-- Separador -->
        <div class="separator">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <!-- Suscripción -->
        <div class="subscription-section">
          <p class="new-user">
            New to Kinemo?
          </p>

          <p class="subscription-description">
            Choose a plan and start managing your
            4D cinema with Kinemo.
          </p>

          <button
              class="subscription-button"
              @click="goToSubscription"
          >
            Subscribe now
            <span>→</span>
          </button>
        </div>

      </section>

    </main>

    <footer class="login-footer">
      <p>© 2026 Kinemo. 4D Cinema Technology.</p>
    </footer>

  </div>
</template>

<style scoped>

.login-page {
  width: 100%;
  min-height: 100vh;

  background:
      radial-gradient(
          circle at 50% 15%,
          rgba(139, 92, 246, 0.12),
          transparent 35%
      ),
      #0e0f17;

  color: #ffffff;
  font-family: Inter, Arial, sans-serif;

  display: flex;
  flex-direction: column;
}

/* HEADER */

.login-header {
  height: 72px;
  padding: 0 48px;

  display: flex;
  align-items: center;

  border-bottom: 1px solid #2d2f45;
}

.brand {
  color: #34d6b0;
  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.brand-dot {
  color: #8b5cf6;
  margin-left: 3px;
}

/* CONTENT */

.login-content {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 48px 20px;
}

/* CARD */

.login-card {
  width: 100%;
  max-width: 440px;

  padding: 38px;

  background: rgba(22, 23, 30, 0.96);

  border: 1px solid #2d2f45;
  border-radius: 16px;

  box-shadow:
      0 25px 70px rgba(0, 0, 0, 0.35),
      0 0 40px rgba(139, 92, 246, 0.05);
}

/* TITLE */

.login-heading {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 46px;
  height: 46px;

  margin: 0 auto 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 12px;

  background: linear-gradient(
      135deg,
      #8b5cf6,
      #6d3df0
  );

  font-size: 21px;
  font-weight: 800;

  box-shadow: 0 0 25px rgba(139, 92, 246, 0.25);
}

.login-heading h1 {
  margin: 0;

  font-size: 28px;
  font-weight: 700;
}

.login-heading p {
  margin: 9px 0 0;

  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

/* FORM */

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  color: #d8d8df;

  font-size: 13px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  height: 48px;

  box-sizing: border-box;

  padding: 0 14px;

  color: #ffffff;

  background: #101118;

  border: 1px solid #343644;
  border-radius: 8px;

  outline: none;

  font-family: inherit;
  font-size: 14px;

  transition: 0.2s ease;
}

.form-group input::placeholder {
  color: #646675;
}

.form-group input:focus {
  border-color: #8b5cf6;

  box-shadow:
      0 0 0 3px rgba(139, 92, 246, 0.12);
}

/* PASSWORD */

.password-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.forgot-button {
  padding: 0;
  margin-bottom: 8px;

  color: #a78bfa;

  background: transparent;
  border: none;

  font-size: 12px;

  cursor: pointer;
}

.forgot-button:hover {
  color: #c4b5fd;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 65px;
}

.show-password {
  position: absolute;

  right: 14px;
  top: 50%;

  transform: translateY(-50%);

  color: #a78bfa;

  background: transparent;
  border: none;

  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
}

/* ERROR */

.error-message {
  padding: 10px 12px;

  color: #fca5a5;

  background: rgba(239, 68, 68, 0.08);

  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;

  font-size: 12px;
}

/* BUTTON */

.sign-in-button {
  width: 100%;
  height: 48px;

  margin-top: 4px;

  color: white;

  background: #8b5cf6;

  border: none;
  border-radius: 8px;

  font-family: inherit;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;
}

.sign-in-button:hover {
  background: #7c4df1;

  transform: translateY(-1px);

  box-shadow:
      0 8px 25px rgba(139, 92, 246, 0.25);
}

/* SEPARATOR */

.separator {
  display: flex;
  align-items: center;
  gap: 13px;

  margin: 27px 0 23px;
}

.separator span {
  height: 1px;
  flex: 1;

  background: #2d2f45;
}

.separator p {
  margin: 0;

  color: #686a78;

  font-size: 10px;
  font-weight: 700;
}

/* SUBSCRIPTION */

.subscription-section {
  text-align: center;
}

.new-user {
  margin: 0 0 5px;

  color: #ffffff;

  font-size: 15px;
  font-weight: 700;
}

.subscription-description {
  max-width: 310px;

  margin: 0 auto 17px;

  color: #94a3b8;

  font-size: 13px;
  line-height: 1.5;
}

.subscription-button {
  color: #a78bfa;

  background: transparent;
  border: none;

  font-family: inherit;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
}

.subscription-button span {
  margin-left: 4px;

  transition: margin-left 0.2s ease;
}

.subscription-button:hover {
  color: #c4b5fd;
}

.subscription-button:hover span {
  margin-left: 9px;
}

/* FOOTER */

.login-footer {
  padding: 22px;

  text-align: center;

  color: #646675;

  font-size: 11px;
}

/* RESPONSIVE */

@media (max-width: 600px) {

  .login-header {
    height: 64px;
    padding: 0 22px;
  }

  .login-content {
    align-items: flex-start;

    padding: 30px 16px;
  }

  .login-card {
    padding: 28px 22px;
  }

}
</style>