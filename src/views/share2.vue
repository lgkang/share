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
                    <el-button type="primary" @click="init({isSearch: true})">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="middle">
            <el-button type="primary" @click="showAdd()">添加</el-button>
        </div>
        <betterTable :columns="columns" :total-data="totalData" ref="table">
            <template slot-scope="{row}" slot="button">
                <el-button type="text" @click="write(row)">修改</el-button>
                <el-button type="text" @click="del(row)">删除</el-button>
            </template>
        </betterTable>
        <el-dialog :title="writeId ? '修改信息' : '新增信息'" :visible.sync="addData.show" width="400px">
            <el-form :model="addData.form" label-width="60px" :ref="addData.formRef" :rules="rules">
                <el-form-item label="名字" prop="name">
                    <el-input v-model="addData.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="代码" prop="code">
                    <el-input v-model="addData.form.code" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addData.show = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()"
                           :loading="addData.loading">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import betterTable from '../components/better-table';
    import apis from '../request/apis';
    import main from '../mixins';

    export default {
        name: "share2",
        mixins: [main],
        components: {
            betterTable
        },
        data() {
            return {
                columns: [
                    {label: 'id', prop: 'id'},
                    {label: '姓名', prop: 'name'},
                    {label: '代码', prop: 'code'},
                    {label: '操作', slots: 'button'}
                ],
                form: {
                    name: '',
                    code: ''
                },
                addData: {
                    show: false,
                    form: {
                        name: '',
                        code: ''
                    },
                    formRef: 'addForm',
                    before: this.beforeAdd,
                    loading: false
                },
                rules: {
                    name: {required: true, message: '请输入姓名', trigger: 'blur'},
                    code: {required: true, message: '请输入代码', trigger: 'blur'}
                },
                // vue
                request: {
                    post: apis.test.getData,
                    update: apis.test.updateData,
                    add: apis.test.addData,
                    del: apis.test.delData
                }
            };
        },
        methods: {
            beforeAdd(params, type) {
                if (type === 'add') {
                    // 增加，给一个随机id
                    params.id = Math.floor(Math.random() * (0 - 99) + 99);
                } else if (type === 'update') {
                    // 修改，获取当前行id
                    params.id = this.selectRow.id;
                }
                return params;
            },
        }
    };
</script>

<style scoped>

</style>
