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
import AddEdit from './AddEdit.vue'
export default {
    name: 'SysModuleTask',
    components: {
        List//,AddEdit   
    },
    mounted:function()
    {
       this.$system_variables.labels_task=this.$system_functions.load_languages([
        {language:this.$system_variables.language,file:'components/sys_user_group/language.js'}
        
      ]); 
      //Object.assign(this.item, this.default_item); 
      this.init();        
    },
    data() {
      return {
        method:'list',        
        permissions:{},
        columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]},
        items:[],
        types:[],
        item:{},        
        default_item:{id:0,name:"",ordering:99,status:'Active'},
        //pagination:{current_page:1,items_per_page:50,num_itemshowing:0,num_items:10,page_options: [10,20, 50, 100, 500]},
        pagination:{current_page:1,items_per_page:5,num_item_showing:0,num_items:0},
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
      if(route.path=='/sys_user_group')
      {
        this.method='list';
        this.get_items();
      }
      else if(route.path=="/sys_module_task/add")
      {
        this.method='add';
        this.add_edit(0);
      }
      else if(route.path.indexOf("/sys_module_task/edit/")!=-1)
      {
        this.method='edit';        
        this.add_edit(route.params['item_id']);        
      }
    },
    init:function()
    { 
        this.$system_variables.status_task_loaded=0;  
        this.$system_variables.status_data_loaded=1;  
        this.reload_items=true;
        var form_data=new FormData();
        form_data.append ('token_auth', this.$system_variables.user.token_auth);      
        this.$axios.post('/sys_user_group/initialize',form_data)
        .then(response=>{
            if(response.data.error_type)        
            {            
                this.$system_variables.status_task_loaded=0;
                this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});

            }
            else
            {
                this.permissions=response.data.permissions;                 
                Object.assign(this.default_item, response.data.default_item); 
                if(response.data.hidden_columns)  
                {
                  this.columns.hidden_columns=response.data.hidden_columns;
                }               
                this.$system_variables.status_task_loaded=1;
                this.set_control_columns();
                this.set_filter_columns();
                this.set_display_columns();  
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
      //value field mandatory for checked value
      var control_columns=[]
      control_columns.push({ label:this.$system_variables.get_label('label_id'), value: 'id',selected: this.columns.hidden_columns.indexOf('id')>=0?'id':''});
      control_columns.push({ label:this.$system_variables.get_label('label_ordering'), value: 'ordering',selected: this.columns.hidden_columns.indexOf('ordering')>=0?'ordering':''});
      control_columns.push({ label:this.$system_variables.get_label('label_status'), value: 'status',selected: this.columns.hidden_columns.indexOf('status')>=0?'status':''});

      this.columns.control_columns=control_columns;      
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
      columns['actions']={label:this.$system_variables.get_label('Label_action'), hidden:this.columns.false,sticky_column:true};
      columns['id']={label:this.$system_variables.get_label('label_id'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,sticky_column:false,sortable:false};
      columns['name']={label:this.$system_variables.get_label('label_name'), hidden:this.columns.hidden_columns.indexOf('name')>=0?true:false,sticky_column:false,sortable:false};
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
          this.$axios.post('/sys_module_task/get_item',form_data)
          .then(response=>{          
            this.$system_variables.status_data_loaded=1;
            if(response.data.error_type)        
            {            
              this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
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
                this.$bvToast.toast(this.$system_variables.get_label('Data Not Found'), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
                this.$router.push("/variety");
              }
            }        
          })
          .catch(error => {   
            this.$system_variables.status_data_loaded=1;
            this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});  
            this.$router.push("/variety");            
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
