<template>
  <div>
      <List v-show="method=='list'"/>          
      <!-- <AddEdit v-show="method=='add' || method=='edit'"/>      -->
  </div>
</template>

<script>
import List from './List.vue'

export default {
    name: 'Area', 
    components: {
        List
    },   
    mounted:function()
    {
      console.log('area init called');
    },
    data() {
      return {
          method:"initial"
      }
    },
    
    methods:{
    get_items:function()
    {
      this.method='list';
      this.$system_variables.status_data_loaded=0;        
      var form_data=new FormData();
      form_data.append ('token_auth', this.$system_variables.user.token_auth);                  
      this.$axios.post('/sys_user_group/get_items',form_data)
      .then(response=>{          
        this.$system_variables.status_data_loaded=1;
        if(response.data.error_type)        
        {   
            this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
        }
        else
        {   
            
            
            
        }       
      })
      .catch(error => {   
          this.$system_variables.status_data_loaded=1;
          this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
      });
    },
    add_edit:function(item_id)
    {
      this.method='add';
    }, 
  }
}
</script>
