<template>
  <div>
    <div v-if="$parent.permissions.action1 || $parent.permissions.action2" v-show="$system_variables.status_data_loaded==1">
        <div class="card d-print-none mb-2">
            <div class="card-body">
              <router-link  to="/sys_module_task" :class="'btn btn-success mr-2 mb-2'" >{{$system_variables.get_label('button_back')}}</router-link>
                
                <b-button class="mr-2 mb-2" variant="success" @click="save(false)">{{$system_variables.get_label('button_save')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" @click="save(true)">{{$system_variables.get_label('button_save_new')}}</b-button>
            </div>
        </div>  
        <div class="card d-print-none mb-2">
          <div class="card-header">
            <div v-if="$parent.item.id>0">Edit ::{{$parent.item['name_'+$system_variables.language]}}</div>
            <div v-else>{{$system_variables.get_label('label_sys_module_task_new')}}</div>
          </div>
          <div class="card-body">
            <form id="form_save">
              <input type="hidden" name="item_id" :value="$parent.item.id">
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_name_en')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <input type="text" name="item[name_en]" v-model="$parent.item.name_en" class="form-control" />
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_name_bn')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <input type="text" name="item[name_bn]" v-model="$parent.item.name_bn" class="form-control" />
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label_task('label_icon_class')}}</label> </b-col>
                <b-col cols="8" sm="4">
                  <input type="text" name="item[icon_class]" v-model="$parent.item.icon_class" class="form-control" />
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_type')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <select class="form-control" v-model="$parent.item.type" name="item[type]" >
                        <option value="">{{$system_variables.get_label('Label_select')}}</option>
                        <option v-for="(option, index) in $parent.types" :key="index" :value="option">
                            {{ option}}
                        </option>
                    </select>
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_parent')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <select class="form-control" v-model="$parent.item.parent" name="item[parent]" >
                        <option value="0">{{$system_variables.get_label('Label_select')}}</option>
                        <option v-for="(option, index) in get_parents" :key="index" :value="option.value">
                            {{ option.text}}
                        </option>
                    </select>
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_controller_name')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <input type="text" name="item[controller]" v-model="$parent.item.controller" class="form-control" />
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_ordering')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <input type="number" name="item[ordering]" v-model="$parent.item.ordering" class="form-control" />
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_status')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <select class="form-control" v-model="$parent.item.status" name="item[status]" >                        
                        <option v-for="(option, index) in ['Active','In-Active']" :key="index" :value="option">
                            {{ option}}
                        </option>
                    </select>
                </b-col>                              
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="text-right"><label>{{$system_variables.get_label('label_status_notification')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <select class="form-control" v-model="$parent.item.status_notification" name="item[status_notification]" >                        
                        <option v-for="(option, index) in ['Yes','No']" :key="index" :value="option">
                            {{ option}}
                        </option>
                    </select>
                </b-col>                
              </b-row>
              </form>
          </div>          
        </div> 
        
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddEdit',
  mounted:function()
  {    
  },  
  computed:{   
    get_parents:function(){ 
      var temp_items=[];  
      for(var i=0;i<this.$parent.items.length;i++)
      {
        if(this.$parent.items[i].module_task.type!='TASK')
        {
          temp_items.push({value:this.$parent.items[i].module_task.id,text:this.$parent.items[i].prefix+''+this.$parent.items[i].module_task['name_en']});
        }
      } 
      return temp_items;

    }
  },
  methods:{
    
    save:function(save_and_new)
    {
      this.$system_variables.status_data_loaded=0; 
      var form_data=new FormData(document.getElementById('form_save'));       
      form_data.append ('token_auth', this.$system_variables.user.token_auth); 
      this.$axios.post('/sys_module_task/save_item',form_data)
      .then(response=>{          
        this.$system_variables.status_data_loaded=1;
        if(response.data.error_type)        
        {            
          this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
        }
        else
        {
            this.$parent.reload_items=true;
            this.$system_variables.status_data_loaded=1;
            this.$bvToast.toast(this.$system_variables.get_label("Saved SuccessFully"), {title: this.$system_variables.get_label('label_Success'),variant:'Success',autoHideDelay: 5000,appendToast: false});              
            if(save_and_new)
            {
              this.$router.push("/sys_module_task/add");
            }
            else
            {
              this.$router.push("/sys_module_task");
            }
        }                 
      })
      .catch(error => {   
        this.$system_variables.status_data_loaded=1;
        this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
      });                 
          
          
      /*this.$systemVariables.statusSaving=1;        
      var formData=new FormData(document.getElementById('form_save_variety'));
      formData.append ('tokenAuth', this.$systemVariables.user.tokenAuth);      
          
            
      this.$axios.post('/variety/save_item',formData)
      .then(response=>{          
        this.$systemVariables.statusSaving=0;
        if(response.data.errorString)        
        {            
          if(response.data.errorString==this.$systemResponse.NoAccess)
          { 
            this.$systemVariables.statusTaskLoaded=-2;
          }
          else
          {
              this.$systemVariables.statusDataLoaded=1;
              this.$bvToast.toast(response.data.errorString, {
                title: 'Error',
                autoHideDelay: 5000,
                appendToast: false    
              });
          }          
        }
        else
        {
            this.$parent.reloadItems=true;
            this.$bvToast.toast("variety saved Succesfully", {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false    
              });
              if(save_and_new)
              {
                this.$router.push("/variety/add");
              }
              else
              {
                this.$router.push("/variety");
              }
              
        }        
      })
      .catch(error => {   
        this.$systemVariables.statusSaving=0;
        this.$bvToast.toast('Server Error', {
          title: 'Save Problem',
          autoHideDelay: 5000,
          appendToast: false
        });     
      });*/
    }
  }  
}
</script>