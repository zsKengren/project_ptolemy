<template>
    <div class="sticky top-0 inset-x-0 z-20 bg-white px-4 sm:px-6 md:px-8 lg:hidden dark:bg-gray-800">
        <div class="flex items-center py-4">
            <UButton class="text-gray-500 hover:text-gray-600" icon="i-heroicons-queue-list" variant="ghost" color="gray"
                data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Toggle navigation">
                <span class="sr-only">Toggle Navigation</span>
            </UButton>

            <!-- Breadcrumb -->
            <ol class="ml-3 flex items-center whitespace-nowrap min-w-0" aria-label="Breadcrumb">
                <li class="flex items-center text-sm text-gray-800 dark:text-gray-400">
                    Application Layout
                    <svg class="flex-shrink-0 mx-3 overflow-visible h-2.5 w-2.5 text-gray-400 dark:text-gray-600" width="16"
                        height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </li>
                <li class="text-sm font-semibold text-gray-800 truncate dark:text-gray-400" aria-current="page">
                    Dashboard
                </li>
            </ol>
            <!-- End Breadcrumb -->
        </div>
    </div>
</template>
  
<script setup lang="ts">
//import { useMenuStore } from '~/store/navbarStore';

//const menuStore = useMenuStore();
</script>
  
<style scoped></style>  