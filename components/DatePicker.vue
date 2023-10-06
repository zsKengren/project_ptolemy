<script setup>
import { DatePicker as VDatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { ref } from 'vue';

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const selectedColor = ref("green")

const popover = ref({
  visibility: 'focus',
  placement: 'top-start',
});


const props = defineProps({  modelValue: {    type: Date,    default: null  }})
const emit = defineEmits(['update:model-value', 'close'])
const date = computed({  get: () => props.modelValue,  set: (value) => {    
    emit('update:model-value', value)    
    emit('close')  
}})
const attrs = [{  key: 'today',  highlight: {    color: 'green',    fillMode: 'outline',    class: '!bg-gray-100 dark:!bg-gray-800'  },  dates: new Date()}]
</script>
<template>
  <VDatePicker v-model="date" :popover="popover" title-position="left" :attributes="attrs" :is-dark="isDark" :color="selectedColor">
    <template #default="{ inputValue, inputEvents }">
      <UInput
        icon="i-heroicons-calendar-days"
        :value="inputValue"
        v-on="inputEvents"
      />
    </template> 
</VDatePicker>
</template>
