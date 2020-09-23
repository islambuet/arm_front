<template>
    <form :id="formId">
        <table class="table table-bordered table-striped table-sm">
            <tr>
                <th>{{$systemVariables.getLabel('labelFilterColumn')}}</th>
                <th>{{$systemVariables.getLabel('labelFilterValue')}}</th>            
            </tr>
            <tr v-for="(column, field) in columns" :key="field">
                <td>{{ column.label }}</td>
                <td>
                    <div v-if="column.filtertype == 'list'">
                        <select :name="'filter['+field+']'" class="form-control mini" v-model="column.value"  @change="onChangeDropdown($event, field)">
                            <option value="">{{$systemVariables.getLabel('LabelSelect')}}</option>
                            <option v-for="(option, i) in column.options" :key="i" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div v-else-if="column.filtertype == 'date'">
                        <b-row>
                            <b-col sm="6">{{$systemVariables.getLabel('LabelStart')}}<input :name="'filter['+field+'_start]'" type="date" v-model="column.fitlerStart.value" class="form-control" /></b-col>                            
                            <b-col sm="6">{{$systemVariables.getLabel('LabelEnd')}}<input :name="'filter['+field+'_end]'" type="date" v-model="column.fitlerEnd.value" class="form-control" /></b-col>                                                        
                        </b-row>                        
                    </div>
                    <div v-else-if="column.filtertype == 'number'">
                        <b-row>
                            <b-col sm="6">{{$systemVariables.getLabel('LabelFrom')}}<input type="text" :name="'filter['+field+'_from]'" v-model="column.fitlerFrom.value" class="form-control" /></b-col>                            
                            <b-col sm="6">{{$systemVariables.getLabel('LabelTo')}}<input type="text" :name="'filter['+field+'_to]'" v-model="column.fitlerTo.value" class="form-control" /></b-col>
                        </b-row>
                    </div>
                    <div v-else>                        
                        <input type="text" :name="'filter['+field+']'" v-model="column.value" class="form-control" />
                    </div>
                </td>
            </tr>
        </table>
        <slot></slot>
        <div>
            <b-button class="mr-2" variant="success" @click="resetSearchOptions($event,formId)" >{{$systemVariables.getLabel('buttonResetSearchOptions')}}</b-button>            
        </div>
    </form>
</template>

<script>
export default {
    name: "Filters",    
    methods:{
        onChangeDropdown: function(event, field) 
        {
            if(this.columns[field]['child'])
            {
                //resttings childs
                for (var i=0; i < this.columns[field]['child']['resetFields'].length; i++)
                {
                    var resetField = this.columns[field]['child']['resetFields'][i];                    
                    this.columns[resetField].options = [];
                    this.columns[resetField].value = this.columns[resetField].defaultValue;
                }
                //setting childs options
                this.columns[this.columns[field]['child']['field']]['options']=this.columns[field]['child']['options'][this.columns[field]['value']];
            }
        },
        resetSearchOptions: function(event, formId) 
        {
            /*var formData=new FormData(document.getElementById('formFilterOptionsList'));
            this.$axios.post('/api6/initialize',formData)
                .then(response=>{
                    
                })
                .catch(error => {     
                    
                });*/
            for(var field in this.columns)
            {
                var filterColumn=this.columns[field];
                if(filterColumn['filtertype']=='list')
                {
                    filterColumn['value']=filterColumn['defaultValue']; 
                    if(filterColumn['child'])
                    {
                        //resttings childs
                        for (var i=0; i < filterColumn['child']['resetFields'].length; i++)
                        {
                            var resetField = filterColumn['child']['resetFields'][i];                    
                            this.columns[resetField].options = [];                            
                        }                        
                    }                   
                }
                else if(filterColumn['filtertype']=='number')
                {
                    filterColumn['fitlerFrom']['value']=filterColumn['fitlerFrom']['defaultValue'];
                    filterColumn['fitlerTo']['value']=filterColumn['fitlerTo']['defaultValue'];
                }
                else if(filterColumn['filtertype']=='date')
                {
                    filterColumn['fitlerStart']['value']=filterColumn['fitlerStart']['defaultValue'];
                    filterColumn['fitlerEnd']['value']=filterColumn['fitlerEnd']['defaultValue'];
                }
                else
                {
                    filterColumn['value']=filterColumn['defaultValue'];                     
                }                
            }
        },
    },
    props: {
        formId:{
            type:String,
            default:'filterForm'
        },
        columns:{
            type: Object,
        },
    },
    data:function() {
    return {               
    }
  },
}
</script>