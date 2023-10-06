<template>
    <header
        class="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white text-sm py-2.5 sm:py-4 lg:pl-64 dark:bg-gray-800">
        <nav class="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8" aria-label="Global">
            <ULink class="mr-5 lg:mr-0 lg:hidden flex-none text-xl font-semibold dark:text-white" to="/">
                Project Ptolemy
            </ULink>

            <div class="w-full flex items-center justify-end ml-auto sm:gap-x-3 sm:order-3">
                <UButton size="sm" color="primary" square variant="ghost" label="login" to="/login"/>
            </div>
        </nav>
    </header>
</template>

<script lang="ts" setup>

</script>