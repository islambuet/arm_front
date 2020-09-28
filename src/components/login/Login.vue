<template>
    <div>
        <div v-if="$system_variables.status_task_loaded == 1" v-show="$system_variables.status_data_loaded == 1">
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="card-body p-4 col-md-8 col-lg-8">
                        <div style="min-height:80px">
                            <b-alert v-if="alert_message != ''" :variant="alert_variant" show dismissible>
                                <div v-html="alert_message"></div>
                            </b-alert>
                        </div>
                        <div class="mt-4">
                            <form id="form_login" class="system_ajax form-horizontal" @submit.prevent="login($event)" v-if="!otp_required">
                                <div>
                                    <p class="mt-2" v-html="this.$system_variables.get_label_task('label_login_form_title')"></p>
                                </div>
                                <div class="form-group row">
                                    <div class="col-12">
                                        <input required class="form-control" type="text" name="mobile_no" :placeholder="this.$system_variables.get_label_task('label_login_form_placeholder_mobile_no')">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <input required class="form-control" type="password" name="password" :placeholder="this.$system_variables.get_label_task('label_login_form_placeholder_password')" />
                                        <div class="input-group-append" style="cursor: pointer;" @click="$system_htm_elements_action.click_handler_password_eye($event)">
                                            <span class="input-group-text"><i class="fe-eye"></i></span>
                                        </div>
                                    </div>
                                    <div class="form-group row text-right mt-2">
                                        <div class="col-12">
                                            <button class="btn btn-md btn-primary" type="submit">{{ this.$system_variables.get_label('button_signin') }}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <form id="form_otp" class="system_ajax form-horizontal" @submit.prevent="login_sms($event)" v-if="otp_required">                                
                                <div>
                                    <p class="mt-2" v-html="this.$system_variables.get_label_task('label_otp_form_title')"></p>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <input type="hidden" name="token_sms" :value="token_sms"/>
                                        <input type="text" name="otp" class="form-control" :placeholder="this.$system_variables.get_label_task('label_otp_form_placeholder_otp')" />
                                    </div>
                                    <div class="form-group row text-right mt-2">
                                        <div class="col-12">
                                            <button class="btn btn-md btn-danger" @click="otp_required = false; alert_message = ''">{{ this.$system_variables.get_label('button_cancel') }}</button>
                                            <button class="btn btn-md btn-primary ml-2" type="submit">{{ this.$system_variables.get_label('button_send') }}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
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
    mounted: function()
    {
        //Check If A User is Logged-In or Not. 
        var token_auth = localStorage.getItem('token_auth') ? localStorage.getItem('token_auth') : '';
        //var token_auth = '8dN6ifLBqA53eGPQtfZHDxAJPD+URVoxUuSU6W5V0lY=';

        if(token_auth != '') {
            var form_data=new FormData();
            form_data.append ('token_auth', token_auth);

            this.$axios.post('/users/get_user', form_data)
            .then(response=>{
                if(response.data.error_type == '')
                {
                    this.$router.push("/");
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                this.$bvToast.toast(error, 
                    {
                    title: 'Response Error',
                    variant:'danger',
                    autoHideDelay: 5000,
                    appendToast: false
                    }
                );
            })
        }

        this.$system_variables.labels_task = this.$system_functions.load_languages([
            {language:this.$system_variables.language,file:'components/login/language.js'},
        ]);
        this.init();
    },
    data() {
        return {
            otp_required: false,
            token_sms: '',
            alert_message: '',
            alert_variant: 'danger'
        }
    },
    methods:{    
        init: function()
        { 
            this.$system_variables.status_task_loaded=1;
            this.$system_variables.status_data_loaded=1;
        },         
        login: function(event)
        {
            this.alert_message = '';
            this.$system_variables.status_data_loaded = 0;

            var form_data=new FormData(document.getElementById('form_login'));
            form_data.append ('token_device', this.$system_variables.user.token_device);

            this.$axios.post('/login',form_data)
            .then(response=>{
                if(response.data.error_type == 'USER_NOT_FOUND')
                {
                    this.alert_message = this.$system_variables.get_label('USER_NOT_FOUND');
                    this.alert_variant = 'danger';
                }
                else if(response.data.error_type == 'PASSWORD_INCORRECT')
                {
                    this.alert_message = this.$system_variables.get_label('PASSWORD_INCORRECT') + 
                                            '<br/>Your account will be suspended, if you enter wrong password '+ (response.data.remaining+1) +' more time(s).';
                    this.alert_variant = 'danger';
                }
                else if(response.data.error_type == 'USER_SUSPEND_PASSWORD_TRY_LIMIT_EXCEEDED')
                {
                    this.alert_message = this.$system_variables.get_label('USER_SUSPEND_PASSWORD_TRY_LIMIT_EXCEEDED');
                    this.alert_variant = 'danger';
                }
                else if(response.data.error_type == 'OTP_VERIFICATION_REQUIRED')
                {
                    this.token_sms = response.data.token_sms;
                    this.alert_message = this.$system_variables.get_label('OTP_VERIFICATION_REQUIRED');
                    this.alert_variant = 'warning';
                    this.otp_required = true;
                }
                else if(response.data.error_type == 'OTP_WAIT')
                {
                    this.alert_message = this.$system_variables.get_label('OTP_WAIT');
                    this.alert_variant = 'warning';
                    this.otp_required = true;
                }
                else
                {
                    localStorage.setItem('token_auth', response.data.user.token_auth);
                    localStorage.setItem('token_csrf', response.data.user.token_csrf);
                    localStorage.setItem('token_device', response.data.user.token_device);
                    this.$system_variables.set_user(response.data.user);
                    this.$router.push("/");
                }
                this.$system_variables.status_data_loaded = 1;
            })
            .catch(error => {
                console.log(error);
                this.alert_message = this.$system_variables.get_msg_response_error();
                this.alert_variant = 'danger';
                this.$system_variables.status_data_loaded = 1;
            })
        },
        login_sms: function(event)
        {
            this.alert_message = '';
            this.$system_variables.status_data_loaded = 0;

            var form_data=new FormData(document.getElementById('form_otp'));
            form_data.append ('token_device', this.$system_variables.user.token_device);

            this.$axios.post('/Login/login_sms',form_data)
            .then(response=>{                
                if(response.data.error_type == '')
                {
                    localStorage.setItem('token_auth', response.data.user.token_auth);
                    localStorage.setItem('token_csrf', response.data.user.token_csrf);
                    localStorage.setItem('token_device', response.data.user.token_device);
                    this.$system_variables.set_user(response.data.user);
                    this.$router.push("/");
                }
                else if(response.data.error_type == 'OTP_INCORRECT')
                {
                    this.alert_message = this.$system_variables.get_label('OTP_INCORRECT');
                    this.alert_variant = 'danger';
                }
                else if(response.data.error_type == 'OTP_EXPIRED')
                {
                    this.alert_message = this.$system_variables.get_label('OTP_EXPIRED');
                    this.alert_variant = 'danger';
                }
                else if(response.data.error_type == 'OTP_ALREADY_USED')
                {
                    this.alert_message = this.$system_variables.get_label('OTP_ALREADY_USED');
                    this.alert_variant = 'danger';
                }
                else if(response.data.error_type == 'OTP_NOT_LAST')
                {
                    this.alert_message = this.$system_variables.get_label('OTP_NOT_LAST');
                    this.alert_variant = 'danger';
                }
                else
                {
                    this.alert_message = response.data.error_type;
                    this.alert_variant = 'danger';
                }
                this.$system_variables.status_data_loaded = 1;
            })
            .catch(error => {
                console.log(error);
                this.alert_message = this.$system_functions.get_msg_response_error();
                this.alert_variant = 'danger';
                this.$system_variables.status_data_loaded = 1;
            })
        },
    }
}
</script>