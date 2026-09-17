<template>
  <div>
    <ContentHeader />

    <h1>Dashboard</h1>
  </div>
</template>

<script setup lang="ts">
import ContentHeader from '@/layout/Dashboard/TopBar.vue'

defineOptions({
  name: 'DashboardView',
})
</script>
