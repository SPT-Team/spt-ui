import { ref, defineComponent, PropType, VueElement } from "vue";
import { ElSelect } from "element-plus";
import { usePrefixInjector } from "../../provider/usePrefix";
import styles from "./index.module.scss";
import { getPrefixClass } from "@/SPTUI/utils";

export default defineComponent({
  name: "SptCard",
  props: {
    header: {
      type: Object as PropType<{
        title: VueElement | string;
        extra?: VueElement;
      }>,
      required: true,
    },
  },
  setup(props, { emit, attrs, slots }) {
    const prefix = usePrefixInjector();
    const { header } = props;
    const titleRender = () => {
      const rows: string | VueElement[] = [];
      rows.push(
        <div className={styles[getPrefixClass(prefix, "card-header-title")]}>
          {header.title}
        </div>,
      );

      if (header.extra) {
        rows.push(header.extra);
      }

      return rows;
    };

    return () => (
      <div className={styles[getPrefixClass(prefix, "card")]} {...attrs}>
        <div className={styles[getPrefixClass(prefix, "card-header")]}>
          {titleRender()}
        </div>
        <div className={styles[getPrefixClass(prefix, "card-content")]}>
          {slots.default && slots.default()}
        </div>
      </div>
    );
  },
});
