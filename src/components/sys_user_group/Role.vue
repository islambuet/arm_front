<template>
  <div>    
    <div v-if="$parent.permissions.action2" v-show="$system_variables.status_data_loaded==1">
      <div class="card d-print-none mb-2">
          <div class="card-body">
            <router-link  to="/sys_user_group" :class="'btn btn-success mr-2 mb-2'" >{{$system_variables.get_label('action_back')}}</router-link>
          </div>
      </div>
      
      <div id="accordion" class="d-print-none" v-if="$parent.loaded_role">        
        <div v-for="(modules_tasks_gropus, root_name) in get_modules_tasks_tree" :key="root_name"> 
          <form :id="'form_save_'+modules_tasks_gropus.modules_tasks[0].id">
            <div class="card mb-2">
              <div class="card-header">
                  <a class="btn-link" data-toggle="collapse" :href="'#sub_accordion_'+modules_tasks_gropus.modules_tasks[0].id">
                      {{root_name}}
                  </a>
                  <b-button class="mr-2 float-right" variant="success" @click="save_role('form_save_'+modules_tasks_gropus.modules_tasks[0].id)" >{{$system_variables.get_label('Save')}}</b-button>
              </div>
              <div :id="'sub_accordion_'+modules_tasks_gropus.modules_tasks[0].id" class="overflow-auto collapse">
                <div class="card-body p-0">
                  <table class="table table-hover table-bordered">
                      <thead class="text-center thead-light">
                        <tr>
                            <th :colspan="modules_tasks_gropus.max_level">{{$system_variables.get_label_task('label_module_task_name')}}</th>
                            <th v-for="(j, i) in $parent.max_module_task_action" :key="i">
                              <label><input type="checkbox" :data-type="'header_action_'+i+'_'+modules_tasks_gropus.modules_tasks[0].id" class="header_action"> {{$system_variables.get_label('action_'+i)}}</label>
                            </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(module_task, index_mt) in modules_tasks_gropus.modules_tasks" :key="index_mt"> 
                          <td v-for="(j, i) in modules_tasks_gropus.max_level" :key="i">                            
                            <label v-if="module_task.level==j">
                              <input type="hidden" :name="'tasks['+module_task.id+'][task_id]'" :value="module_task.id" v-if="module_task.type=='TASK'" />
                              <input type="checkbox" :data-id="module_task.id" :class="'task_action '+module_task.parent_class" />
                              {{module_task.name_en}}
                              
                            </label>
                          </td>
                          <td v-for="(j, i) in $parent.max_module_task_action" :key="'A'+i" >
                            <label v-if="module_task.type=='TASK'">
                              <input type="checkbox" 
                              :class="'header_action_'+i+' header_action_'+i+'_'+modules_tasks_gropus.modules_tasks[0].id+' '+module_task.parent_class+' '+'parent_'+module_task.id" 
                              v-model="module_task['action_'+i]"
                              value="1"
                              :name="'tasks['+module_task.id+'][actions]['+i+']'"
                              :title="$system_variables.get_label('action_'+i)"
                              />
                              {{module_task['action_'+i]}}
                            </label>
                          </td>
                        </tr>
                      </tbody>
                  </table>
                </div>
              </div>
            </div>

          </form>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Role',
  mounted:function()
  {
    jQuery(document).ready(function()
    {
        $(document).off("click", ".header_action");
        $(document).on("click",'.header_action',function()
        {
            if($(this).is(':checked'))
            {
                $('.'+$(this).attr('data-type')).prop('checked', true);
            }
            else
            {
              $('.'+$(this).attr('data-type')).prop('checked', false);
            }
        });
        $(document).off("click", ".task_action");
        $(document).on("click",'.task_action',function()
        {

            if($(this).is(':checked'))
            {
              //$('.parent_'+$(this).attr('data-id')).attr('checked','checked');
              
                //$('.task_action_'+$(this).attr('data-id')+':not(.header_action_3,.header_action_4)').prop('checked', true);
                //$('.parent_'+$(this).attr('data-id')+':not(.header_action_3)').prop('checked', true);
                $('.parent_'+$(this).attr('data-id')+':not(.header_action_3,.header_action_7,.header_action_8)').prop('checked', true);
            }
            else
            {
              //$('.parent_'+$(this).attr('data-id')).removeAttr('checked');
              
                $('.parent_'+$(this).attr('data-id')).prop('checked', false);
            }
        });
    });       

  },  
  computed:{   
    get_modules_tasks_tree:function(){ 
      var items={}
      for(var i=0;i< this.$parent.modules_tasks.length;i++)
      {
        if(this.$parent.modules_tasks[i].level==1)
        {
          items[this.$parent.modules_tasks[i].module_task.name_en]={modules_tasks:[],max_level:1};          
          for(var j=i;j< this.$parent.modules_tasks.length;j++)
          {
            var item={};
            Object.assign(item,this.$parent.modules_tasks[j].module_task);
            item.level=this.$parent.modules_tasks[j].level;
            item.parent_class=this.$parent.modules_tasks[j].parent_class;
            items[this.$parent.modules_tasks[i].module_task.name_en].modules_tasks.push(item);
            if(item.level>items[this.$parent.modules_tasks[i].module_task.name_en].max_level)
            {
              items[this.$parent.modules_tasks[i].module_task.name_en].max_level=item.level;              
            }
            for(var k=0;k<this.$parent.max_module_task_action;k++)
            {
              
              //console.log(this.$parent.item);
              if(this.$parent.item['action_'+k].indexOf(','+item.id+',')>=0)
              {
                item['action_'+k]=true;
              }
              else
              {
                item['action_'+k]=false;
              }
            }            
            if(((j+1)==this.$parent.modules_tasks.length)||(this.$parent.modules_tasks[j+1].level==1))            
            {
              i=j;              
              break;
            }
            
          }
        }
      }
      return items;
    }
  },
  methods:{  
    save_role:function(form_id){
      
      this.$system_variables.status_data_loaded=0;       
      var form_data=new FormData(document.getElementById(form_id));       
      form_data.append ('token_auth', this.$system_variables.user.token_auth); 
      form_data.append ('token_save', this.$system_variables.user.token_save); 
      form_data.append ('item_id', this.$parent.item.id);
      this.$axios.post('/sys_user_group/save_role',form_data)
      .then(response=>{          
        this.$system_variables.status_data_loaded=1;
        if(response.data.error_type)        
        {            
          this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
        }
        else
        {
            this.$system_variables.status_data_loaded=1;
            this.$bvToast.toast(this.$system_variables.get_label("Saved SuccessFully"), {title: this.$system_variables.get_label('label_Success'),variant:'Success',autoHideDelay: 5000,appendToast: false});                          
        }                 
      })
      .catch(error => {   
        this.$system_variables.status_data_loaded=1;
        this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
      });

    } 
    
    
  }  
}
</script>