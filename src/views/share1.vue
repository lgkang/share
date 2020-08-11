<template>
    <div class="container">
        <div style="margin-top: 10px">
            <el-form inline>
                <el-form-item label="输入名字" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="输入代码" prop="code">
                    <el-input v-model="form.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="middle">
            <el-button type="primary" @click="showAdd()">添加</el-button>
        </div>
        <div>
            <el-table :data="totalData.data"
                      v-loading="tableLoading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading">
                <el-table-column
                        prop="id"
                        label="id">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="代码">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-button type="text" @click="showUpdate(row)">修改</el-button>
                        <el-button type="text" @click="del(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col id="pagination">
                <el-pagination layout="total, sizes, prev, pager, next,jumper" @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               :page-sizes="[10, 20, 30, 50, 100, 200, 300]" :page-size="totalData.params.pageSize"
                               :total="totalData.total" style="float:left;margin-top: 30px;"
                               :current-page.sync="totalData.params.page" background>
                </el-pagination>
            </el-col>
        </div>
        <el-dialog :title="type === 'update' ? '修改信息' : '新增信息'" :visible.sync="addData.show" width="400px">
            <el-form :model="addData.form" label-width="60px" ref="addData" :rules="rules">
                <el-form-item label="名字" prop="name">
                    <el-input v-model="addData.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="代码" prop="code">
                    <el-input v-model="addData.form.code" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addData.show = false">取 消</el-button>
                <el-button type="primary" @click="() => type === 'update' ? update() : add()"
                           :loading="addData.loading">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import apis from '../request/apis';

    export default {
        name: "share1",
        data() {
            return {
                form: {
                    name: '',
                    code: ''
                },
                totalData: {
                    data: [],
                    params: {
                        page: 1,
                        pageSize: 10
                    },
                    total: 0
                },
                addData: {
                    show: false,
                    form: {
                        name: '',
                        code: ''
                    },
                    loading: false
                },
                rules: {
                    name: {required: true, message: '请输入姓名', trigger: 'blur'},
                    code: {required: true, message: '请输入代码', trigger: 'blur'}
                },
                type: 'add',
                tableLoading: true
            };
        },
        async created() {
            await this.init();
        },
        methods: {
            async init() {
                try {
                    this.tableLoading = true;
                    const res = await apis.test.getData({
                        ...this.totalData.params,
                        ...this.form
                    });
                    this.totalData.data = res.data;
                    this.totalData.total = res.total;
                } finally {
                    this.tableLoading = false;
                }
            },
            search() {
                this.totalData.params.page = 1;
                this.init();
            },
            showUpdate(row) {
                this.addData.form.name = row.name;
                this.addData.form.code = row.code;
                this.selectRow = row;
                this.type = 'update';
                this.addData.show = true;
            },
            showAdd() {
                this.addData.form.name = '';
                this.addData.form.code = '';
                if (this.$refs.addData)
                    this.$refs.addData.clearValidate();
                this.type = 'add';
                this.addData.show = true;
            },
            async update() {
                try {
                    await this.$refs.addData.validate();
                    this.addData.loading = true;
                    await apis.test.updateData({
                        id: this.selectRow.id,
                        ...this.addData.form
                    });
                    this.addData.show = false;
                    this.$message.success('修改成功');
                    this.init();
                } catch (e) {
                    e.message && this.$message.error(e.message);
                } finally {
                    this.addData.loading = false;
                }
            },
            async add() {
                try {
                    await this.$refs.addData.validate();
                    this.addData.loading = true;
                    await apis.test.addData({
                        id: Math.floor(Math.random() * (0 - 99) + 99),
                        ...this.addData.form
                    });
                    this.addData.show = false;
                    this.$message.success('增加成功');
                    this.init();
                } catch (e) {
                    e.message && this.$message.error(e.message);
                } finally {
                    this.addData.loading = false;
                }
            },
            async del(row) {
                await this.$confirm("是否确定删除?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                });
                await apis.test.delData({id: row.id});
                this.$message.success('删除成功');
                this.init();
            },
            handleCurrentChange(val) {
                this.totalData.params.page = val;
                this.init();
            },
            handleSizeChange(val) {
                this.totalData.params.pageSize = val;
                this.init();
            }
        }
    };
</script>

<style scoped>

</style>
