<template>
  <div>
     <div v-if="$system_variables.status_task_loaded==1">
       <div class="card">
         <div class="card-header">
            asdf
         </div>
         <div class="card-body">
            wer
         </div>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    msg: String
  },
  mounted:function()
  {
      this.$system_variables.status_task_loaded=1;  
      this.$system_variables.status_data_loaded=1;  
      console.log('home monted');    
  },
  data() {
      return {
        value: '',
        
      }
    }
}
</script>
