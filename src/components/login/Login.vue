<template>
    <div v-if="$system_variables.status_task_loaded == 1">
        <div class="container-fluid">
            <div class="row justify-content-center" v-if="$system_variables.status_data_loaded == 1">
                <div class="card-body p-4 col-md-8 col-lg-8">
                    <div style="min-height:80px">
                        <b-alert v-if="error_message != ''" :variant="error_msg_variant" show dismissible><a href="#">{{error_message}}</a></b-alert>
                    </div>
                    <div>
                        <p class="mt-2" v-html="this.form_title"></p>
                    </div>
                    <div class="mt-4">
                        <form id="form_login" class="system_ajax form-horizontal" @submit.prevent="login($event)" v-if="!otp_required">
                            <div class="form-group row">
                                <div class="col-12">
                                    <input class="form-control" type="text" name="user_name" placeholder="Enter User Name" />
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <input class="form-control" type="password" name="password" placeholder="Enter Password" />
                                    <div class="input-group-append" style="cursor: pointer;" @click="$system_htm_elements_action.click_handler_password_eye($event)">
                                        <span class="input-group-text"><i class="fe-eye"></i></span>
                                    </div>
                                </div>
                                <div class="form-group row text-right mt-2">
                                    <div class="col-12">
                                        <button class="btn btn-md btn-primary" type="submit">Sign In</button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <form id="form_otp" class="system_ajax form-horizontal" @submit.prevent="login_sms($event)">
                            <div class="form-group" v-if="otp_required">
                                <div v-show="error_message != ''">
                                    <p class="mt-2" v-html="error_message"></p>
                                </div>
                                <div class="input-group">
                                    <input type="hidden" name="token_sms" :value="token_sms"/>
                                    <input type="text" name="otp" class="form-control" placeholder="Enter OTP code" />
                                </div>
                                <div class="form-group row text-right mt-2">
                                    <div class="col-12">
                                        <button class="btn btn-md btn-danger" onClick="window.location.reload();">Cancel</button>
                                        <button class="btn btn-md btn-primary ml-2" type="submit">Send</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    components: { },
    mounted:function(){
        this.init();
    },
    data() {
        return {
            error_message_loading_fail: '',
            otp_required: false,
            token_sms: '',
            form_title: 'Fill out the form below to login.',
            error_message: '',
            error_msg_variant: 'danger',
        }
    },
    methods:{    
        init: function()
        { 
            this.reload_items=true;
            this.$system_variables.status_task_loaded=1;
            this.$system_variables.status_data_loaded=1;
        },         
        login: function(event)
        {
            this.$system_variables.status_data_loaded = 0;
            this.error_message_loading_fail = this.$system_variables.error_message_api_server;
            // Fetch from Local Storage
            var device_token = (localStorage.getItem("token_device") !== null)? localStorage.getItem("token_device") : '';

            var formData=new FormData(document.getElementById('form_login'));
            formData.append ('token_device', device_token);
            formData.append ('device[token_device]', device_token);
            formData.append ('device[device_info]', {});

            this.$axios.post('/login',formData)
            .then(response=>{
                if(response.data.error_type == 'USER_NAME_NOT_FOUND')
                {
                    console.log(response.data);
                    //this.error_message = this.$system_variables.get_label('USER_NAME_NOT_FOUND');
                }
                // else if(response.data.status_code == 100)
                // {
                //     this.error_message_loading_fail = response.data.message;
                //     this.$system_variables.labels.msgLoadingErrorHeader = response.data.message;
                //     this.$system_variables.labels.msgLoadingErrorSubHeader = response.data.message_warning;
                //     this.$system_variables.labels.msgLoadingErrorInfo = '';
                // }
                // else if(response.data.status_code == 1101){
                //     this.token_sms = response.data.token_sms;
                //     this.formTitle = response.data.message_warning;
                //     //this.$parent.set_user_data(response.data.user);
                //     this.otp_required = true;
                // }
                // else
                // {                    
                //     this.$parent.set_user_data(response.data.user.user);                    
                //     // Device Token
                //     localStorage.setItem('token_device', response.data.user.device.token_device);
                //     this.$router.push({name:'Home'}).catch(()=>{}); 
                // }
                this.$system_variables.status_data_loaded = 1;
            })
            .catch(error => {
                console.log("AJAX Error: " + error);
                this.$system_variables.status_data_loaded = 1;
            })
        },
        login_sms: function(event)
        {
            this.$system_variables.status_data_loaded = 0;
            this.error_message_loading_fail = this.$system_variables.error_message_api_server;
            
            var device_token = ''; // Device Token Not Available while sending OTP code

            var formData=new FormData(document.getElementById('form_otp'));
            formData.append ('token_device', device_token);
            formData.append ('device[token_device]', device_token);

            this.$axios.post('/login_sms',formData)
            .then(response=>{
                if(response.data.status_code == 110)
                {
                    this.error_message_loading_fail = response.data.message;
                    this.error_message = '<b style="color:#ff0000">OTP Expired or, already used!</b>';
                }
                else if(response.data.status_code == 300) // OTP code not Found
                {
                    this.error_message_loading_fail = response.data.message;
                    this.error_message = '<b style="color:#ff0000">OTP Code Not Found!</b>';
                }
                else if(response.data.status_code == 301)
                {
                    this.error_message_loading_fail = response.data.message;
                    this.error_message = '<b style="color:#ff0000">Incorrect OTP Code!</b>';
                }
                else if(response.data.status_code == 302)
                {
                    this.error_message_loading_fail = response.data.message;
                    this.error_message = '<b style="color:#ff0000">Maximum OTP Retry Exceeded!</b>';
                }
                else
                {
                    this.$parent.set_user_data(response.data.user.user);
                    localStorage.setItem('token_device', response.data.user.device.token_device)
                    this.$router.push({name:'Home'}).catch(()=>{}); 
                }
                this.$system_variables.status_data_loaded = 1;
            })
            .catch(error => {
                console.log(error);
                this.$system_variables.status_data_loaded = 1;
            })
        },
    }
}
</script>