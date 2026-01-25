<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

interface StockData {
  openingPrice: number
  currentPrice: number
  symbol: string
}

const store = useAuthStore()
const email = store.email
const symbol = ref('')
const stockData = ref<StockData | null>(null)
const loading = ref(false)

const logout = () => {
  const store = useAuthStore()
  store.logout()
  router.push('/login')
}

const getStock = async () => {
  if (!symbol.value) return 'Please enter a stock symbol.'
  loading.value = true

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/stocks/open?symbol=${symbol.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.token}`,
      },
    })

    if (!response.ok) console.error('Failed to fetch stock data')

    const data = await response.json()
    stockData.value = data
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}
</script>

<template>
  <div class="home-page">
    <nav>
      <div class="title">RTS Stock Search</div>
      <div class="email-logout">
        <div class="email">{{ email }}</div>
        <button style="color: lightgray" @click="logout">Logout</button>
      </div>
    </nav>
    <main>
      <div class="card">
        <div class="title">Stock Search</div>
        <div class="form-group">
          <input v-model="symbol" placeholder="AAPL" id="symbol" :disabled="loading" />
          <button class="bg-green" @click="getStock" :disabled="loading">Search</button>
        </div>
        <div v-if="stockData">{{ symbol.toUpperCase() }}: ${{ stockData?.openingPrice }}</div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.card {
  padding: 10px;
  min-width: 35vw;
  min-height: 12ch;
  border: 1px solid rgb(31, 31, 31);
  border-radius: 15px;
  background-color: rgb(12, 12, 12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

nav {
  display: flex;
  background-color: rgb(12, 12, 12);
  height: 5vh;
  border-bottom: 1px solid rgb(31, 31, 31);
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0 5vw;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 95vh;
}

.email-logout {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  color: rgb(84, 209, 84);
  font-weight: bolder;
  font-size: 20px;
}

.email {
  color: dimgray;
  margin-right: 1vw;

  &:hover {
    color: gray;
  }
}

input,
button {
  padding: 5px;
  border: none;
  border-radius: 5px;
  box-sizing: content-box;
  font-size: 16px;
  font-weight: bold;
  background-color: rgb(39, 39, 39);
}

.form-group {
  border: none;
  input {
    border-radius: 5px 0 0 5px;
    color: lightgrey;
  }
  button {
    border-radius: 0 5px 5px 0;
    color: black;
  }
}

.bg-green {
  background-color: rgb(84, 209, 84);
}
</style>
