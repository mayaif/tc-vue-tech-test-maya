<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
    <div class="min-h-screen bg-background text-foreground">
        <AppHeader />
        <main>
            <slot></slot>
        </main>
    </div>
</template>