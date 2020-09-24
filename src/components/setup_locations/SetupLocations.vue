<template>
  <div>
    <div v-if="$system_variables.status_task_loaded==1">
      <b-nav tabs align="center">
        <b-nav-item v-if="tasks.includes('Region')" :active="task=='region'" :to="'/setup_locations/region'">Regions</b-nav-item>
        <b-nav-item v-if="tasks.includes('Area')" :active="task=='area'" :to="'/setup_locations/area'">Area</b-nav-item>
        <b-nav-item v-if="tasks.includes('Territory')" :active="task=='territory'" :to="'/setup_locations/territory'">Territory</b-nav-item>        
      </b-nav>      
      <Area ref="area" v-if="task=='area'"/>
    </div>
  </div>
  
  
</template>

<script>
import Area from './area/Area.vue'
//import List from './List.vue'
//import Role from './Role.vue'
//import AddEdit from './AddEdit.vue'
export default {
    name: 'SetupLocations',
    components: {
  //      List,Role,AddEdit  
  Area 
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
          tasks:[],
          task:'',                
        permissions:{},
        columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]},
        items:[],
        types:[],
        item:{},        
        default_item:{id:0,name:"",ordering:99,status:'Active',action_0:0,action_1:0,action_2:0,action_3:0,action_4:0,action_5:0,action_6:0,action_7:0,action_8:0},
        //pagination:{current_page:1,items_per_page:50,num_itemshowing:0,num_items:10,page_options: [10,20, 50, 100, 500]},
        pagination:{current_page:1,items_per_page:5,num_item_showing:0,num_items:0},
        max_modules_tasks_level:1,
        modules_tasks:[],
        max_module_task_action:9,
        reload_items:true,
        loaded_role:false
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
        this.$router.push("/setup_locations/"+this.tasks[0].toLowerCase());        
      }
      if(route.path=='/setup_locations/region')
      {
        this.task='region';
      }
      else if(route.path.indexOf("/setup_locations/area")!=-1)      
      {
        this.task='area';
        setTimeout(() => {
          if(route.path=='/setup_locations/area')
          {
            this.$refs.area.get_items();        
          }
          else if(route.path=="/setup_locations/area/add")
          {
            
            this.$refs['area'].add_edit(0);
          }
        }, 1);        
      }
      else if(route.path=='/setup_locations/territory')
      {
        this.task='territory';        
      }
      else if(route.path=="/sys_user_group/add")
      {
        this.$refs['territory'].get_items();
        this.method='add';
        this.add_edit(0);
      }
      else if(route.path.indexOf("/sys_user_group/edit/")!=-1)
      {
        this.method='edit';        
        this.add_edit(route.params['item_id']);        
      }
      else if(route.path.indexOf("/sys_user_group/role/")!=-1)
      {
        this.method='role';        
        this.role(route.params['item_id']);        
      }
    },
    init:function()
    { 
        console.log('Locations init called');
        this.$system_variables.status_task_loaded=0;
        
        var form_data=new FormData();
        
        form_data.append ('token_auth', this.$system_variables.user.token_auth);      
        this.$axios.post('/setup_locations/setup_locations/initialize',form_data)
        .then(response=>{
            if(response.data.error_type)        
            {            
                this.$system_variables.status_task_loaded=0;
                this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});

            }
            else
            {
                this.tasks=response.data.tasks;
                this.$system_variables.status_task_loaded=1;                
                this.routing(this.$route);
            }        
        })
        .catch(error => {     
            console.log(error);
            this.$system_variables.status_task_loaded=-1;
        });
        
    },
    set_control_columns:function()
    {
      this.$system_variables.status_task_loaded=1;
                 
    },
    set_filter_columns:function()
    {
      var filter_columns={};
      filter_columns['id']={filter_type:'number',fitler_from:{value:"", default_value:""},fitler_to:{value:"", default_value:""}};
      filter_columns['name']={value:"", default_value:""};//default value not using               
      filter_columns['status']={filter_type:'list', options:['Active','In-Active'], value:"", default_value:""};
      //filter_columns['date_created']={filter_type:'date',fitler_start:{value:'', default_value:""},fitler_end:{value:'', default_value:""}};
      this.columns.filter_columns=filter_columns;      
    },
    set_display_columns:function()
    {
      var columns={};
      columns['actions']={label:this.$system_variables.get_label('Label_action'), hidden:this.columns.false,sticky_column:false};//cannot set it sticky becuase dropdown will goes bellow
      columns['id']={label:this.$system_variables.get_label('label_id'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,sticky_column:true,sortable:false};
      columns['name']={label:this.$system_variables.get_label('label_name'), hidden:this.columns.hidden_columns.indexOf('name')>=0?true:false,sticky_column:false,sortable:false};
      columns['num_tasks']={label:this.$system_variables.get_label_task('num_tasks'), hidden:this.columns.hidden_columns.indexOf('num_tasks')>=0?true:false,sticky_column:false,sortable:false};
      columns['ordering']={label:this.$system_variables.get_label('label_ordering'), hidden:this.columns.hidden_columns.indexOf('ordering')>=0?true:false,sticky_column:false,sortable:false};
      columns['status']={label:this.$system_variables.get_label('label_status'), hidden:this.columns.hidden_columns.indexOf('status')>=0?true:false,sticky_column:false,sortable:false};
      this.columns.display_columns=this.$system_functions.get_display_columns(columns); 
    },
    get_items:function()
    {
        if(this.reload_items)
        {
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
                  
                  this.items=response.data.items;
                  //this.pagination.num_items=response.data.num_items;//here returning all data                                        
                  this.pagination.num_items=this.items.length;
                  this.reload_items=false;
              }       
            })
            .catch(error => {   
                this.$system_variables.status_data_loaded=1;
                this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
            });
        }
    },
    add_edit:function(item_id)
    {
      if(item_id>0)
      {
        if(!(this.permissions.action2))
        { 
          this.$system_variables.status_task_loaded=-2;
        }
        else
        {
          this.$system_variables.status_data_loaded=0;        
          var form_data=new FormData();
          form_data.append ('token_auth', this.$system_variables.user.token_auth);                  
          form_data.append ('item_id', item_id);
          this.$axios.post('/sys_user_group/get_item',form_data)
          .then(response=>{          
            this.$system_variables.status_data_loaded=1;
            if(response.data.error_type)        
            {            
              this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
              this.$router.push("/sys_user_group");
            }
            else
            {
              if(response.data.item)  
              {
                this.item=response.data.item; 
              }
              else
              {
                this.$bvToast.toast(this.$system_variables.get_label('Data Not Found'), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
                this.$router.push("/sys_user_group");
              }
            }        
          })
          .catch(error => {   
            this.$system_variables.status_data_loaded=1;
            this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});  
            this.$router.push("/sys_user_group");            
          });
        }
      }
      else
      {
        if(!(this.permissions.action1))
        {
          this.$system_variables.status_task_loaded=-2;
        }
        else
        { 
          this.item={};//need to reset       
          Object.assign(this.item, this.default_item);          
        }        
      } 
       
    },
    role:function(item_id)
    {
      if(item_id>0)
      {
        if(!(this.permissions.action2))
        { 
          this.$system_variables.status_task_loaded=-2;
        }
        else
        {
          this.loaded_role=false;//for reload role task
          this.$system_variables.status_data_loaded=0;        
          var form_data=new FormData();
          form_data.append ('token_auth', this.$system_variables.user.token_auth);                  
          form_data.append ('item_id', item_id);
          this.$axios.post('/sys_user_group/get_item',form_data)
          .then(response=>{          
            this.$system_variables.status_data_loaded=1;
            if(response.data.error_type)        
            {            
              this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
              this.$router.push("/sys_user_group");
            }
            else
            {
              if(response.data.item)  
              {
                this.item=response.data.item; 
                this.loaded_role=true;//reseted
              }
              else
              {
                this.$bvToast.toast(this.$system_variables.get_label('Data Not Found'), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
                this.$router.push("/sys_user_group");
              }
            }        
          })
          .catch(error => {   
            this.$system_variables.status_data_loaded=1;
            this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});  
            this.$router.push("/sys_user_group");            
          });
        }
      }
      else
      {
        this.$system_variables.status_task_loaded=-2;        
      }
    },    
  }
}
</script>
