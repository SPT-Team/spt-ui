import { computed, defineComponent, h, ref, watch } from "vue";
import { ElSelect, ElOption, ElPagination } from "element-plus";
import { getPrefixClass } from "@/SPTUI/utils";
import styles from "./index.module.scss";
import { usePrefixInjector } from "@/SPTUI/provider/usePrefix";
import { SptSelect } from "@/SPTUI/components";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@/SPTUI/icons";

export default defineComponent({
  name: "SptPagination",
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      required: true,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
  },
  emits: ["update:currentPage", "update:pageSize", "pagination-change"],
  setup(props, { emit, slots }) {
    const prefix = usePrefixInjector();
    const currentPageNum = ref(props.currentPage);
    const currentPageSize = ref(props.pageSize);

    const displayRange = computed(() => {
      const start = (currentPageNum.value - 1) * currentPageSize.value + 1;
      const end = Math.min(
        currentPageNum.value * currentPageSize.value,
        props.total,
      );
      return `${start}-${end}`;
    });

    watch(
      () => props.currentPage,
      (newVal) => {
        currentPageNum.value = newVal;
      },
    );

    watch(
      () => props.pageSize,
      (newVal) => {
        currentPageSize.value = newVal;
      },
    );

    const handleCurrentChange = (val) => {
      emit("update:currentPage", val);
      emitChange();
    };

    const handlePageSizeChange = (val) => {
      emit("update:pageSize", val);
      // 切换每页条数时，重置为第一页
      emit("update:currentPage", 1);
      currentPageNum.value = 1;
      emitChange();
    };

    const emitChange = () => {
      emit("pagination-change", {
        currentPage: currentPageNum.value,
        pageSize: currentPageSize.value,
      });
    };

    return () => (
      <div class={styles[getPrefixClass(prefix, "pagination")]}>
        <div class={styles[getPrefixClass(prefix, "pagination-left")]}>
          <span>Show</span>
          <SptSelect
            type="filled"
            modelValue={currentPageSize.value}
            class={styles[getPrefixClass(prefix, "pagination-select")]}
            onChange={handlePageSizeChange}
          >
            {props.pageSizes.map((size) => (
              <ElOption key={size} value={size} label={size} />
            ))}
          </SptSelect>
          <span>per</span>
          <span>&nbsp;</span>
          <span>page</span>
        </div>
        <div class={styles[getPrefixClass(prefix, "pagination-right")]}>
          <span class={styles[getPrefixClass(prefix, "pagination-total")]}>
            {displayRange.value} of {props.total}
          </span>
          <ElPagination
            currentPage={currentPageNum.value}
            pageSize={currentPageSize.value}
            total={props.total}
            layout="prev, pager, next"
            prevIcon={() => <ArrowLeftOutlined style={{ fontSize: "16px" }} />}
            nextIcon={() => <ArrowRightOutlined style={{ fontSize: "16px" }} />}
            onCurrentChange={handleCurrentChange}
          />
        </div>
      </div>
    );
  },
});
