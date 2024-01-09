<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col min-w-[100vw] min-h-[100vh] p-10 bg-gray-900 text-gray-400">
    <header>
      <div class="flex">
        <nav class="flex">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<style></style>
