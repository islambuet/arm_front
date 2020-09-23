<template>
    <div>
        <div v-if="$parent.permissions.action0" v-show="$system_variables.status_data_loaded==1">
            <div class="card d-print-none mb-2">
                <div class="card-body">
                    <b-button class="mr-2 mb-2" variant="success" @click="add(0)" v-if="$parent.permissions.action1">{{$system_variables.get_label('button_new')}}</b-button>
                    <b-button onclick="window.print();" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action4" >{{$system_variables.get_label('button_print')}}</b-button>
                    <b-button @click="$system_functions.export_csv(get_csv_headers,modifiedIetms)" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action5" >{{$system_variables.get_label('button_csv')}}</b-button>
                    <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action6" :pressed.sync="show_filter_options">{{$system_variables.get_label('button_search')}}</b-button>
                    <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action7" :pressed.sync="show_column_controls">{{$system_variables.get_label('button_column_control')}}</b-button>
                    <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action0" @click="$parent.init" >{{$system_variables.get_label('button_refresh')}}</b-button>
                </div>
            </div> 
            <div class="card d-print-none mb-2" v-if="$parent.permissions.action7" v-show="show_column_controls">          
                <div class="card-body">            
                    <form :id="'form_column_controls'">
                        <input type="hidden" name="task" value="transfer">
                        <input type="hidden" name="method" value="list">
                        <b-form-checkbox v-for="(item, index) in $parent.columns.control_columns" :key="index"
                            v-model="item.selected"
                            :name="'hidden_columns[]'"
                            :value="item.value"
                            @change="toggle_control_columns($event,item.value,item.selected)"                
                            inline
                        >
                            {{item.label}}
                        </b-form-checkbox>                  
                        <div class="text-center">
                            <b-button class="mr-2" variant="success" @click="$system_functions.save_preference($event,'form_column_controls',$bvToast)" >{{$system_variables.get_label('button_save_preference')}}</b-button>
                        </div>
                    </form>
                </div>          
            </div>
            <div class="card mb-2">
                <div class="card-header d-print-none">
                    Transfer
                </div>
                <div class="card-body"> 
                    <b-table            
                    :class="'has_action_column'"
                    :sticky-header="true"
                    sort-icon-left              
                    striped hover bordered small  
                    :items="modified_items"
                    :fields="$parent.columns.display_columns"  
                    :sort-compare-options="{ numeric: true}"                        
                    >
                    <template v-slot:head(id)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options" class="d-print-none">
                            {{$system_variables.get_label('label_from')}}<input type="text" v-model="$parent.columns.filter_columns['id'].filter_from.value" class="form-control" />
                            {{$system_variables.get_label('label_to')}}<input type="text" v-model="$parent.columns.filter_columns['id'].filter_to.value" class="form-control" />
                        </div>
                    </template>
                    <template v-slot:head(date_request)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options" class="d-print-none">
                            {{$system_variables.get_label('label_start')}}<input type="date" v-model="$parent.columns.filter_columns['date_request'].filter_start.value" class="form-control" />
                            {{$system_variables.get_label('label_end')}}<input type="date" v-model="$parent.columns.filter_columns['date_request'].filter_end.value" class="form-control" />
                        </div>
                    </template>
                    <template v-slot:head(quantity_total_request)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options" class="d-print-none">
                            {{$system_variables.get_label('label_from')}}<input type="text" v-model="$parent.columns.filter_columns['quantity_total_request'].filter_from.value" class="form-control" />
                            {{$system_variables.get_label('label_to')}}<input type="text" v-model="$parent.columns.filter_columns['quantity_total_request'].filter_to.value" class="form-control" />
                        </div>
                    </template>
                    <template v-slot:head(remarks_request)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options"><input type="text" v-model="$parent.columns.filter_columns['remarks_request'].value" class="form-control" /></div>
                    </template>
                    <template v-slot:head(outlet_name)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options"><input type="text" v-model="$parent.columns.filter_columns['outlet_name'].value" class="form-control" /></div>
                    </template>
                    <!-- <template v-slot:head(crop)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options" class="d-print-none">
                        <select class="form-control mini" v-model="$parent.columns.filter_columns['crop_id'].value" @change="$system_functions.on_chage_filter_option($event,$parent.columns.filter_columns, 'crop_id')">
                            <option value="">{{$system_variables.get_label('label_select')}}</option>
                            <option v-for="(option, i) in $parent.columns.filter_columns['crop_id'].options" :key="i" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                        </div>
                    </template>
                    <template v-slot:head(type_name)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options" class="d-print-none">
                        <select class="form-control mini" v-model="$parent.columns.filter_columns['crop_type_id'].value">
                            <option value="">{{$system_variables.get_label('label_select')}}</option>
                            <option v-for="(option, i) in $parent.columns.filter_columns['crop_type_id'].options" :key="i" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                        </div>
                    </template> -->
                    <!-- <template v-slot:head(name)="data">
                        <div>{{ data.label}}</div>
                        <div v-if="show_filter_options"><input type="text" v-model="$parent.columns.filter_columns['name'].value" class="form-control" /></div>
                    </template> -->
                    
                    <template v-slot:cell(actions)="data" class="d-print-none" >
                        <b-dropdown size="sm" text="Action" right variant="primary" class="m-2">
                        <b-dropdown-item-button @click="edit(data.item)">Edit</b-dropdown-item-button>
                        <b-dropdown-item-button @click="details(data.item)">Details</b-dropdown-item-button>
                        <b-dropdown-item-button @click="del(data.item)">Delete</b-dropdown-item-button>
                        </b-dropdown>
                    </template>
                    </b-table>
                </div>          
            </div>
            <div class="card mb-2 d-print-none">
                <div class="card-body">
                    <Pagination :pagination="$parent.pagination" :onChangePage="on_change_page"/>            
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Filters from '@/views/template/Filters.vue'
import Pagination from '@/views/template/Pagination.vue'
export default {
    name: 'List',
    components: {
        Filters,Pagination   
    },
    computed:{
        modified_items:function(){        
            var temp_items=this.$system_functions.get_filter_items(this.$parent.items,this.$parent.columns.filter_columns);
            this.$parent.pagination.num_item_showing=temp_items.lengh;
            return temp_items;
        },
        get_csv_headers(){
            return this.$parent.columns.display_columns.filter((item)=>{ if(item.key=='actions'){return false;} return true});
        }
    },
    data() {
      return {                
        show_filter_options:false,
        show_column_controls:false,
      }
    },
    methods:{
        toggle_control_columns:function (event,column_name,columnValue)
        {
            if(!columnValue)
            {
                this.$parent.columns.hidden_columns.push(column_name);
            }
            else
            {
                this.$parent.columns.hidden_columns = this.$parent.columns.hidden_columns.filter(e => e !== column_name)        
            }
            this.$parent.set_display_columns();
        },
        add:function()
        {
            this.$router.push({path:"/transfer/add"});
        },
        edit:function(item)
        {
            this.$router.push("/transfer/edit/"+item.id);
        },
        details:function(item)
        {
            console.log('details');
            console.log(item);
        },
        del:function(item)
        {
            console.log('delete');
            console.log(item);
        },
        on_change_page:function()
        {
            this.$parent.reload_items=true;
            this.$parent.get_items();
        }
    }
}
</script>