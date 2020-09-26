<template>
  <div>
    <div v-if="$system_variables.status_task_loaded==1" v-show="$system_variables.status_data_loaded==1">
      <b-nav tabs align="center">
        <b-nav-item v-if="permissions['Region']" :active="current_task=='region'" :to="'/setup_locations/region'">{{$system_variables.get_label('action_regions')}}</b-nav-item>
        <b-nav-item v-if="permissions['Area']" :active="current_task=='area'" :to="'/setup_locations/area'">{{$system_variables.get_label('action_areas')}}</b-nav-item>
        <b-nav-item v-if="permissions['Territory']" :active="current_task=='territory'" :to="'/setup_locations/territory'">{{$system_variables.get_label('action_territories')}}</b-nav-item>        
      </b-nav>      
      <Region ref="region" v-if="current_task=='region'"/>
      <Area ref="area" v-if="current_task=='area'"/>
      <Territory ref="territory" v-if="current_task=='territory'"/>
      
    </div>
  </div>
</template>

<script>
import Region from './region/Region.vue'
import Area from './area/Area.vue'
import Territory from './territory/Territory.vue'

export default {
    name: 'SetupLocations',
    components: {
      Region,Area,Territory 
    },
    mounted:function()
    {
    //    this.$system_variables.labels_task=this.$system_functions.load_languages([
    //     {language:this.$system_variables.language,file:'components/sys_user_group/language.js'}
        
    //   ]); 
      console.log('Locations mounted called');      
      this.init();        
    },
    data() {
      return {
        permissions:{},
        current_task:'',                
      }
    },
    watch: {
        $route(to, from) {
        this.routing(to);      
        }
    },
    methods:{
    routing:function(route)
    {  
      console.log(route.path);   
      if(route.path=='/setup_locations')
      {
        this.$router.push("/setup_locations/"+Object.keys(this.permissions)[0].toLowerCase());        
      }      
      else if(route.path.indexOf("/setup_locations/region")!=-1)      
      {
        this.current_task='region';
        setTimeout(() => {
          if(route.path=='/setup_locations/region')
          {
            this.$refs['region'].init();        
          }
          else if(route.path=="/setup_locations/region/add")
          {
            
            this.$refs['region'].add_edit(0);
          }
        }, 1);        
      }
      else if(route.path.indexOf("/setup_locations/area")!=-1)      
      {
        this.current_task='area';
        setTimeout(() => {
          if(route.path=='/setup_locations/area')
          {
            this.$refs['area'].init();        
          }
          else if(route.path=="/setup_locations/area/add")
          {
            
            this.$refs['area'].add_edit(0);
          }
        }, 1);        
      }
      else if(route.path=='/setup_locations/territory')
      {
        this.current_task='territory';
        setTimeout(() => {
          if(route.path=='/setup_locations/territory')
          {
            this.$refs['territory'].init();        
          }
          else if(route.path=="/setup_locations/territory/add")
          {
            
            this.$refs['territory'].add_edit(0);
          }
        }, 1);               
      }      
    },
    init:function()
    { 
        console.log('Locations init called');
        this.$system_variables.status_task_loaded=0;
        
        var form_data=new FormData();
        
        form_data.append ('token_auth', this.$system_variables.user.token_auth);      
        this.$axios.post('/setup_locations/initialize',form_data)
        .then(response=>{
            if(response.data.error_type)        
            {            
                this.$system_variables.status_task_loaded=0;
                this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});

            }
            else
            {
                this.permissions=response.data.permissions;
                this.$system_variables.status_task_loaded=1;                
                this.routing(this.$route);
            }        
        })
        .catch(error => {     
            console.log(error);
            this.$system_variables.status_task_loaded=-1;
        });
        
    },
  }
}
</script>
