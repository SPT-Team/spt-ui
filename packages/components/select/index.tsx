import { ref, defineComponent, PropType, computed } from "vue";
import { ElSelect } from "element-plus";
import styles from "./index.module.scss"; // 引入样式文件
import { getPrefixClass } from "@/SPTUI/utils";
import { usePrefixInjector } from "@/SPTUI/provider/usePrefix";

export default defineComponent({
  name: "SptSelect",
  props: {
    modelValue: {
      type: [String, Number, Array, Object] as PropType<
        string | number | any[] | object
      >,
      required: true,
    },
    type: {
      type: String as PropType<"filled" | "outlined">,
      default: "outlined",
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit, attrs, slots }) {
    const prefix = usePrefixInjector();
    const selectRef = ref<InstanceType<typeof ElSelect> | null>(null);

    const selectClass = computed(() => {
      return [
        styles[getPrefixClass(prefix, "select")],
        styles[getPrefixClass(prefix, `select-${props.type}`)],
      ];
    });

    const popperClass = computed(() => {
      return [
        styles[getPrefixClass(prefix, "popper")],
        styles[getPrefixClass(prefix, `popper-${props.type}`)],
      ];
    });

    const handleChange = (value: any) => {
      emit("update:modelValue", value);
      emit("change", value);
      selectRef.value?.blur();
    };

    return () => (
      <ElSelect
        showArrow={false}
        offset={1}
        {...attrs}
        modelValue={props.modelValue}
        ref={selectRef}
        onChange={handleChange}
        popperClass={popperClass.value}
        class={selectClass.value}
      >
        {slots.default && slots.default()}
      </ElSelect>
    );
  },
});
