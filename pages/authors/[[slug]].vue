<script setup>
import { ref } from "vue";
import PictureInput from "../../components/PictureUpload.vue";
import TokenInput from "../../components/TokenInput.vue";

const client = useSupabaseClient();

const isOpen = ref(false);
const penNames = ref([]);
const tags_disabled = ref([
  {
    label: "disabled 1",
  },
]);

const tags_xs = ref([
  {
    label: "these",
  },
  {
    label: "are",
  },
  {
    label: "readonly",
  },
]);

const tags_sm = ref([
  {
    label: "loading",
  },
]);

const tags_md = ref([
  {
    label: "valid tag",
  },
  {
    label: "valid tag",
  },
]);

const tags_lg = ref([
  {
    label: "valid tag",
  },
  {
    label: "valid tag",
  },
]);

const tags_xl = ref([
  {
    label: "valid tag",
  },
  {
    label: "valid tag",
  },
]);

const tags_styles = ref([
  {
    label: "blue",
    color: "blue"
  },
  {
    label: "purple",
    color: "purple"
  },
  {
    label: "white",
    color: "white"
  },
  {
    label: "gray",
    color: "gray"
  },
  {
    label: "black",
    color: "black"
  },
  {
    label: "solid",
    variant: "solid"
  },
  {
    label: "outline",
    variant: "outline"
  },
  {
    label: "soft",
    variant: "soft"
  },
  {
    label: "subtle",
    variant: "subtle"
  },
  {
    label: "icon",
    icon: "i-heroicons-arrow-down-circle"
  },
]);

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
            <TokenInput
              v-model="tags_disabled"
              class="col-span-3"
              placeholder="disabled"
              disabled
            />
            <TokenInput
              v-model="tags_xs"
              size="xs"
              required
              readonly
              class="col-span-3"
              placeholder="xs required readonly"
            />
            <TokenInput
              v-model="tags_sm"
              size="sm"
              loading
              trailing
              class="col-span-3"
              placeholder="sm loading"
            />
            <TokenInput
              v-model="tags_md"
              size="md"
              trailingIcon="i-heroicons-pencil-square"
              tokenVariant="subtle"
              class="col-span-3"
              placeholder="md trailingIcon subtle"
            />
            <TokenInput
              v-model="tags_lg"
              size="lg"
              color="blue"
              tokenVariant="soft"
              class="col-span-3"
              placeholder="lg blue soft"
            />
            <TokenInput
              id="xl_tags"
              v-model="tags_xl"
              size="xl"
              tokenVariant="outline"
              class="col-span-3"
              placeholder="xl outline"
              @before-add="(t, submitToken) => { submitToken(t)}"
            />
            <TokenInput
              v-model="tags_styles"
              class="col-span-3"
              placeholder="styles"
            />
            
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
