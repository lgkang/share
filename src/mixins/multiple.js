export default {
    data() {
        return {
            selectRows: []
        };
    },
    computed: {
        isCheckType() {
            const {
                columns
            } = this;
            return columns.some(item => item.type === 'selection');
        }
    },
    methods: {
        //删除多个
        async delMultiple() {
            await this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            });
            this.dealItems(this.selectRows);
        },
        selectChange(selection) {
            console.log(selection);
            this.selectRows = selection;
        }
    }
};
