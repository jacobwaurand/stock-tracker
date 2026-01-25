<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import router from '@/router'

const email = ref('')
const password = ref('')
const isCreating = ref(false)
const isLoading = ref(false)

// cumputed properties
const buttonText = computed(() => {
  return isCreating.value ? 'Create Account' : 'Sign In'
})

const mutedText = computed(() => {
  return isCreating.value ? 'Back to Sign in' : 'Create an Account'
})

const buttonColor = computed(() => {
  return isCreating.value ? 'bg-blue' : 'bg-green'
})

//functions
const onCreate = () => {
  isCreating.value = !isCreating.value
}

const submit = async () => {
  if (!email.value) return 'Please enter your email.'
  if (!password.value) return 'Please enter a valid password.'
  isLoading.value = true

  try {
    if (isCreating.value) {
      await createAccount()
    } else {
      await signIn()
    }
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

const signIn = async () => {
  const authStore = useAuthStore()
  await authStore.login(email.value, password.value)
  router.push('/')
}

const createAccount = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
}
</script>

<template>
  <div class="login-card">
    <div class="login-logo w-50">
      <img src="../../assets/logo.svg" class="" height="175" width="175" />
    </div>
    <div class="w-50 login-form">
      <input v-model="email" class="mb-1 text-white" placeholder="Email" id="email" :disabled="isLoading" />
      <input v-model="password" class="mb-1 text-white" placeholder="Password" id="password" type="password" :disabled="isLoading" />
      <button :class="[buttonColor, 'mb-1', 'pointer']" @click="submit" :disabled="isLoading">{{ buttonText }}</button>
      <span class="create pointer" @click="onCreate">{{ mutedText }}</span>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  min-width: 35vw;
  border: 1px solid rgb(31, 31, 31);
  border-radius: 15px;
  background-color: rgb(12, 12, 12);
  display: flex;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 1vw 0 0;
}

.login-logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.create {
  color: dimgray;
  text-decoration: underline;
  &:hover {
    color: gray;
  }
}

.w-50 {
  width: 50%;
}

.mb-1 {
  margin-bottom: 1vh;
}

input,
button {
  padding: 5px;
  background-color: rgb(39, 39, 39);
  border: none;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: bold;
}

.pointer {
  cursor: pointer;
}

.button-container {
  display: flex;
}

.bg-green {
  background-color: rgb(84, 209, 84);
}

.bg-blue {
  background-color: rgb(83, 173, 201);
}

.bg-gray {
  background-color: rgb(163, 148, 78);
}

.text-white {
  color: white;
}
</style>
