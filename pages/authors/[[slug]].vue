<script setup>
import { ref } from "vue";
import PictureInput from "../../components/PictureUpload.vue";
import VueTagsInput from "../../components/tags-input/vue-tags-input.vue"
import TokenInput from '../../components/TokenInput.vue'

const client = useSupabaseClient();

const isOpen = ref(false);
const penNames = ref([]);
const tags = ref([{
      text: 'valid tag',
    }, {
      text: 'valid tag',
    }])
const tag = ref("")

const { data: authors } = await useAsyncData("author", async () => {
  const { data } = await client
    .from("author")
    .select("name, pen_names, status");
  console.log(data);
  return data;
});
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
          <div class="grid grid-cols-3 gap-2">
            <picture-input
              ref="pictureInput"
              margin="16"
              width="250"
              height="250"
              accept="image/jpeg,image/png"
              size="10"
              hideChangeButton="true"
              @change="onChange"
              class="row-span-2"
            />
            <UFormGroup label="Name" name="name" class="col-span-2">
              <UInput />
            </UFormGroup>
            <UFormGroup label="Birthdate" name="birthdate">
              <!--<DatePicker v-model="date2" @close="close" />-->
              <DatePicker />
            </UFormGroup>
            <UFormGroup label="Deathdate" name="deathdate">
              <DatePicker />
            </UFormGroup>
              <vue-tags-input
                v-model="tag"
                :tags="tags"
                class="col-span-3"
                @tags-changed="newTags => tags = newTags"
                @tag-order-changed="newTags => tags = newTags"
              />
              <TokenInput  v-model="tag"
                :tags="tags"
                class="col-span-3"/>     
            <UFormGroup
              label="Description"
              name="description"
              class="col-span-3"
            >
              <UTextarea />
            </UFormGroup>
           
            <UFormGroup label="Pen Names" name="pennames" class="col-span-2">
              <StringArrayInput :values="penNames" />
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
    <UTable
      :rows="authors"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
    />
  </div>
</template>
