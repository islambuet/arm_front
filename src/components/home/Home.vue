<template>
  <div>
    <div v-if="$system_variables.status_task_loaded==1">
      <div class="card d-print-none mb-2" v-if="!($system_variables.user.id >0)">          
        <div class="card-body">
          <router-link class="btn btn-primary mr-2" to="/login">{{$system_variables.get_label('label_login')}}</router-link>            
        </div>          
      </div> 
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',  
  mounted:function()
  {
      this.$system_variables.status_task_loaded=1;  
      this.$system_variables.status_data_loaded=1;  
  },
  data() {
      return {
        value: '',
        
      }
    }
}
</script>
