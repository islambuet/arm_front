<template>
  <div>
     <div v-if="$system_variables.status_task_loaded==1">
    <List v-show="method=='list'"/>    
    <!-- <AddEdit v-show="method=='add' || method=='edit'"/>     -->
    </div>
  </div>
  
  
</template>

<script>
import List from './List.vue'
//import AddEdit from './AddEdit.vue'
export default {
    name: 'Variety',
    components: {
        List//,AddEdit   
    },
    mounted:function()
    {
        this.init();        
    },
    data() {
      return {
        method:'list',
        permissions:{},
        columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]},
        items:[],
        max_level:0,
        reload_items:true
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
      if(route.path=='/sys_module_task')
      {
        this.method='list';
        this.get_items();
      }
      /*else if(route.path=="/variety/add")
      {        
        this.method='add';
        this.addEdit(0);
      }
      else if(route.path.indexOf("/variety/edit/")!=-1)
      {
        this.method='edit';        
        this.addEdit(route.params['varietyId']);        
      }*/
    },
    init:function()
    { 
        this.$system_variables.status_task_loaded=0;  
        this.$system_variables.status_data_loaded=1;  
        this.reload_items=true;
        var form_data=new FormData();
        form_data.append ('token_auth', this.$system_variables.user.token_auth);      
        this.$axios.post('/sys_module_task/initialize',form_data)
        .then(response=>{
            if(response.data.errorType)        
            {            
                this.$system_variables.status_task_loaded=0;
                this.$bvToast.toast(this.$system_variables.get_label(response.data.errorType), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});

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
    set_filter_columns:function()
    {
      var filter_columns={};
      filter_columns['id']={filter_type:'number',fitler_from:{value:"", default_value:""},fitler_to:{value:"", default_value:""}};
      for(var level=1;level<=this.max_level;level++)
      {
          filter_columns['name'+level]={value:"", default_value:""};//default value not using         
      }
      //filterColumns['crop_id']={filtertype:'list', options:this.crops, child:{ field:'crop_type_id', options:this.cropTypes, resetFields:['crop_type_id'] },value:"", defaultValue:""};
      //filter_columns['type']={filter_type:'list', options:['Module','Task'], child:{ field:'crop_type_id', options:this.crop_types, reset_fields:['crop_type_id'] },value:"", default_value:""};
      filter_columns['type']={filter_type:'list', options:['MODULE','TASK'], value:"", default_value:""};
      filter_columns['date_created']={filter_type:'date',fitler_start:{value:'', default_value:""},fitler_end:{value:'', default_value:""}};
      this.columns.filter_columns=filter_columns;
      console.log(filter_columns);
    },
    set_display_columns:function()
    {
      var columns={};
      columns['id']={label:this.$system_variables.get_label('ID'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,stickyColumn:true,sortable:false};
      for(var level=1;level<=this.max_level;level++)
      {
          columns['name'+level]={label:this.$system_variables.get_label('Name'), hidden:false,stickyColumn:false,sortable:false};          
      }
      columns['type']={label:this.$system_variables.get_label('Type'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,stickyColumn:false,sortable:false};
      
      columns['controller']={label:this.$system_variables.get_label('controller'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,stickyColumn:false,sortable:false};
      columns['ordering']={label:this.$system_variables.get_label('ordering'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,stickyColumn:false,sortable:false};
      columns['date_created']={field_type:'date',label:this.$system_variables.get_label('date_created'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,stickyColumn:false,sortable:true};
      
      this.columns.display_columns=this.$system_functions.get_display_columns(columns); 
    },
    get_items:function()
    {
        if(this.reload_items)
        {
            this.$system_variables.status_data_loaded=0;        
            var form_data=new FormData();
            form_data.append ('token_auth', this.$system_variables.user.token_auth);                  
            this.$axios.post('/sys_module_task/get_items',form_data)
            .then(response=>{          
            this.$system_variables.status_data_loaded=1;
                if(response.data.errorType)        
                {   
                    this.$bvToast.toast(this.$system_variables.get_label(response.data.errorType), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});

                }
                else
                {                   
                    this.max_level=response.data.max_level;                    
                    this.set_filter_columns();
                    this.set_display_columns();
                    this.items=response.data.modules_tasks;                                        
                    this.reload_items=false;
                }       
            })
            .catch(error => {   
                this.$system_variables.status_data_loaded=1;
                this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
            });
        }
    },
    addEdit:function(id)
    {
      
      if(id==0)
      {
        if(!(this.permissions.action1))
        {
          this.$systemVariables.statusTaskLoaded=-2;
        }
        else
        {
          //this.item=this.defaultItem;
          Object.assign(this.item, this.defaultItem);  
        }        
      }
      else if(id>0)
      {
        if(!(this.permissions.action2))
        {
          
          this.$systemVariables.statusTaskLoaded=-2;
        }
        else
        {
          this.$systemVariables.statusDataLoaded=0;        
          var formData=new FormData();
          formData.append ('tokenAuth', this.$systemVariables.user.tokenAuth);      
          formData.append ('item_id', id);      
               
          this.$axios.post('/variety/get_item',formData)
          .then(response=>{          
          this.$systemVariables.statusDataLoaded=1;
            if(response.data.errorString)        
            {            
              if(response.data.errorString==this.$systemResponse.NoAccess)
              {
                
                this.$systemVariables.statusTaskLoaded=-2;
              }
              else
              {
                  this.$systemVariables.statusDataLoaded=1;
                  this.$bvToast.toast(response.data.errorString, {
                    title: 'Error',
                    autoHideDelay: 5000,
                    appendToast: false    
                  });
              }
              this.$router.push("/variety");
            }
            else
            {
              if(response.data.item)  
              {
                this.item=response.data.item; 
              }
              else
              {
                this.$bvToast.toast("variety Not found", {
                    title: 'Error',
                    autoHideDelay: 5000,
                    appendToast: false    
                  });
                  this.$router.push("/variety");
              }
              
            }        
          })
          .catch(error => {   
            this.$systemVariables.statusDataLoaded=1;
            this.$bvToast.toast('Server Error', {
              title: 'Data Load Problem',
              autoHideDelay: 5000,
              appendToast: false
            });  
            this.$router.push("/variety");
              //console.log(error);            
          });
        }
      }      
    },
    getItems:function()
    {
      if(this.reloadItems)
      {
        this.$systemVariables.statusDataLoaded=0;        
        var formData=new FormData();
        formData.append ('tokenAuth', this.$systemVariables.user.tokenAuth);      
        formData.append ('pagination[itemsPerPage]', this.pagination.itemsPerPage);      
        formData.append ('pagination[currentPage]', this.pagination.currentPage);      
        this.$axios.post('/variety/get_items',formData)
        .then(response=>{          
         this.$systemVariables.statusDataLoaded=1;
          if(response.data.errorString)        
          {            
            if(response.data.errorString==this.$systemResponse.NoAccess)
            {
              
              this.$systemVariables.statusTaskLoaded=-2;
            }
            else
            {    
              
              this.$systemVariables.statusTaskLoaded=-1;            
            }
          }
          else
          {  
            this.items=response.data.items; 
            this.pagination.numItems=response.data.numItems; 
            this.reloadItems=false;
          }        
        })
        .catch(error => {   
          this.$systemVariables.statusDataLoaded=1;
          this.$bvToast.toast('Server Error', {
          title: 'Data Load Problem',
          autoHideDelay: 5000,
          appendToast: false
        });  
            //console.log(error);            
        });
      }
    },
  }
}
</script>
