<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import router from '@/router'

interface BannerObj {
  type: string
  text: string
}

const email = ref('')
const password = ref('')
const isCreating = ref(false)
const isLoading = ref(false)
const bannerObj = ref<BannerObj | null>(null)

// computed properties
const buttonText = computed(() => {
  return isCreating.value ? 'Create Account' : 'Sign In'
})

const mutedText = computed(() => {
  return isCreating.value ? 'Back to Sign in' : 'Create an Account'
})

const buttonColor = computed(() => {
  return isCreating.value ? 'bg-blue' : 'bg-green'
})

const bannerClass = computed(() => {
  if (!bannerObj.value) {
    return ''
  }
  return bannerObj.value.type === 'error' ? 'banner-error' : 'banner-success'
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

  email.value = ''
  password.value = ''
  isLoading.value = false

  clearBanner()
}

const signIn = async () => {
  const authStore = useAuthStore()
  const res = await authStore.login(email.value, password.value)
  if (res.error) {
    bannerObj.value = { type: 'error', text: res.error }
  }
  router.push('/')
}

const clearBanner = async () => {
  setTimeout(() => {
    bannerObj.value = null
  }, 3000)
}

const createAccount = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/create-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })

  const res = await response.json()

  if (res.error) {
    bannerObj.value = { type: 'error', text: res.error }
  }

  if (res.user) {
    bannerObj.value = { type: 'success', text: 'Account Created' }
  }
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
      <div v-if="bannerObj" :class="bannerClass">{{ bannerObj.text }}</div>
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
  margin: 1vh 1vw 1vh 0;
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

.banner-error {
  background-color: rgba(151, 67, 67, 0.5);
  border: 1px solid rgba(151, 67, 67, 0.8);
  padding: 3px 5px;
  border-radius: 5px;
  margin-top: 1vh;
}

.banner-success {
  background-color: rgba(67, 151, 74, 0.8);
  border: 1px solid rgba(67, 151, 74, 0.5);
  padding: 3px 5px;
  border-radius: 5px;
  margin-top: 1vh;
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
