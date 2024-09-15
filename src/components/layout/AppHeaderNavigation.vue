<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>

    <ul class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <li>
            <RouterLink to="/" class="hover:underline">Home</RouterLink>
        </li>
        <li>
            <RouterLink to="/todos" class="hover:underline">Todos</RouterLink>
        </li>
    </ul>

</template>
