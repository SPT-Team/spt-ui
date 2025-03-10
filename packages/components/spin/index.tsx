import { defineComponent, ref, watch, computed, PropType } from "vue";
import { getPrefixClass } from "@/SPTUI/utils";
import styles from "./index.module.scss";
import { usePrefixInjector } from "@/SPTUI/provider/usePrefix";

export default defineComponent({
  name: "SptSpin",
  props: {
    spinning: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<"small" | "default" | "large">,
      default: "default",
    },
    tip: {
      type: String,
      default: "",
    },
    delay: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { slots }) {
    const prefix = usePrefixInjector();
    const isSpinning = ref(props.spinning);
    let delayTimeout: number | null = null;

    watch(
      () => props.spinning,
      (newVal) => {
        if (props.delay > 0) {
          if (delayTimeout) clearTimeout(delayTimeout);
          delayTimeout = setTimeout(() => {
            isSpinning.value = newVal;
          }, props.delay);
        } else {
          isSpinning.value = newVal;
        }
      },
      { immediate: true },
    );

    const spinClass = computed(() => {
      return [
        styles[getPrefixClass(prefix, "spin")],
        styles[getPrefixClass(prefix, `spin-${props.size}`)],
        {
          [styles[getPrefixClass(prefix, "spin-spinning")]]: isSpinning.value,
        },
      ];
    });

    return () => (
      <div class={spinClass.value}>
        {isSpinning.value && (
          <div class={styles[getPrefixClass(prefix, "spin-indicator")]}>
            <div class={styles[getPrefixClass(prefix, "spin-dot")]}></div>
          </div>
        )}
        {props.tip && (
          <div class={styles[getPrefixClass(prefix, "spin-tip")]}>
            {props.tip}
          </div>
        )}
        <div class={styles[getPrefixClass(prefix, "spin-content")]}>
          {slots.default && slots.default()}
        </div>
      </div>
    );
  },
});
