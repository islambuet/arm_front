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
      // console.log('Dashboard Page');
      // console.log('Auth Token: '+ localStorage.getItem('token_auth'));
      // console.log('Device Token: '+ localStorage.getItem('token_device'));
      // console.log(this.$system_variables.user);
      // console.log(this.$system_variables.user.tasks);
      // console.log(navigator.userAgent);
  },
  data() {
      return {
        value: '',
        
      }
    }
}
</script>
