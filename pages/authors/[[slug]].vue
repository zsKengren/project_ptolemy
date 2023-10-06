<script setup>
import { ref } from "vue";
import PictureInput from "../../components/PictureUpload.vue";

const isOpen = ref(false);
const penNames = ref([])

const { pending, data: authors } = await useLazyAsyncData('authors', () => $fetch('/api/authors'))

const people = [
  {
    id: 1,
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  {
    id: 2,
    name: "Courtney Henry",
    title: "Designer",
    email: "courtney.henry@example.com",
    role: "Admin",
  },
  {
    id: 3,
    name: "Tom Cook",
    title: "Director of Product",
    email: "tom.cook@example.com",
    role: "Member",
  },
  {
    id: 4,
    name: "Whitney Francis",
    title: "Copywriter",
    email: "whitney.francis@example.com",
    role: "Admin",
  },
  {
    id: 5,
    name: "Leonard Krasner",
    title: "Senior Designer",
    email: "leonard.krasner@example.com",
    role: "Owner",
  },
  {
    id: 6,
    name: "Floyd Miles",
    title: "Principal Designer",
    email: "floyd.miles@example.com",
    role: "Member",
  },
];
</script>
<template>
  <div>
    <UButton
      icon="i-heroicons-pencil-square"
      size="sm"
      color="primary"
      variant="solid"
      label="Button"
      :trailing="false"
      @click="isOpen = true"
      >Add Author</UButton
    >
    <UModal v-model="isOpen">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>Create Author</template>
        <UForm ref="form" :state="state" @submit="submit">
          <div class="grid grid-cols-2 gap-2">
              <picture-input
            ref="pictureInput"
            margin="16"
            width="250"
            height="250"
            accept="image/jpeg,image/png"
            size="10"
            hideChangeButton="true"
            @change="onChange"
            class="col-span-2"
           />
          <UFormGroup label="Name" name="name" class="col-span-2">
            <UInput />
          </UFormGroup>
          <UFormGroup label="Description" name="description" class="col-span-2">
            <UTextarea />
          </UFormGroup>
            <UFormGroup label="Birthdate" name="birthdate">
              <!--<DatePicker v-model="date2" @close="close" />-->
              <DatePicker  />
            </UFormGroup>
            <UFormGroup label="Deathdate" name="deathdate">
              <DatePicker  />
            </UFormGroup>
         
          <UFormGroup label="Pen Names" name="pennames" class="col-span-2">
            <StringArrayInput :values="penNames"/>
          </UFormGroup>
          </div>
          
          
        </UForm>
        <template #footer>
          <div class="float-right">
            <UButton color="gray" variant="ghost" label="Cancel" />
            <UButton
              color="primary"
              variant="solid"
              label="Save"
              class="mb-3 mx-2"
              type="submit"
            />
          </div>
         
        </template>
      </UCard>
    </UModal>
  </div>
  <div>
    <UTable :rows="people" :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"/>
  </div>
</template>
