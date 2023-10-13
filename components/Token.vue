<template>
  <div :class="tokenClass" v-bind="attrs">
    <span
      v-if="(isLeading && leadingIconName) || $slots.leading"
      :class="leadingWrapperIconClass"
    >
      <slot name="leading" :disabled="disabled" :loading="loading">
        <UIcon :name="leadingIconName" :class="leadingIconClass" />
      </slot>
    </span>
    <slot>
      <span
        v-if="label"
        :class="[truncate ? 'text-left break-all line-clamp-1' : '']"
      >
        {{ label }}
      </span>
    </slot>
    <slot name="trailing" :disabled="disabled" :loading="loading">
      <UButton
        color="gray"
        variant="link"
        :icon="trailingIconName"
        :padded="false"
        :class="trailingIconClass"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from "vue";
import type { PropType } from "vue";
import { twMerge, twJoin } from "tailwind-merge";
import { useUI } from "#ui/composables/useUI";
import { mergeConfig } from "#ui/utils";
import type { TokenColor, TokenSize, TokenVariant } from "./token/Token";
import type { Strategy } from "#ui/types";
// @ts-expect-error
import appConfig from "#build/app.config";
import { token } from "./token/ui.config";

const config = mergeConfig<typeof token>(
  appConfig.ui.strategy,
  appConfig.ui.token,
  token
);

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<TokenSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.size).includes(value);
      },
    },
    color: {
      type: String as PropType<TokenColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(
          value
        );
      },
    },
    variant: {
      type: String as PropType<TokenVariant>,
      default: () => config.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap((value) => Object.keys(value)),
        ].includes(value);
      },
    },
    label: {
      type: [String, Number],
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
    icon: {
      type: String,
      default: null,
    },
    leadingIcon: {
      type: String,
      default: null,
    },
    trailingIcon: {
      type: String,
      default: "i-heroicons-x-mark-20-solid",
    },
    trailing: {
      type: Boolean,
      default: true,
    },
    leading: {
      type: Boolean,
      default: false,
    },
    truncate: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const { ui, attrs } = useUI("token", toRef(props, "ui"), config);

    const { emitFormBlur, emitFormInput, size, color, inputId, name } =
      useFormGroup(props, config);

    const tokenClass = computed(() => {
      const variant =
        ui.value.color?.[props.color as string]?.[props.variant as string] ||
        ui.value.variant[props.variant];

      return twMerge(
        twJoin(
          ui.value.base,
          ui.value.font,
          ui.value.rounded,
          ui.value.size[props.size],
          variant?.replaceAll("{color}", props.color)
        ),
        props.class
      );
    });

    const isLeading = computed(() => {
      return (
        (props.icon && props.leading) ||
        (props.icon && !props.trailing) ||
        props.leadingIcon
      );
    });

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || props.trailingIcon;
    });

    const leadingIconName = computed(() => {
      return props.leadingIcon || props.icon;
    });

    const trailingIconName = computed(() => {
      return props.trailingIcon || props.icon;
    });

    const leadingWrapperIconClass = computed(() => {
      return twJoin(
        ui.value.icon.leading.wrapper,
        ui.value.icon.leading.pointer,
        ui.value.icon.leading.padding[size.value]
      );
    });

    const leadingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        appConfig.ui.colors.includes(color.value) &&
          ui.value.icon.color.replaceAll("{color}", color.value),
        ui.value.icon.size[size.value],
        props.loading && "animate-spin"
      );
    });

    const trailingIconClass = computed(() => {
      return twJoin(ui.value.icon.base, ui.value.icon.size[size.value]);
    });

    return {
      ui,
      attrs,
      tokenClass,
      isLeading,
      isTrailing,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
    };
  },
});
</script>
./token/TokenInput./token/Token