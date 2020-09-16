<template>
    <form :id="formId">
        <table class="table table-bordered table-striped table-sm">
            <tr>
                <th>{{$system_variables.get_label('label_filter_column')}}</th>
                <th>{{$system_variables.get_label('label_filter_value')}}</th>            
            </tr>
            <tr v-for="(column, field) in columns" :key="field">
                <td>{{ column.label }}</td>
                <td>
                    <div v-if="column.filter_type == 'list'">
                        <select :name="'filter['+field+']'" class="form-control mini" v-model="column.value"  @change="onChangeDropdown($event, field)">
                            <option value="">{{$system_variables.get_label('label_select')}}</option>
                            <option v-for="(option, i) in column.options" :key="i" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div v-else-if="column.filter_type == 'date'">
                        <b-row>
                            <b-col sm="6">{{$system_variables.get_label('label_start')}}<input :name="'filter['+field+'_start]'" type="date" v-model="column.fitler_start.value" class="form-control" /></b-col>                            
                            <b-col sm="6">{{$system_variables.get_label('label_end')}}<input :name="'filter['+field+'_end]'" type="date" v-model="column.fitler_end.value" class="form-control" /></b-col>                                                        
                        </b-row>                        
                    </div>
                    <div v-else-if="column.filter_type == 'number'">
                        <b-row>
                            <b-col sm="6">{{$system_variables.get_label('label_from')}}<input type="text" :name="'filter['+field+'_from]'" v-model="column.fitler_from.value" class="form-control" /></b-col>                            
                            <b-col sm="6">{{$system_variables.get_label('label_to')}}<input type="text" :name="'filter['+field+'_to]'" v-model="column.fitler_to.value" class="form-control" /></b-col>
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
            <b-button class="mr-2" variant="success" @click="resetSearchOptions($event,formId)" >{{$system_variables.get_label('button_reset_search_options')}}</b-button>            
        </div>
    </form>
</template>

<script>
export default {
    name: "Filters",    
    methods:{
        on_change_dropdown: function(event, field) 
        {
            if(this.columns[field]['child'])
            {
                //resttings childs
                for (var i=0; i < this.columns[field]['child']['reset_fields'].length; i++)
                {
                    var reset_field = this.columns[field]['child']['reset_fields'][i];                    
                    this.columns[reset_field].options = [];
                    this.columns[reset_field].value = this.columns[reset_field].default_value;
                }
                //setting childs options
                this.columns[this.columns[field]['child']['field']]['options']=this.columns[field]['child']['options'][this.columns[field]['value']];
            }
        },
        reset_search_options: function(event, formId) 
        {
            /*var formData=new FormData(document.getElementById('formFilterOptionsList'));
            this.$axios.post('/api6/initialize',formData)
                .then(response=>{
                    
                })
                .catch(error => {     
                    
                });*/
            for(var field in this.columns)
            {
                var filter_column=this.columns[field];
                if(filter_column['filter_type']=='list')
                {
                    filter_column['value']=filter_column['default_value']; 
                    if(filter_column['child'])
                    {
                        //resttings childs
                        for (var i=0; i < filter_column['child']['reset_fields'].length; i++)
                        {
                            var reset_field = filter_column['child']['reset_fields'][i];                    
                            this.columns[reset_field].options = [];                            
                        }                        
                    }                   
                }
                else if(filter_column['filter_type']=='number')
                {
                    filter_column['fitler_from']['value']=filter_column['fitler_from']['default_value'];
                    filter_column['fitler_to']['value']=filter_column['fitler_to']['default_value'];
                }
                else if(filter_column['filter_type']=='date')
                {
                    filter_column['fitler_start']['value']=filter_column['fitler_start']['default_value'];
                    filter_column['fitler_end']['value']=filter_column['fitler_end']['default_value'];
                }
                else
                {
                    filter_column['value']=filter_column['default_value'];                     
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