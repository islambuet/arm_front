<template>
  <div>
      <List v-show="method=='list'"/>          
      <!-- <AddEdit v-show="method=='add' || method=='edit'"/>      -->
  </div>
</template>

<script>
import List from './List.vue'

export default {
    name: 'Region', 
    components: {
        List
    },   
    mounted:function()
    {
      this.permissions=this.$parent.permissions['Area'];
      console.log('area init called');
      
    },
    data() {
      return {
          method:"",
          permissions:{},
          columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]},
          items:[],
          pagination:{current_page:1,items_per_page:5,num_item_showing:0,num_items:0},
          reload_items:true,
      }
    },
    
    methods:{
      init:function()
      {
        this.method='list';
        this.reload_items=true;
        //call ajax if needed for hidden columns

        //call inside ajax response 
        this.set_control_columns();
        this.set_filter_columns();
        this.set_display_columns();  
        this.get_items();
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
        columns['actions']={label:this.$system_variables.get_label('label_action'), hidden:this.columns.false,sticky_column:false};//cannot set it sticky becuase dropdown will goes bellow
        columns['id']={label:this.$system_variables.get_label('label_id'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,sticky_column:true,sortable:false};
        columns['name']={label:this.$system_variables.get_label('label_name'), hidden:this.columns.hidden_columns.indexOf('name')>=0?true:false,sticky_column:false,sortable:false};
        //columns['num_tasks']={label:this.$system_variables.get_label('label_num_tasks'), hidden:this.columns.hidden_columns.indexOf('num_tasks')>=0?true:false,sticky_column:false,sortable:false};
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
            this.$axios.post('/setup_locations/get_items_region',form_data)
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
      this.method='add';
    }, 
  }
}
</script>
