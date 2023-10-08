<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const state = ref({  email: undefined,  password: undefined})
const user = useSupabaseUser()
const { auth } = useSupabaseClient()
const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`
const email = ref('')
const password = ref('')

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

async function signInWithEmail(event: FormSubmitEvent<any>) {
    console.log(event.data)
    const { data, error } = await auth.signInWithPassword({
        email: '',
        password: ''
    })
}

const validate = (state: any): FormError[] => {  
    const errors = []  
    if (!state.email) errors.push({ path: 'email', message: 'Required' })  
    if (!state.password) errors.push({ path: 'password', message: 'Required' })  
    
    return errors
}

</script>

<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      Sign in to your account
    </h2>
    <LoginCard>
      <UButton
        class="mt-3"
        icon="i-fa6-brands-github"
        block
        label="Github"
        @click="auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })"
      />
      <UButton
        class="mt-3"
        icon="i-fa6-brands-discord"
        block
        label="Discord"
        color="violet"
        @click="auth.signInWithOAuth({ provider: 'discord', options: { redirectTo } })"
      />
      <UButton
        class="mt-3"
        icon="i-fa6-brands-google"
        block
        label="Google"
        color="red"
        @click="auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })"
      />
      <UButton
        class="mt-3"
        icon="i-fa6-brands-apple"
        block
        label="Apple"
        color="cyan"
        @click="auth.signInWithOAuth({ provider: 'apple', options: { redirectTo } })"
      />
      
      <UForm    
        :validate="validate"    
        :state="state"    
        @submit="submit"  
    >    
        <UFormGroup label="Email" name="email">      
            <UInput v-model="state.email" />    
        </UFormGroup>    
        <UFormGroup label="Password" name="password">      
            <UInput v-model="state.password" type="password" />    
        </UFormGroup>    
        <UButton type="submit">Submit</UButton>  
    </UForm>
    </LoginCard>
    
  </div>
</template>