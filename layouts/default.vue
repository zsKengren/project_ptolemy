<template>
    <div>
      <NavAppHeader />
      <NavAppNavToggler />
      <NavAppSidebar />
      <UContainer as="main" class="min-h-screen pt-5 lg:pt-10 lg:pl-72" :ui="{
        constrained: 'w-full max-w-full'
      }">
        <slot />
      </UContainer>
    </div>
  </template>
  
  <script lang="ts" setup>
  
  
  </script>