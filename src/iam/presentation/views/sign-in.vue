<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')

const translations = {
  en: {
    subtitle: 'Intelligent 4D Cinema Management',
    email: 'Corporate email',
    password: 'Password',
    placeholder: 'Enter your password',
    access: 'Access dashboard',
    newUser: 'New to Kinemo?',
    plans: 'Explore plans',
    required: 'Please complete all fields.',
    invalid: 'Please enter a valid email address.',
    show: 'Show password',
    hide: 'Hide password'
  },
  es: {
    subtitle: 'Gestión inteligente de cines 4D',
    email: 'Correo corporativo',
    password: 'Contraseña',
    placeholder: 'Ingresa tu contraseña',
    access: 'Ingresar al panel',
    newUser: '¿Nuevo en Kinemo?',
    plans: 'Explorar planes',
    required: 'Completa todos los campos.',
    invalid: 'Ingresa un correo electrónico válido.',
    show: 'Mostrar contraseña',
    hide: 'Ocultar contraseña'
  }
}

const labels = computed(() =>
    translations[locale.value === 'es' ? 'es' : 'en']
)

function signIn() {
  errorMessage.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'required'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    errorMessage.value = 'invalid'
    return
  }

  localStorage.setItem('kinemo-authenticated', 'true')
  router.push('/dashboard')
}
</script>

<template>
  <div class="login-page">

    <div class="language-selector">
      <button
          type="button"
          :class="{ active: locale === 'en' }"
          :aria-pressed="locale === 'en'"
          @click="locale = 'en'"
      >
        EN
      </button>

      <button
          type="button"
          :class="{ active: locale === 'es' }"
          :aria-pressed="locale === 'es'"
          @click="locale = 'es'"
      >
        ES
      </button>
    </div>

    <main class="login-content">

      <section class="login-card">

        <div class="login-heading">
          <h1>Kinemo<span>.</span></h1>
          <p>{{ labels.subtitle }}</p>
        </div>

        <form
            class="login-form"
            novalidate
            @submit.prevent="signIn"
        >

          <div class="form-group">

            <label for="email">
              {{ labels.email }}
            </label>

            <input
                id="email"
                v-model="email"
                type="email"
                placeholder="name@cinema.com"
                autocomplete="email"
                required
                @input="errorMessage = ''"
            />

          </div>

          <div class="form-group">

            <label for="password">
              {{ labels.password }}
            </label>

            <div class="password-input">

              <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="labels.placeholder"
                  autocomplete="current-password"
                  required
                  @input="errorMessage = ''"
              />

              <button
                  type="button"
                  class="password-toggle"
                  :aria-label="showPassword ? labels.hide : labels.show"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
              >
                <i
                    :class="showPassword
                                        ? 'pi pi-eye-slash'
                                        : 'pi pi-eye'"
                ></i>
              </button>

            </div>

          </div>

          <div
              v-if="errorMessage"
              class="error-message"
              role="alert"
          >
            <i class="pi pi-exclamation-circle"></i>
            {{ labels[errorMessage] }}
          </div>

          <button
              type="submit"
              class="sign-in-button"
          >
            {{ labels.access }}
          </button>

        </form>

        <div class="subscription-section">
          <span>{{ labels.newUser }}</span>

          <router-link to="/subscriptions">
            {{ labels.plans }}
          </router-link>
        </div>

      </section>

    </main>

    <footer class="login-footer">
      © 2026 Kinemo — 4D Cinema Management Platform
    </footer>

  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background:
      radial-gradient(
          ellipse at 50% 35%,
          rgba(139, 92, 246, 0.06),
          transparent 55%
      ),
      #0e0f17;
}

.language-selector {
  position: absolute;
  top: 24px;
  right: 28px;
  display: flex;
  overflow: hidden;
  border: 1px solid #2d2f45;
  border-radius: 6px;
  background: #16171e;
}

.language-selector button {
  padding: 7px 12px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.language-selector button.active {
  background: #272338;
  color: #a78bfa;
}

.login-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 72px 20px 32px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: 28px;
  background: #16171e;
  border: 1px solid #2d2f45;
  border-radius: 12px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.login-heading {
  margin-bottom: 26px;
  text-align: center;
}

.login-heading h1 {
  margin: 0 0 6px;
  color: #a78bfa;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.7px;
  line-height: 1.3;
}

.login-heading h1 span {
  color: #34d6b0;
}

.login-heading p {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #c7c8d0;
  font-size: 12px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: #101118;
  border: 1px solid #35374a;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s,
  box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #85899b;
  font-size: 12px;
}

.form-group input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.10);
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 42px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
}

.password-toggle:hover {
  color: #a78bfa;
  background: #272338;
}

.password-toggle i {
  font-size: 13px;
}

.sign-in-button {
  width: 100%;
  min-height: 40px;
  margin-top: 3px;
  padding: 10px 16px;
  background: #7c3aed;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.sign-in-button:hover {
  background: #6d28d9;
}

.sign-in-button:active {
  background: #5b21b6;
}

.subscription-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 20px;
  color: #94a3b8;
  font-size: 11px;
}

.subscription-section a {
  color: #a78bfa;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

.subscription-section a:hover {
  color: #c4b5fd;
  text-decoration: underline;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 10px;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 6px;
  color: #f87171;
  font-size: 11px;
}

.login-footer {
  padding: 18px;
  color: #94a3b8;
  font-size: 10px;
  text-align: center;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }

  .language-selector {
    top: 16px;
    right: 16px;
  }

  .login-content {
    padding: 64px 16px 24px;
  }
}
</style>