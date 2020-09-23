<template>
  <div id="system_main_container">
    <Loading v-if="status_site_loaded == 0"/>
    <LoadingFailed v-if="status_site_loaded == -1"/>
    <Header v-if="status_site_loaded == 1"/>
    <SidebarLeft v-if="status_site_loaded == 1"/>
    <SidebarRight v-if="status_site_loaded == 1"/>
    <div id="system_content" v-if="status_site_loaded == 1">
      <Loading v-if="$system_variables.status_task_loaded == 0"/>
      <LoadingFailed v-if="$system_variables.status_task_loaded == -1"/>  
      <LoadingAccessDeny v-if="$system_variables.status_task_loaded == -2"/>  
      <Loading v-show="$system_variables.status_data_loaded == 0"/>
      <router-view/>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Loading from '@/views/busy_states/Loading.vue'
import LoadingFailed from '@/views/busy_states/LoadingFailed.vue'
import LoadingAccessDeny from '@/views/busy_states/LoadingAccessDeny.vue'
import Header from '@/views/template/Header.vue'
import SidebarLeft from '@/views/template/SidebarLeft.vue'
import SidebarRight from '@/views/template/SidebarRight.vue'
export default {
  name: 'App',
  components: {
    Loading,LoadingFailed,LoadingAccessDeny,Header,SidebarLeft,SidebarRight
  },
  data:function(){
    return {
      status_site_loaded:0,//Loading=0,success=0,failed=-1  only this page   
    }
  },
  mounted: function()//before create
  { 
    this.$system_variables.labels=this.$system_functions.load_languages([
      {language:this.$system_variables.language,file:'languages/response.js'},
      {language:this.$system_variables.language,file:'languages/theme.js'},
      {language:this.$system_variables.language,file:'languages/buttons.js'},
    ]);         
    document.title=this.$system_variables.get_label('site_title');
    this.init();   
  },
  methods:{
    init: function()
    {
      this.status_site_loaded=0;
      this.$system_variables.status_task_loaded=1;//avoid multiple loading scrree      
      this.$system_variables.status_data_loaded=1;      
      var form_data=new FormData();
      form_data.append ('token_auth', this.$system_variables.user.token_auth);
      this.$axios.all([      
          this.$axios.post('/users/get_tasks',form_data),          
        ])
        .then(this.$axios.spread((users_tasks) => 
        {
          if(users_tasks.data.error_type)        
          {            
              this.status_site_loaded=-1;
              this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});

          }
          else
          {
            this.$system_variables.users.tasks=users_tasks.data.tasks;
            this.status_site_loaded=1;
            
          }        
        })).catch(error => {  
          this.status_site_loaded=-1;
            
        });
    },
  }
}
</script>