<template>
  <div :class="uiWrapper">
      <slot name="leading" :disabled="disabled" :loading="loading" :readonly="readonly">
        <Token
            :label="token.label"
            v-for="(token, index) in tokens"
            :size="(token.size ? token.size : size)"
            :key="index"
            :variant="(token.variant ? token.variant : tokenVariant)"
            tabindex="0"
            :disabled="disabled ? disabled : token.disabled"
            :readonly="readonly ? readonly : token.readonly"
            :color="(token.color ? token.color : tokenColor)"
            :leadingIcon="token.icon"
            :value="token.value"
          />
      </slot>

    <input
      :id="inputId"
      ref="input"
      :name="name"
      type="text"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      :class="inputClass"
      :readonly="readonly"
      v-bind="attrs"
      @input="onInput"
    />

    <slot />

    <div
      v-if="(isTrailing && trailingIconName) || $slots.trailing"
      :class="trailingWrapperIconClass"
    >
      <slot name="trailing" :disabled="disabled" :loading="loading" :readonly="readonly">
        <UIcon :name="trailingIconName" :class="trailingIconClass" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
// T-1534 fix token flexbox spacing
import { ref, computed, toRef, onMounted, defineComponent } from "vue";
import type { PropType } from "vue";
import { twMerge, twJoin } from "tailwind-merge";
import UIcon from "#ui/components/elements/Icon.vue";
import { useUI } from "#ui/composables/useUI";
import { useFormGroup } from "#ui/composables/useFormGroup";
import { mergeConfig } from "#ui/utils";
import type { NestedKeyOf, Strategy } from "#ui/types";
// @ts-expect-error
import appConfig from "#build/app.config";
import { tokenInput, token } from "./token/ui.config";
import colors from "#ui-colors";
import { Token, TokenVariant } from "./token/Token"


const config = mergeConfig<typeof tokenInput>(
  appConfig.ui.strategy,
  appConfig.ui.tokenInput,
  tokenInput
);

const tokenConfig = mergeConfig<typeof token>(
  appConfig.ui.strategy,
  appConfig.ui.token,
  token
);


export default defineComponent({
  components: {
    UIcon,
  },
  data() {
    return {
      newToken: null,
      focused: null,
    };
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array<Token>,
      default: [],
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    loadingIcon: {
      type: String,
      default: () => config.default.loadingIcon,
    },
    trailingIcon: {
      type: String,
      default: null,
    },
    trailing: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    padded: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<keyof typeof config.size>,
      default: "md",
      validator(value: string) {
        return Object.keys(config.size).includes(value);
      },
    },
    color: {
      type: String as PropType<
        keyof typeof config.color | (typeof colors)[number]
      >,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(
          value
        );
      },
    },
    variant: {
      type: String as PropType<
        keyof typeof config.variant | NestedKeyOf<typeof config.color>
      >,
      default: () => config.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap((value) => Object.keys(value)),
        ].includes(value);
      },
    },
    inputClass: {
      type: String,
      default: null,
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined,
    },
    ui: {
      type: Object as PropType<
        Partial<typeof config & { strategy?: Strategy }>
      >,
      default: undefined,
    },
    addOnKey: {
      type: Array,
      default: () => [13],
    },
    addOnBlur: {
      type: Boolean,
      default: true,
    },
    deleteOnBackspace: {
      default: true,
      type: Boolean,
    },
    tokenVariant: {
      type: String as PropType<TokenVariant>,
      default: () => tokenConfig.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(tokenConfig.variant),
          ...Object.values(tokenConfig.color).flatMap((value) => Object.keys(value)),
        ].includes(value);
      },
    },
    //Autocomplete Tokens (autocompleteMinLength, addOnlyFromAutocomplete, autocompleteAlwaysOpen)
    //Max Tags
    //Max Length
    //addFromPaste (Seperator)
    //deleteOnBackspace
  },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    const { ui, attrs } = useUI(
      "tokenInput",
      toRef(props, "ui"),
      config,
      toRef(props, "class")
    );

    const { emitFormInput, size, color, inputId, name } =
      useFormGroup(props, config);

    const tokenInput = ref<HTMLInputElement | null>(null);

    const autoFocus = () => {
      if (props.autofocus) {
        tokenInput.value?.focus();
      }
    };

    const onInput = (event: InputEvent) => {
      //emit("update:modelValue", (event.target as HTMLInputElement).value);
      emitFormInput();
    };

    onMounted(() => {
      setTimeout(() => {
        autoFocus();
      }, 100);
    });

    const tokens = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const tokenColor = computed(() => {
      if (props.color == "white" || props.color == "gray") {
        return tokenConfig.default.color
      }

      return props.color
    })

    const uiWrapper = computed(() => {
      const variant =
        ui.value.color?.[color.value as string]?.[props.variant as string] ||
        ui.value.variant[props.variant];

        return twMerge(
        twJoin(
          ui.value.wrapper,
          ui.value.size[size.value],
          variant?.replaceAll('{color}', color.value),
          ui.value.gap[size.value],
          props.padded ? ui.value.padding[size.value] : "p-0",
          
        ));
    })

    const inputClass = computed(() => {
      return twMerge(
        twJoin(
          ui.value.base,
          ui.value.placeholder,
          ui.value.size[size.value],
         
        ),
        props.inputClass
      );
    });

    const isTrailing = computed(() => {
      return (
        (props.loading && props.trailing) ||
        props.trailingIcon
      );
    });

    const trailingIconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon;
      }

      return props.trailingIcon;
    });

    const trailingWrapperIconClass = computed(() => {
      return twJoin(
        ui.value.icon.trailing.wrapper,
        ui.value.icon.trailing.pointer,
        ui.value.icon.trailing.padding[size.value]
      );
    });

    const trailingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        appConfig.ui.colors.includes(color.value) &&
          ui.value.icon.color.replaceAll("{color}", color.value),
        ui.value.icon.size[size.value],
        props.loading && "animate-spin"
      );
    });

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      size,
      inputId,
      tokenInput,
      isTrailing,
      tokens,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      uiWrapper,
      tokenColor,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      onInput,
    };
  },
});
</script>
