<template>
    <div>
        <div v-if="$system_variables.status_task_loaded==1">
            <List v-show="method=='list'"/>    
            <AddEdit v-show="method=='add' || method=='edit'"/>    
        </div>
    </div>
</template>
<script>
import List from './List.vue'
import AddEdit from './AddEdit.vue'
export default {
    name: 'TransferProduct',
    components: { List,AddEdit },
    mounted () { 
        this.init()
    },
    data () {
        return{
            method:'list',
            permissions:{},
            items:[],
            reload_items:true,
            crops:[],
            crop_types:{},
            typeVarieties:{},
            columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]}, 
            pagination:{current_page:1,items_per_page:50,num_item_showing:0,num_items:10,page_options: [10,20, 50, 100, 500]},
            item:{id:0,crop_id:"",type_id:"",variety_id:""},        
            default_item:{id:0,crop_id:"",type_id:"",variety_id:""},                
        }
    }, 
    watch: {
        $route(to, from) {
            this.routing(to);      
        }
    },
    methods:{
        routing:function(route){
            if(route.path=='/transfer'){
                this.method='list';
                this.get_items();
            } else if (route.path=='/transfer/add') {
                this.method='add';
                this.add_edit(0);
            } else if(route.path.indexOf("/transfer/edit/")!=-1) {
                this.method='edit';        
                this.add_edit(route.params['row_id']);        
            }
        },
        init:function(){
            this.reload_items=true;
            this.$system_variables.status_task_loaded=0;    
            this.$system_variables.status_data_loaded=1;
            var form_data=new FormData();
            form_data.append ('token_auth', this.$system_variables.user.token_auth); 
            this.$axios.post('/transfer_initialize',form_data)
            .then(response=>{
                //this.$system_variables.status_data_loaded=0;
                if(response.data.errorString){
                    if(response.data.error_string==this.$system_response.NO_ACCESS){
                        this.$system_variables.status_task_loaded=-2;
                    } else {
                        this.$system_variables.status_task_loaded=-1;
                    }
                } else {
                    this.permissions=response.data.permissions; 
                    this.crops=response.data.crops;     
                    this.crop_types=response.data.crop_types;
                    this.type_varieties=response.data.type_varieties;
                    //this.items=response.data.items; 
                    this.default_item=response.data.default_item; 
                    if(response.data.hidden_columns){
                        this.columns.hidden_columns=response.data.hidden_columns;
                    }  
                    this.set_control_columns();
                    this.set_filter_columns();          
                    this.set_display_columns(); 
                    // this.$system_variables.statusTaskLoaded=1;
                    // this.methodSwithing(this.$route);
                    this.$system_variables.status_task_loaded=1; 
                    this.routing(this.$route);
                }
            })
            .catch(error => {     
                console.log(error);
                this.$system_variables.status_task_loaded=-1; 
            });      
        },
        set_control_columns:function() {
            var control_columns=[]
            control_columns.push({ label: this.$system_variables.get_label('id'), value: 'id',selected: this.columns.hidden_columns.indexOf('id')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('date_request'), value: 'date_request',selected: this.columns.hidden_columns.indexOf('date_request')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('quantity_total_request'), value: 'quantity_total_request',selected: this.columns.hidden_columns.indexOf('quantity_total_request')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('remarks_request'), value: 'remarks_request',selected: this.columns.hidden_columns.indexOf('remarks_request')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('division_name'), value: 'division_name',selected: this.columns.hidden_columns.indexOf('division_name')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('zone_name'), value: 'zone_name',selected: this.columns.hidden_columns.indexOf('zone_name')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('territory_name'), value: 'territory_name',selected: this.columns.hidden_columns.indexOf('territory_name')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('district_name'), value: 'district_name',selected: this.columns.hidden_columns.indexOf('district_name')>=0?'id':''});
            control_columns.push({ label: this.$system_variables.get_label('outlet_name'), value: 'outlet_name',selected: this.columns.hidden_columns.indexOf('outlet_name')>=0?'id':''});
            //control_columns.push({ label: this.$system_variables.labels.cropName, value: 'crop_name',selected: this.columns.hidden_columns.indexOf('crop_name')>=0?'crop_name':''});
            // control_columns.push({ label: this.$system_variables.get_label('type_name'), value: 'type_name',selected: this.columns.hidden_columns.indexOf('type_name')>=0?'type_name':''});
            // control_columns.push({ label: this.$system_variables.get_label('variety_name').variety_name, value: 'name',selected: this.columns.hidden_columns.indexOf('name')>=0?'name':''});
            // control_columns.push({ label: this.$system_variables.get_label('date_created'), value: 'date_created',selected: this.columns.hidden_columns.indexOf('date_created')>=0?'date_created':''});
            //control_columns.push({ label: this.$system_variables.getLabel('LabelAction'), value: 'actions',selected: this.columns.hidden_columns.indexOf('actions')>=0?'actions':''});
            this.columns.control_columns=control_columns;      
        },
        set_filter_columns:function() {
            //filtertype feild also not used
            var filter_columns={};
            filter_columns['id']={filter_type:'number',filter_from:{value:"", default_value:""},filter_to:{value:"", default_value:""}};
            filter_columns['date_request']={filter_type:'date',filter_start:{value:"", default_value:""},filter_end:{value:"", default_value:""}};
            filter_columns['quantity_total_request']={filter_type:'number',filter_from:{value:"", default_value:""},filter_to:{value:"", default_value:""}};
            // filter_columns['quantity_total_request']={value:"", default_value:""};
            filter_columns['remarks_request']={value:"", default_value:""};
            filter_columns['outlet_name']={value:"", default_value:""};
            filter_columns['district_name']={value:"", default_value:""};
            filter_columns['zone_name']={value:"", default_value:""};
            filter_columns['division_name']={value:"", default_value:""};

            // filter_columns['id']={filter_type:'number',filter_from:{value:"", default_value:""},filter_to:{value:"", default_value:""}};
            // filter_columns['crop_id']={filter_type:'list', options:this.crops, child:{ field:'crop_type_id', options:this.crop_types, reset_fields:['crop_type_id'] },value:"", default_value:""};
            // filter_columns['crop_type_id']={filter_type:'list', options:[],value:"", default_value:""};      
            // filter_columns['name']={value:"", default_value:""};
            // filter_columns['date_created']={filter_type:'date',filter_start:{value:'', default_value:""},filter_end:{value:'', default_value:""}};
            this.columns.filter_columns=filter_columns;
        },
        set_display_columns:function() {
            var columns={};
            columns['id']={label:this.$system_variables.get_label('id'), hidden:this.columns.hidden_columns.indexOf('id')>=0?true:false,sticky_column:true,sortable:true,};
            columns['date_request']={label:this.$system_variables.get_label('date_request'), hidden:this.columns.hidden_columns.indexOf('date_request')>=0?true:false,sortable:true,};
            columns['quantity_total_request']={label:this.$system_variables.get_label('quantity_total_request'), hidden:this.columns.hidden_columns.indexOf('quantity_total_request')>=0?true:false,sortable:true,};
            columns['remarks_request']={label:this.$system_variables.get_label('remarks_request'), hidden:this.columns.hidden_columns.indexOf('remarks_request')>=0?true:false,sortable:true,};
            columns['division_name']={label:this.$system_variables.get_label('.division_name'), hidden:this.columns.hidden_columns.indexOf('division_name')>=0?true:false,sortable:true};
            columns['zone_name']={label:this.$system_variables.get_label('.zone_name'), hidden:this.columns.hidden_columns.indexOf('zone_name')>=0?true:false,sortable:true};
            columns['territory_name']={label:this.$system_variables.get_label('.territory_name'), hidden:this.columns.hidden_columns.indexOf('territory_name')>=0?true:false,sortable:true};
            columns['outlet_name']={label:this.$system_variables.get_label('outlet_name'), hidden:this.columns.hidden_columns.indexOf('outlet_name')>=0?true:false,sortable:true,};
            columns['district_name']={label:this.$system_variables.get_label('.district_name'), hidden:this.columns.hidden_columns.indexOf('district_name')>=0?true:false,sortable:true};
            columns['actions']={label:this.$system_variables.get_label('label_action'), hidden:this.columns.hidden_columns.indexOf('actions')>=0?true:false};
            var display_columns=[];
            for(var field in columns) { 
                var column=columns[field];
                if(!column['hidden']) { 
                    var display_column = {};
                    display_column['key']=field;
                    display_column['label']=column['label'];
                    if(column['sticky_column']) {
                        display_column['sticky_column']=column['sticky_column'];
                    }
                    if(column['field_type']=='date') {
                        var thisObj=this;
                        display_column['field_type']='date';
                        display_column['formatter']=function(value, key, item){ return thisObj.$system_functions.display_date(value)};
                    }
                    if(column['sortable']) {
                        display_column['sortable']=column['sortable'];             
                    }   
                    display_columns.push(display_column);      
                }
            }  
            this.columns.display_columns=display_columns; 
        },
        add_edit:function(id) {
            if(id==0) {
                if(!(this.permissions.action1)) {
                    this.$system_variables.statusTaskLoaded=-2;
                } else {
                    //this.item=this.defaultItem;
                    Object.assign(this.item, this.defaultItem);  
                }        
            } else if(id>0) {
                if(!(this.permissions.action2)) {
                    this.$system_variables.statusTaskLoaded=-2;
                } else {
                    this.$system_variables.statusDataLoaded=0;        
                    var formData=new FormData();
                    formData.append ('tokenAuth', this.$system_variables.user.tokenAuth);      
                    formData.append ('item_id', id);      
                    this.$axios.post('/variety/get_item',formData)
                    .then(response=>{          
                        this.$system_variables.statusDataLoaded=1;
                        if(response.data.errorString)  {            
                            if(response.data.errorString==this.$systemResponse.NoAccess) {
                                this.$system_variables.statusTaskLoaded=-2;
                            } else {
                                this.$system_variables.statusDataLoaded=1;
                                this.$bvToast.toast(response.data.errorString, {
                                    title: 'Error',
                                    autoHideDelay: 5000,
                                    appendToast: false    
                                });
                            }
                            this.$router.push("/transfer");
                        } else {
                            if(response.data.item) {
                                this.item=response.data.item; 
                            } else {
                                this.$bvToast.toast("variety Not found", {
                                    title: 'Error',
                                    autoHideDelay: 5000,
                                    appendToast: false    
                                });
                                this.$router.push("/transfer");
                            }
                        }        
                    })
                    .catch(error => {   
                        this.$system_variables.statusDataLoaded=1;
                        this.$bvToast.toast('Server Error', {
                        title: 'Data Load Problem',
                        autoHideDelay: 5000,
                        appendToast: false
                        });  
                        this.$router.push("/transfer");
                        //console.log(error);            
                    });
                }
            }      
        },
        get_items:function(){
            // console.log('get_items_function')
            if(this.reload_items){
                this.$system_variables.status_data_loaded=0;
                var form_data=new FormData();
                form_data.append ('token_auth', this.$system_variables.user.token_auth); 
                form_data.append ('pagination[items_per_page]', this.pagination.items_per_page);      
                form_data.append ('pagination[current_page]', this.pagination.current_page);   
                this.$axios.post('/transfer_get_items',form_data)
                .then(response=>{
                    this.$system_variables.status_data_loaded=1;
                    if(response.data.errorString){
                        if(response.data.error_string==this.$system_response.NoAccess){
                            this.$system_variables.status_task_loaded=-2;
                        } else {
                            this.$system_variables.status_task_loaded=-1;
                        }
                    } else {
                        this.items=response.data.items; 
                        this.pagination.num_items=response.data.num_items; 
                        this.reload_items=false;
                    }
                })
                .catch(error => {     
                    console.log(error);
                    this.$system_variables.status_task_loaded=-1; 
                });
            }
        }
    }
}
</script>