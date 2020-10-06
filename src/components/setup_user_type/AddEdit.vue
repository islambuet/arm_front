<template>
  <div>
    <div v-if="$parent.permissions.action_1 || $parent.permissions.action_2" v-show="$system_variables.status_data_loaded==1">
        <div class="card d-print-none mb-2">
            <div class="card-body">
              <router-link  to="/setup_user_type" :class="'btn btn-success mr-2 mb-2'" >{{$system_variables.get_label('action_back')}}</router-link>            
                <b-button class="mr-2 mb-2" variant="success" @click="save(false)">{{$system_variables.get_label('button_save')}}</b-button>
                <b-button class="mr-2 mb-2" variant="success" @click="save(true)">{{$system_variables.get_label('button_save_new')}}</b-button>
            </div>
        </div>  
        <div class="card d-print-none mb-2">
          <div class="card-header">
            <div v-if="$parent.item.id>0">Edit :: {{$parent.item['name']}}</div>
            <div v-else>{{$system_variables.get_label_task('label_add')}}</div>
          </div>
          <div class="card-body">
            <form id="form_save">
              <input type="hidden" name="item_id" :value="$parent.item.id">
              <b-row class="mb-2">
                <b-col cols="4" class="mt-1 text-right"><label>{{$system_variables.get_label_task('label_name')}}</label> <strong class="text-danger"> * </strong></b-col>
                <b-col cols="8" sm="4">
                  <input type="text" name="item[name]" v-model="$parent.item.name" class="form-control" required/>
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="mt-1 text-right"><label>{{$system_variables.get_label_task('label_constant')}}</label> <strong class="text-danger"> * </strong></b-col>
                <b-col cols="8" sm="4">
                  <input type="text" name="item[constant]" v-model="$parent.item.constant" class="form-control" />
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="mt-1 text-right"><label>{{$system_variables.get_label_task('label_remarks')}}</label></b-col>
                <b-col cols="8" sm="4">
                  <textarea class="form-control" name="item[remarks]" v-model="$parent.item.remarks" rows="3" ></textarea>
                </b-col>                
              </b-row>
              <b-row class="mb-2">
                <b-col cols="4" class="mt-1 text-right"><label>{{$system_variables.get_label('label_status')}}</label> <strong class="text-danger"> * </strong></b-col>
                <b-col cols="8" sm="4">
                  <select class="form-control" v-model="$parent.item.status" name="item[status]" required>                        
                        <option v-for="(option, index) in ['Active','In-Active']" :key="index" :value="option">
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
      // form_data.append ('token_auth', this.$system_variables.user.token_auth);
      // form_data.append ('token_csrf', this.$system_variables.user.token_csrf);
      form_data.append ('token_auth', localStorage.getItem('token_auth'));
      form_data.append ('token_csrf', localStorage.getItem('token_csrf'));
      this.$axios.post('/setup_user_type/save_item',form_data)
      .then(response=>{          
        this.$system_variables.status_data_loaded=1;
        if(response.data.error_type)        
        {            
          // this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
          this.$system_functions.response_error_task(response);
          return;
        }
        else
        {
          this.$parent.reload_items=true;
          this.$system_variables.status_data_loaded=1;
          this.$bvToast.toast(this.$system_variables.get_label("Saved SuccessFully"), {title: this.$system_variables.get_label('label_success'),variant:'success',autoHideDelay: 5000,appendToast: false});              
          if(save_and_new)
          {
            this.$router.push("/setup_user_type/add");
          }
          else
          {
            this.$router.push("/setup_user_type");
          }
        }  
        this.$system_variables.set_csrf(response);               
      })
      .catch(error => {   
        this.$system_variables.status_data_loaded=1;
        this.$bvToast.toast( this.$system_variables.get_label('msg_contact_with_admin'),
        {
          title: this.$system_variables.get_label('msg_response_error_title'),
          variant:'danger',
          autoHideDelay: 5000,
          appendToast: false
        }); 
      });
    }
  }  
}
</script>