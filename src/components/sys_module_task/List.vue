<template>
  <div>
    <div v-if="$parent.permissions.action0" v-show="$system_variables.status_data_loaded==1">
      <div class="card d-print-none mb-2">
        <div class="card-body">
            <!-- 0=view,1=add,2=edit,3=delete,4=forward,5=print,6=csv,7=column header,8=filter -->
<<<<<<< HEAD
            <router-link  to="/sys_module_task/add" :class="'btn btn-success mr-2 mb-2'" >{{$system_variables.get_label('button_new')}}</router-link>            
            <b-button onclick="window.print();" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action5" >{{$system_variables.get_label('button_print')}}</b-button>
            <b-button @click="$system_functions.export_csv(get_csv_headers,modified_items)" class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action8" >{{$system_variables.get_label('button_csv')}}</b-button>          
=======
            <router-link to="/sys_module_task/add" :class="'btn btn-success mr-2 mb-2'" >{{$system_variables.get_label('button_new')}}</router-link>            
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action5" onclick="window.print();">{{$system_variables.get_label('button_print')}}</b-button>
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action8" @click="$system_functions.export_csv(get_csv_headers,modified_items)">{{$system_variables.get_label('button_csv')}}</b-button>          
>>>>>>> development
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action8" :pressed.sync="show_fitler_options">{{$system_variables.get_label('button_search')}}</b-button>
            <b-button class="mr-2 mb-2" variant="success" v-if="$parent.permissions.action0" @click="$parent.init" >{{$system_variables.get_label('button_refresh')}}</b-button>
        </div>
      </div>
      <div class="card mb-2">
          <div class="card-header d-print-none">
<<<<<<< HEAD
              Variety
=======
              Module &amp; Task List
>>>>>>> development
          </div>
          <div class="card-body"> 
            <b-table                          
              :sticky-header="true"
              sort-icon-left              
              striped hover bordered small  
              :items="modified_items"
              :fields="$parent.columns.display_columns"  
              :sort-compare-options="{ numeric: true}"                        
              >
              <!-- <template v-slot:head(id)="data">
                <div>{{ data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  {{$system_variables.get_label('label_from')}}<input type="text" v-model="$parent.columns.filter_columns['id'].fitler_from.value" class="form-control" />
                  {{$system_variables.get_label('label_to')}}<input type="text" v-model="$parent.columns.filter_columns['id'].fitler_to.value" class="form-control" />
                </div>
              </template> -->

              <template v-slot:[`head(name_${$system_variables.language}${index})`]="data" v-for="index in $parent.max_level">              
                <div>{{data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
<<<<<<< HEAD
                  <input type="text"  class="form-control" v-model="$parent.columns.filter_columns['name_'+$system_variables.language+index].value" />
=======
                  <input type="text" class="form-control form-control-sm" v-model="$parent.columns.filter_columns['name_'+$system_variables.language+index].value" />
>>>>>>> development
                </div>
              </template>

              <!-- <template v-slot:head(type)="data">
                <div>{{ data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  <select class="form-control mini" v-model="$parent.columns.filter_columns['type'].value" @change="$system_functions.on_change_filter_option($event,$parent.columns.filter_columns, 'type')">
                      <option value="">{{$system_variables.get_label('label_select')}}</option>
                      <option v-for="(option, i) in $parent.columns.filter_columns['type'].options" :key="i" :value="option">
                          {{ option }}
                      </option>
                  </select>
                </div>
              </template> -->

              <!-- <template v-slot:head(date_created)="data">
                <div>{{ data.label}}</div>
                <div v-if="show_fitler_options" class="d-print-none">
                  {{$system_variables.get_label('label_start_date')}}<input type="date" v-model="$parent.columns.filter_columns['date_created'].fitler_start.value" class="form-control" />
                  {{$system_variables.get_label('label_end_date')}}<input type="date" v-model="$parent.columns.filter_columns['date_created'].fitler_end.value" class="form-control" />
                </div>
              </template> -->

              <template v-slot:[`cell(name_${$system_variables.language}${index})`]="data" v-for="index in $parent.max_level">              
                <div v-if="data.value==''">{{ data.value}}</div>
<<<<<<< HEAD
                <router-link v-else :to="'/sys_module_task/edit/'+data.item.id" :class="'text-primary'" >{{ data.value}}</router-link>
                
=======
                <router-link v-else :to="'/sys_module_task/edit/'+data.item.id" :class="'text-primary'" >{{ data.value}}</router-link>                
>>>>>>> development
              </template>
            </b-table>
          </div>          
        </div>
    </div>
    
  </div>
</template>

<script>
//import Filters from '@/views/template/Filters.vue'
//import Pagination from '@/views/template/Pagination.vue'


export default {
  name: 'List',
  components: {
    //Filters,Pagination   
  },
  data:function(){
    return{
<<<<<<< HEAD
      show_fitler_options:true
      
=======
      show_fitler_options:true      
>>>>>>> development
    }
  },
  computed:{   
    modified_items:function(){ 
      var temp_items=[];  
      for(var i=0;i<this.$parent.items.length;i++)
      {
        var item={};
        item.id=this.$parent.items[i].module_task.id;
        for(var level=1;level<=this.$parent.max_level;level++)
        {
          if(level==this.$parent.items[i].level)
          {
            //item['name_'+this.$system_variables.language+level]=this.$parent.items[i].module_task['name_'+this.$system_variables.language];          
            item['name_'+this.$system_variables.language+level]=this.$parent.items[i].module_task['name_en'];          
          }
          else
          { 
            item['name_'+this.$system_variables.language+level]='';   
          }
          
        }
        item.type=this.$parent.items[i].module_task.type;
        item.controller=this.$parent.items[i].module_task.controller;
        item.ordering=this.$parent.items[i].module_task.ordering;
        item.date_created=this.$parent.items[i].module_task.date_created;
        temp_items.push(item);
      } 
      var filterd_items=this.$system_functions.get_filter_items(temp_items,this.$parent.columns.filter_columns);          
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
