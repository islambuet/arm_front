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
      this.status_site_loaded=1;
      this.status_task_loaded=1;
    },
  }
}
</script>