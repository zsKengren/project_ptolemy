<template>
  <UCard>
    <template #header>
      <UInput
        v-model="v"
        @keydown.enter="onPressEnter"
        placeholder="Enter Name"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="v !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-arrow-right-20-solid"
            :padded="false"
            @click="onPressEnter"
          />
        </template>
      </UInput>
    </template>
    <ul
      role="list"
      class="overscroll-none overflow-y-auto overflow-x-hidden h-32"
    >
      <li
        v-for="(val, index) in vs"
        :key="index"
        class="group/item hover:bg-slate-800 leading-8 rounded"
      >
        <div class="px-3 grid grid-cols-12 gap-2">
          <span class="truncate col-span-10">{{ val }}</span>
          <UButton
            color="red"
            size="2xs"
            class="float-right my-1 col-span-2"
            @click="removeAtIndex(index)"
            >Delete</UButton
          >
        </div>
      </li>
    </ul>
  </UCard>
</template>

<script setup>
const v = ref("");

const props = defineProps({
  values: Array,
});
const emit = defineEmits(["update:values"]);

const vs = computed({
  get: () => props.values,
  set: (values) => {
    emit("update:values", values);
  },
});

function removeAtIndex(index) {
  vs.value.splice(index, 1);
}

function onPressEnter() {
  if (v.value && v.value != null && v.value != "") {
    vs.value.push(v.value);
    v.value = null;
  }
}
</script>

<style scoped></style>
