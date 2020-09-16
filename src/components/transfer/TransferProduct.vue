<template>
    <div>
        <div v-if="$system_variables.status_task_loaded==1">
            <List v-show="method=='list'"/>    
        </div>
    </div>
</template>
<script>
import List from './List.vue'
export default {
    name: 'TransferProduct',
    components: { List },
    mounted () { 
        this.init()
    },
    data () {
        return{
            method:'list',
            permissions:{},
            items:[],
            reload_items:true,
            columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]}, 
            pagination:{current_page:1,items_per_page:50,num_item_showing:0,num_items:10,page_options: [10,20, 50, 100, 500]},
            item:{id:0},        
            default_item:{id:0},                
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
                this.getItems();
            } else if (route.path=='/transfer/add') {
                this.method='add';
                this.addEdit(0);
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
                if(response.data.errorString){
                    if(response.data.error_string==this.$system_response.NoAccess){
                        this.$system_variables.status_task_loaded=-2;
                    } else {
                        this.$system_variables.status_task_loaded=-1;
                    }
                } else {
                    this.permissions=response.data.permissions; 
                    this.crops=response.data.crops;     
                    this.crop_types=response.data.crop_types;
                    this.default_item=response.data.default_item; 
                    this.$system_variables.status_task_loaded=1; 
                    this.routing(this.$route);
                }
            })
            .catch(error => {     
                console.log(error);
                this.$system_variables.status_task_loaded=-1; 
            });      
        },
        getItems:function(){
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