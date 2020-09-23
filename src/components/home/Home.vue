<template>
  <div>
     <div v-if="$system_variables.status_task_loaded==1">
       
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
      // console.log('home monted');    

      // var user = {        
      //     session:{
      //       token_auth: 'Auth t 1',
      //       token_csrf: 'CSRF t 1',
      //       token_device: 'DEVICE t 1'
      //     },
      //     system_variable:{
      //       id: 2,
      //       info: [
      //         {name: 'super man'},
      //         {mobile: '01713090961'},
      //         {profile_picture:'https://www.clipartmax.com/png/small/110-1105638_bp-green-yellow-star-logo.png'}
      //       ],
      //     }
      // }
        
      // this.$system_functions.set_user(user);
      // var u = this.$system_functions.get_user();  
      // console.log(u)
  },
  data() {
      return {
        value: '',
        
      }
    }
}
</script>
