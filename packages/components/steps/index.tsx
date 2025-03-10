import { defineComponent, ref, computed, PropType } from "vue";
import styles from "./index.module.scss";
import { usePrefixInjector } from "@/SPTUI/provider/usePrefix";
import { getPrefixClass } from "@/SPTUI/utils";

export default defineComponent({
  name: "SptSteps",
  props: {
    steps: {
      type: Array as PropType<
        Array<{ title: string; owner?: string; description?: string }>
      >,
      required: true,
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:active", "change"],
  setup(props, { emit }) {
    const currentStep = ref(props.active);
    const prefix = usePrefixInjector();

    const handleStepClick = (index: number) => {
      if (index !== currentStep.value) {
        currentStep.value = index;
        emit("update:active", index);
        emit("change", index);
      }
    };

    const stepStatus = computed(() => (index: number) => {
      if (index === currentStep.value) return "active";
      if (index < currentStep.value) return "completed";
      return "pending";
    });

    return () => (
      <div class={styles[getPrefixClass(prefix, "steps")]}>
        {props.steps.map((step, index) => (
          <div
            key={index}
            class={`
              ${styles[getPrefixClass(prefix, "step")]} 
              ${styles[getPrefixClass(prefix, stepStatus.value(index))]}
            `}
            onClick={() => handleStepClick(index)}
          >
            <div class={styles[getPrefixClass(prefix, "ripple-container")]}>
              <div class={styles[getPrefixClass(prefix, "inner-circle")]}></div>
              {stepStatus.value(index) === "active" && (
                <div
                  class={styles[getPrefixClass(prefix, "outer-circle")]}
                ></div>
              )}
            </div>
            <div class={styles[getPrefixClass(prefix, "step-content")]}>
              <div class={styles[getPrefixClass(prefix, "step-title")]}>
                {step.title}
              </div>
              <div class={styles[getPrefixClass(prefix, "step-owner")]}>
                {step.owner}
              </div>
              {step.description && (
                <div class={styles[getPrefixClass(prefix, "step-description")]}>
                  {step.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
});
