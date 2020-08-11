<template>
    <div class="better-table">
        <el-table
                v-on="tableListeners"
                v-bind="tableAttrs"
                :data="totalData.data"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
        >
            <template v-for="(column, index) in columns">
                <el-table-column v-bind="column || {}" :key="index" v-if="!column.slots"></el-table-column>
                <el-table-column v-bind="column || {}" :key="index" v-else>
                    <template slot-scope="scope">
                        <slot :name="column.slots" :row="scope.row"></slot>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <!-- 分页按钮 -->
        <el-col id="pagination">
            <el-pagination layout="total, sizes, prev, pager, next,jumper" @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :page-sizes="[10, 20, 30, 50, 100, 200, 300]" :page-size="totalData.params.pageSize"
                           :total="totalData.total" style="float:left;margin-top: 30px;"
                           :current-page.sync="totalData.params.page" background>
            </el-pagination>
        </el-col>
    </div>
</template>

<script>

    export default {
        name: "better-table",
        props: {
            totalData: {
                type: Object,
                default: () => {
                    return {
                        data: [],
                        params: {
                            page: 1,
                            pageSize: 10
                        },
                        total: 0
                    };
                }
            },
            columns: Array,
            customInit: Function
        },
        computed: {
            tableAttrs() {
                const {columns, ...tableAttrs} = this.$attrs;
                return {...tableAttrs};
            },
            tableListeners() {
                return this.$listeners;
            }
        },
        data() {
            return {
                tableLoading: true,
                visible: false
            };
        },
        methods: {
            handleCurrentChange(val) {
                this.totalData.params.page = val;
                const init = this.customInit || this.pageInit;
                init && init();
            },
            pageInit() {
                let component = this.$parent;
                while (!component.init) {
                    component = component.$parent;
                }
                return component.init();
            },
            showLoading() {
                this.tableLoading = true;
            },
            hideLoading() {
                this.tableLoading = false;
            },
            handleSizeChange(val) {
                this.totalData.params.pageSize = val;
                const init = this.customInit || this.pageInit;
                init && init();
            }
        }
    };
</script>

