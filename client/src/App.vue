<script setup lang="ts"></script>

<template>
  <RouterView />
</template>

<style>
html,
body,
#app {
  background-color: black;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  color: white;
  font-family: monospace;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.container {
  min-width: 35vw;
  min-height: 20vh;
}
</style>
