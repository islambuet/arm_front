<template>
    <div>
        <form :id="'form_column_control'">
            <input type="hidden" name="controller" :value="controller">
            <input type="hidden" name="method" :value="method">
            <b-form-checkbox v-for="(item, index) in control_columns" :key="index"
                v-model="item.selected"
                :name="'hidden_columns[]'"
                :value="item.value"
                @change="toggle_control_columns($event,item)"
                inline
              >
                {{item.label}}
              </b-form-checkbox>
              <div class="text-center" v-if="allow_save">
                <b-button class="mr-2" variant="success" @click="save_hidden_columns" >{{$system_variables.get_label('button_save_column_controls')}}</b-button>
              </div>
        </form>
    </div>
</template>

<script>
export default { 
    name: "ColumnControl",
    data(){
        return {
            checked:true,
        }
    },
    props: {
        allow_save:{
            type: Boolean,
            default:true
        },
        controller: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        control_columns: {
            type: Array,
            required: true
        },
        hidden_columns: {
            type: Array,
            required: true
        },
        on_change_control: {
            type: Function,
            default: ()=> (console.log('default on change called'))            
        },
    }, 
    methods:{
        toggle_control_columns:function (event,item)
        {
            setTimeout(() => {
                if(!item.selected)
                {   
                    this.hidden_columns.splice(this.hidden_columns.indexOf(item.value), 1);
                }
                else
                {
                    this.hidden_columns.push(item.value);
                }
                this.on_change_control();            
            }, 0);
        },
        save_hidden_columns:function()
        {
            this.$system_variables.status_data_loaded=0; 
            var form_data=new FormData(document.getElementById('form_column_control'));       
            form_data.append ('token_auth', localStorage.getItem('token_auth')); 
            form_data.append ('token_csrf', localStorage.getItem('token_csrf'));
            this.$axios.post('/column_control/save',form_data)
            .then(response=>{          
                // console.log(response.data)
                this.$system_variables.status_data_loaded=1;
                this.$system_variables.set_csrf(response);
                if(response.data.error_type)        
                {            
                    // this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
                    this.$system_functions.response_error_task(response);
                }
                else
                {
                    this.$bvToast.toast(this.$system_variables.get_label("Saved SuccessFully"), {title: this.$system_variables.get_label('label_Success'),variant:'Success',autoHideDelay: 5000,appendToast: false});              
                }                 
            })
            .catch(error => {   
                // this.$system_variables.status_data_loaded=1;
                // this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
                this.$system_variables.status_data_loaded=1;
                this.$bvToast.toast( this.$system_variables.get_label('msg_contact_with_admin'),
                {
                title: this.$system_variables.get_label('msg_response_error_title'),
                variant:'danger',
                autoHideDelay: 5000,
                appendToast: false
                }); 
            });
        }
    }

};
</script>
