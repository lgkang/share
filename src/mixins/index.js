import {publicObj, delEmptyAttr} from '../utils/util';

/**
 * @target：给页面添加增删改查
 * @warn: 必须配合better-form和better-table使用
 */
export default {
    data() {
        return {
            totalData: {
                data: [], // 表格数据
                // 分页和分页数据
                params: {
                    page: 1,
                    pageSize: 10
                },
                total: 0
            },
            //当前行
            selectRow: {},
            // 当前修改id
            writeId: 0,
            // 是否自动执行render
            isRender: true,
        };
    },
    created() {
        if (this.isRender) {
            this.init();
        }
    },
    methods: {
        /**
         * 查找表格的数据
         * @param params
         * @returns {Promise<void>}
         */
        async init(params) {
            try {
                await this.$nextTick();
                this.$refs.table.showLoading();
                let form = this.form || {};
                params = {...params, ...form};
                if (this.beforeInit)
                    params = this.beforeInit(params);
                if (params && params.isSearch) {
                    delete params.isSearch;
                    this.totalData.params.page = 1;
                }
                const {
                    post,
                } = this.request;
                let res = {}, requestParams = {};
                if (post) {
                    requestParams = {
                        ...this.totalData.params,
                        ...params
                    };
                    if (typeof post === "object") {
                        res = await post.method(requestParams);
                        res = post.transform(res);
                    } else {
                        res = await post(requestParams);
                    }
                    if (res.data) {
                        this.totalData.data = res.data || [];
                        // 设置总数
                        this.totalData.total = Number(res.total);
                    } else {
                        this.totalData.data = [];
                        this.totalData.total = 0;
                    }

                } else {
                    console.error("request对象没有传递post的方法, 或者重写init方法");
                }
            } finally {
                this.$refs.table.hideLoading();
            }
        },
        /**
         * 删除
         * @param row
         * @returns {Promise<void>}
         */
        async del(row) {
            await this.$confirm("是否确定删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            });
            this.delItems(row);
        },

        /**
         * 处理当前行，和删除结合使用
         * @param rows
         * @returns {Promise<void>}
         */
        async delItems(rows = []) {
            const {
                del
            } = this.request;
            let params = {};
            if (this.beforeDel) {
                params = this.beforeDel(rows);
            } else {
                if (Array.isArray(rows)) {
                    params = rows.map(item => item.id);
                } else {
                    params.id = rows.id;
                }
            }
            if (del) {
                //如果是对象
                if (typeof del === "object") {
                    let res = await del.method(params);
                    res = del.transform(res);
                } else {
                    await del(params);
                }
                this.$message.success('删除成功');
                this.init();
            } else {
                console.error("request对象没有传递del的方法, 或者重写delItem方法");
            }
        },
        /**
         * 获取真正的el-table，兼容better-table
         * @param value
         * @returns {*}
         */
        getTableRef(value = 'table') {
            if (!this.$refs[value]) {
                console.error(`未设置ref=${value}`);
                return;
            }
            if (this.$refs[value].$options._componentTag === 'el-table')
                return this.$refs[value];
            return this.$refs[value].$children[0];
        },

        /**
         * 获取真正的el-form，兼容better-form
         * @param value
         * @returns {*}
         */
        getFormRef(value = 'form') {
            console.log(this.$refs);
            if (!this.$refs[value]) {
                console.error(`未设置ref=${value}`);
                return;
            }
            if (this.$refs[value].$options._componentTag === 'el-form')
                return this.$refs[value];
            return this.$refs[value].$children[0];
        },
        /**
         * 修改方法，将当前的行记录，并赋值给所需要的弹框form表单
         * @param row 当前行
         * @param dialog 弹窗
         */
        write(row, dialog = 'addData') {
            this.selectRow = row;
            this.writeId = row.id;
            this.clearForm({dialog});
            //将当前行的数据给form
            this[dialog].form = publicObj(this[dialog].form, row);
            if (this[dialog].other)
                this[dialog].other = publicObj(this[dialog].other, row);
            this[dialog].show = true;

        },
        /**
         * 打开增加的弹框
         * @param dialog 弹框
         * @param formName 表单
         */
        showAdd(dialog = 'addData', formName = 'form') {
            if (this.writeId) {
                this.writeId = 0;
                this.clearForm({dialog});
            }
            this[dialog].show = true;
        },
        /**
         * 提交表单，然后验证通过后自动执行添加方法
         * @param dialog 弹框名字
         * @param form 表单的Ref
         * @param isExecute 是否执行add
         * @returns {Promise<boolean>}
         */
        async submitForm({dialog = 'addData', form, isExecute = true} = {}) {
            try {
                // 有表单拿表单名字，否则拿弹框的里面formRef
                let formName = form || this[dialog].formRef;
                let formComponent = this.getFormRef(formName);
                await formComponent.validate();
                if (isExecute)
                    await this.add(form);
                return true;
            } catch (e) {
                return false;
            }
        },
        /**
         * 清除表单，防止打开后还是之前的数据
         * @param dialog 弹框
         * @param formName 弹框下面的form的ref名字
         */
        clearForm({dialog, formName}) {
            if (!this[dialog]) return;
            let form = this.getFormRef(formName || this[dialog].formRef || 'addForm');
            if (!form) return;
            // bind(this) 是为了防止data()用了this报错
            let data = this.$options.data.bind(this);
            // 获取最开始的初始数据
            let initData = data();
            // 恢复初始数据
            this[dialog].form = initData[dialog].form;
            if (this[dialog].other)
                this[dialog].other = initData[dialog].other;
            form.clearValidate();
        },
        /**
         * 修改或者增加的方法
         * @param dialog 参数如下：
         *   show 弹框显示，必传
         *   form 弹框的表单，必传
         *   formRef 表单的ref 非必传
         *   addMessage 添加弹的信息，非必传，default: 添加成功
         *   updateMessage 修改的弹的信息，非必传，default: 修改成功
         *   before 请求前的参数处理，非必传
         *   after 请求后的逻辑处理，非必传
         *   loading 提交按钮的状态loading，非必传
         * @returns {Promise<void>}
         */
        async add(dialog = 'addData') {
            // 如果有编辑id，代表是修改
            let type = this.writeId ? 'update' : 'add';
            try {
                let params = JSON.parse(JSON.stringify(this[dialog].form));
                //去掉前后空格
                Object.keys(params).map(key => {
                    if (typeof params[key] === 'string')
                        params[key] = params[key].trim();
                });
                // before提交前处理参数，after提交后之后执行
                let before = this[dialog].before, after = this[dialog].after;
                if (before) {
                    params = before(params, type);
                }
                const method = this.request[type];
                if (method) {
                    this[dialog].loading = true;
                    if (typeof method === "object") {
                        let res = await method.method(params);
                        res = method.transform(res);
                    } else {
                        await method(params);
                    }
                    if (after) {
                        after(params, type);
                    } else {
                        // 提交之后处理弹出信息
                        this[dialog].show = false;
                        this.init();
                        let {addMessage = '添加成功', updateMessage = '修改成功'} = this[dialog];
                        this.$message.success(type === 'update' ? updateMessage : addMessage);
                        //增加或者修改完后清除表单
                        this.clearForm({dialog});
                    }
                } else {
                    console.error(`request对象没有传递${type}的方法, 或者重写add方法`);
                }
            } catch (e) {
                e.message && this.$message.error(e.message);
            } finally {
                // 修改清除当前行
                if (type === 'update') {
                    this.selectRow = {};
                    this.writeId = 0;
                }
                //取消按钮的加载
                this[dialog].loading = false;
            }
        },
    }
};
