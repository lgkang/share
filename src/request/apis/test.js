/**
 * 模拟数据
 * @type {*[]}
 */
const data = [
    {id: 1, name: '小明', code: 'ming', type: 1},
    {id: 2, name: '小红', code: 'hong', type: 2},
    {id: 3, name: '小华', code: 'hua', type: 3},
    {id: 4, name: '小张', code: 'zhang', type: 2},
    {id: 5, name: '小李', code: 'li', type: 1},
    {id: 6, name: '小蓝', code: 'lan', type: 3},
    {id: 7, name: '小黑', code: 'hei', type: 2},
    {id: 8, name: '小白', code: 'bai', type: 1},
    {id: 9, name: '小黄', code: 'huang', type: 2},
    {id: 10, name: '小青', code: 'qing', type: 3},
    {id: 11, name: '小紫', code: 'zi', type: 3},
];
export default {
    /**
     * 查找，处理分页
     * @returns {Promise<any>}
     */
    getData(params = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let isSearch = false;
                let result = data.filter(item => {
                    if (params.name) {
                        isSearch = true;
                        return item.name.includes(params.name);
                    }
                    if (params.code) {
                        isSearch = true;
                        return item.code.includes(params.code);
                    }
                    return true;
                });
                // 分页功能
                let offset = (params.page - 1) * params.pageSize;
                result = result.slice(offset, params.pageSize + offset);
                resolve({
                    data: result,
                    total: (isSearch ? result : data).length,
                    ...params
                });
            }, 500);
        });
    },
    /**
     * 根据id删除
     * @param id
     * @returns {Promise<any>}
     */
    delData({id}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = data.findIndex(item => item.id === id);
                if (index > -1) {
                    data.splice(index, 1);
                    resolve({
                        data: data
                    });
                } else {
                    reject({
                        message: '找不到数据，无法删除'
                    });
                }
            }, 500);
        });
    },
    /**
     * 根据id更新数据
     * @param params
     * @returns {Promise<any>}
     */
    updateData(params) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = data.findIndex(item => item.id === params.id);
                if (!params.id || index === -1) {
                    return reject({
                        message: '找不到数据，无法更新'
                    });
                }
                console.log({...data[index], ...params});
                // 进行合并
                data[index] = {...data[index], ...params};
                resolve();
            }, 500);

        });
    },

    /**
     * 新增数据
     * @param params
     * @returns {Promise<any>}
     */
    addData(params) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 添加的数据是否已经存在
                let bool = data.some(item => item.id === params.id);
                if (bool) {
                    return reject({
                        message: '已有数据，添加失败'
                    });
                } else {
                    data.push(params);
                    resolve();
                }
            }, 500);
        });
    }
};
