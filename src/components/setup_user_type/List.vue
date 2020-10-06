<template>
  <div>
    <div v-if="$parent.permissions.action_0" v-show="$system_variables.status_data_loaded==1">
      <div class="card d-print-none mb-2">
        <div class="card-body">
            <!-- 0=view,1=add,2=edit,3=delete,4=forward,5=print,6=csv,7=filter,8=column header -->
            <router-link to="/setup_user_type/add" :class="'btn btn-success mr-2 mb-2'">{{$system_variables.get_label('button_new')}}</router-link>            
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action_5" onclick="window.print();">{{$system_variables.get_label('button_print')}}</b-button>
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action_6" @click="$system_functions.export_csv(get_csv_headers,modified_items)">{{$system_variables.get_label('button_csv')}}</b-button>          
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action_7" :pressed.sync="show_fitler_options">{{$system_variables.get_label('button_search')}}</b-button>
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action_8" :pressed.sync="show_column_controls">{{$system_variables.get_label('button_column_control')}}</b-button>
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action_0" @click="$parent.init">{{$system_variables.get_label('button_refresh')}}</b-button>
        </div>
      </div>
      <div class="card d-print-none mb-2" v-if="show_column_controls">
        <div class="card-body">
            <ColumnControl :controller="'setup_user_type'" :method="'list'" :control_columns="$parent.columns.control_columns" :hidden_columns="$parent.columns.hidden_columns" :on_change_control="$parent.set_display_columns"/>            
        </div>
      </div>
      <div class="card mb-2">
          <div class="card-header d-print-none">
              {{$system_variables.get_label_task('label_title')}} 
          </div>
          <div class="card-body"> 
            <b-table  
              :class="'has_action_column_first'"                        
              :sticky-header="true"
              sort-icon-left              
              striped hover bordered small  
              :items="modified_items"
              :fields="$parent.columns.display_columns"  
              :sort-compare-options="{ numeric: true}"                        
              >
              <!-- <template v-slot:head(id)="data">
                <div>{{data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  {{$system_variables.get_label('label_from')}}<input type="text" v-model="$parent.columns.filter_columns['id'].fitler_from.value" class="form-control" />
                  {{$system_variables.get_label('label_to')}}<input type="text" v-model="$parent.columns.filter_columns['id'].fitler_to.value" class="form-control" />
                </div>
              </template> -->

              <template v-slot:head(name)="data">              
                <div>{{data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  <input type="text"  class="form-control" v-model="$parent.columns.filter_columns['name'].value" />
                </div>
              </template>

              <template v-slot:head(constant)="data">              
                <div>{{data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  <input type="text"  class="form-control" v-model="$parent.columns.filter_columns['constant'].value" />
                </div>
              </template>

              <template v-slot:head(remarks)="data">              
                <div>{{data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  <input type="text"  class="form-control" v-model="$parent.columns.filter_columns['remarks'].value" />
                </div>
              </template>

              <template v-slot:head(status)="data">
                <div>{{ data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  <select class="form-control mini" v-model="$parent.columns.filter_columns['status'].value" @change="$system_functions.on_change_filter_option($event,$parent.columns.filter_columns, 'status')">
                      <option value="">{{$system_variables.get_label('label_select')}}</option>
                      <option v-for="(option, i) in $parent.columns.filter_columns['status'].options" :key="i" :value="option">
                          {{ option }}
                      </option>
                  </select>
                </div>
              </template>

              <template v-slot:cell(num_tasks)="data">
                {{data.item.action_0.split(',').length-2}}                
              </template>

              <template v-slot:cell(actions)="data">
                <b-dropdown size="sm" :text="$system_variables.get_label('button_action')" dropright variant="primary" :class="'action_menu'">
                  <b-dropdown-item :to="'/setup_user_type/edit/'+data.item.id">{{$system_variables.get_label('action_edit')}}</b-dropdown-item>
                  <!-- <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item :to="'/setup_user_type/role/'+data.item.id">{{$system_variables.get_label_task('action_assign_role')}}</b-dropdown-item> -->
                </b-dropdown>
              </template>
            </b-table>
          </div>          
        </div>
        <div class="card mb-2 d-print-none">
          <div class="card-body pb-0">
            <Pagination :pagination="$parent.pagination"/>            
          </div>
        </div>
    </div>
    
  </div>
</template>

<script>
import Pagination from '@/views/template/Pagination.vue'
import ColumnControl from '@/views/template/ColumnControl.vue'

export default {
  name: 'List',
  components: {
    Pagination,ColumnControl   
  },
  data:function(){
    return{
      show_column_controls:true,
      show_fitler_options:false
    }
  },
  computed:{   
    modified_items:function(){       
      var filterd_items=this.$system_functions.get_filter_items(this.$parent.items,this.$parent.columns.filter_columns); 
      this.$parent.pagination.num_item_showing=filterd_items.length;         
      return filterd_items;
    },          
    get_csv_headers(){
      return this.$parent.columns.display_columns.filter((item)=>{ if(item.key=='actions'){return false;} return true});
    }
  },  
  mounted:function()
  {      
  }, 
  methods:{    
       
  } 
}
</script>
