<template>
  <div>
     <div v-if="$system_variables.status_task_loaded==1">
       <div v-if="!($system_variables.user.id >0) && ($route.name!='Login')">
        <b-card-group deck>
          <b-card
            header="featured"
            header-tag="header"
            footer="Card Footer"
            footer-tag="footer"
            title="Title"
          >
            <b-card-text>Header and footers using props.</b-card-text>
            <b-button href="#" variant="primary">Go somewhere</b-button>
          </b-card>
        </b-card-group>
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
