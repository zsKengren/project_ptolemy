<template>
    <div id="application-sidebar"
        class="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform fixed top-0 left-0 bottom-0 z-[60] w-36 lg:w-64 bg-white border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800">
        <ULink class="flex-none text-xl font-semibold dark:text-white px-6" to="/" aria-label="Brand">
            Project Ptolemy
        </ULink>
        <UVerticalNavigation :links="links" class="pt-6 px-3 lg:p-6 w-full flex flex-col flex-wrap" />
        <ThemeModeButton class="absolute bottom-2 left-2" />
    </div>
</template>
  
<script setup lang="ts">
const links = [
    { label: 'Home', icon: 'i-heroicons-home', to: '/' },
    { label: 'Authors', icon: 'i-heroicons-users', to: '/authors' },
    { label: 'Books', icon: 'i-heroicons-book-open', to: '/books' },
    { label: 'Series', icon: 'i-heroicons-queue-list', to: '/series' },
];
</script>
  