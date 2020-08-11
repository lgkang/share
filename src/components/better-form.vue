<script>
    export default {
        name: "better-form",
        props: {
            formItems: {
                type: Array,
                default: () => []
            }
        },
        render() {
            const addEl = tag => {
                return tag.includes("el-") ? tag : "el-" + tag;
            };
            let childrenSlot = true;
            const dealChild = (item) => {
                if (item.tag.includes('radio-group')) {
                    return 'el-radio';
                } else if (item.tag.includes('checkbox-group')) {
                    return 'el-checkbox';
                } else {
                    childrenSlot = false;
                    return addEl(item.children.tag);
                }
            };
            return <el-form {...{props: this.$attrs}}>
            {this.formItems.map((item) => {
                if (this.$scopedSlots[item.parentSlot]) {
                    return this.$scopedSlots[item.parentSlot](props => props.text);
                }
                let children;
                let component;
                if (this.$scopedSlots[item.slots]) {
                    component = this.$scopedSlots[item.slots](props => props.text);
                } else {
                    let tag = addEl(item.tag);
                    if (this.showChild(item)) {
                        let childTag = dealChild(item);
                        children = item.children.options.map(childItems => {
                            let childAttr = this.bindChildAttr(item, childItems);
                            return <childTag {...{props: childAttr}} {...{on: item.children.listeners}}>{childrenSlot && childAttr.text}</childTag>;
                        });
                    }
                    component = <tag {...{props: item.attr}}
                    vModel={this.$attrs.model[item.prop]} {...{on: item.listeners}}>{children}</tag>;
                }
                return <elFormItem  {...{props: this.getFormItemAttr(item)}} key={item.prop}>
                    {
                        component
                    }
                    </elFormItem>;

            })}
        </el-form>;
        },
        async created() {
            this.checkDataInit();
        },
        methods: {
            // 检测表单数据是否在formItems也进行了初始化
            checkDataInit() {
                const formItems = this.formItems.filter(item => !item.slots && !item.parentSlot);
                formItems.forEach(item => {
                        if (this.$attrs.model[item.prop] === undefined) {
                            console.warn(`推荐在formAttr中的form初始化${item.prop}`);
                            this.$set(this.$attrs.model, item.prop, "");
                        }
                    }
                )
                ;
            },
            showChild(component) {
                return !!component.children;
            },
            // 是否有options
            bindChildAttr(item, childItems) {
                const {attr} = item.children;
                if (typeof attr === 'function') {
                    return attr(childItems);
                }
                if (typeof attr === 'object') {
                    return attr;
                }
                return {};
            },
            // 获取formItem的属性
            getFormItemAttr(item) {
                if (!item) {
                    return {};
                }
                const result = {};
                Object.keys(item).forEach(key => {
                    if (!["attr", "listeners", "model", "tag"].includes(key)) {
                        result[key] = item[key];
                    }
                });
                return result;
            }
        }
    }
    ;
</script>

<style scoped>

</style>
