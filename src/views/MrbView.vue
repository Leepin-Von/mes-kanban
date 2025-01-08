<template>
    <div class="pixel-page">
        <el-button type="text" @click="dialogFormVisible = true">MRB制程群组查询</el-button>
        <el-dialog title="MRB看板查询" :visible.sync="dialogFormVisible">
            <div slot="title">
                <i class="iconfont icon-chartindex"></i>&nbsp;
                <span>MRB制程群组查询</span>
            </div>
            <div class="form-container">
                <el-form :model="form">
                    <el-form-item label="课级单位" :label-width="formLabelWidth">
                        <el-select v-model="form.selectedUnit" placeholder="请选择">
                            <el-option v-for="item in units" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="起讫时间" :label-width="formLabelWidth">
                        <el-date-picker v-model="form.dateRange" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="产品类别" :label-width="formLabelWidth">
                        <el-checkbox-group v-model="form.checkedOptions" text-color="#fff" fill="#000">
                            <el-checkbox-button v-for="option in options" :label="option" :key="option">{{ option
                                }}</el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button id="start-calculating" type="primary" @click="startCalculation">开始计算</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogFormVisible: false,
            formLabelWidth: '80px',
            form: {
                selectedUnit: '',
                dateRange: [],
                checkedOptions: [],
            },
            units: [
                { value: 'unit1', label: '单位1' },
                { value: 'unit2', label: '单位2' },
                { value: 'unit3', label: '单位3' }
            ],
            options: ['传统', 'HDI', '载板', '汽车板', 'LCD板', '软硬结合板', 'LED'],

        };
    },
    methods: {
        startCalculation() {
            console.log('开始计算');
            console.log(this.form);
            this.dialogFormVisible = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.pixel-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85vh;
    background-color: #f0f0f0;
}

.form-container {
    background-color: #fff;
    padding: 20px;
    border: 2px solid #000;
    box-shadow: 10px 10px 0 #000;
}

.el-form-item__label {
    font-size: 14px;
}

#start-calculating {
    width: 100%;
    background-color: #000;
    color: #fff;
    border: 2px solid #000;
    box-shadow: 4px 4px 0 #000;

    &:hover {
        background-color: #fff;
        color: #000;
    }
}
</style>