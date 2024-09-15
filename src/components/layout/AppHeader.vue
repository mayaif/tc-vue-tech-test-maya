<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon, XIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import AppHeaderNavigation from './AppHeaderNavigation.vue';

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
    <header class="bg-primary text-primary-foreground p-4">
        <div class="container flex justify-between items-center">
            <nav :class="{ 'hidden': !isMenuOpen, 'block': isMenuOpen, 'md:block': true }">
                <AppHeaderNavigation />
            </nav>
            <Button @click="toggleMenu" class="md:hidden ml-auto" aria-label="Menu">
                <MenuIcon v-if="!isMenuOpen" />
                <XIcon v-else />
            </Button>
        </div>
    </header>
</template>