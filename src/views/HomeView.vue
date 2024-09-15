<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-vue-next';

const router = useRouter()

const navigateToTasks = () => {
    router.push({ name: 'todos' })
}
</script>

<template>
    <div class="min-h-screen flex items-start lg:items-center justify-center bg-slate-50 pt-2 sm:pt-4 lg:pt-0">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
                <div
                    class="order-2 lg:order-1 bg-gradient-to-br from-violet-50 to-slate-50 rounded-2xl p-2 md:p-6 lg:px-8 lg:py-32 flex flex-col">
                    <div class="max-w-lg">
                        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-24 relative inline-block">
                            <span class="relative z-10 inline-block animate-fadeIn">Welcome to</span>
                            <span
                                class="block text-3xl md:text-5xl lg:text-7xl text-secondary-foreground font-extrabold mt-2 relative z-10 animate-fadeIn delay-200">TaskTastic</span>
                            <span aria-hidden="true"
                                class="absolute -bottom-4 left-0 w-full h-3 bg-secondary transform -skew-x-12"></span>
                        </h1>
                        <p class="mb-16 text-base lg:text-xl text-gray-600">Easily tackle your to-dos and stay on top of
                            things with this super simple task manager!</p>
                        <Button @click="navigateToTasks" class="text-base lg:text-lg px-6 py-2 lg:px-8 lg:py-3">My Tasks
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
                <div class="order-1 lg:order-2 flex justify-center items-center md:mt-10">
                    <img src="@/assets/images/homepage_image.png" alt="" class="max-w-full h-auto object-cover" />
                </div>
            </div>
        </div>
    </div>
</template>
