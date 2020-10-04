import Vue from 'vue'
import router from '@/router'

function initial_data()
{
  var language=localStorage.getItem('language')? localStorage.getItem('language'):'en';
  return {
    language:language,
    user:{
      token_auth:localStorage.getItem('token_auth')? localStorage.getItem('token_auth'):'',
      token_csrf:localStorage.getItem('token_csrf')? localStorage.getItem('token_csrf'):'',
      token_device:localStorage.getItem('token_device')? localStorage.getItem('token_device'):'',
      id: 0,
      name:language=='en'?'Guest':'অতিথি',
      info:{},
      actions:{},
      tasks:[]
    },
    visitors:{
      tasks:[]
    },
    status_task_loaded:0,    //Loading=0,success=1,failed=-1,acceesdenied=-2, site_off_line = -3  for all page
    status_data_loaded:0,    //Loading=0,loaed=1
    labels:{},
    labels_task:{},

    system_crops:[],
    system_crop_types:{},
    system_type_varieties:{},
    system_divisions:[],
    system_division_zones:{},
    system_zone_territories:{},
    system_warehouses:[]
  }
}
//const initialData = () => ({})

var system_variables= new Vue(
    {    
      data:function(){  
        var tempdata=initial_data();
        return tempdata;
      },
      mounted: function(){
        console.log(this.labels_task);
      },
      methods:{
        get_label(key){
          return this.labels[key]?this.labels[key]:key;
        },
        get_label_task(key){
          return this.labels_task[key]?this.labels_task[key]:key;
        },
        set_user: function(data){
          // data == object {token_auth: 'value'}, ...
          for (var item_key in data){
              this.user[item_key] = data[item_key];
          }
        },       
        set_csrf: function(response){
          this.set_user({token_csrf: response.data.token_csrf});
          localStorage.setItem('token_csrf', response.data.token_csrf)
        }, 
        get_msg_response_error: function()
        {
          return '<h4 class="alert-heading">'+this.get_label('msg_response_error_title')+'</h4>'+'<hr>'+
                  '<p>'+this.get_label('msg_response_error_body')+'</p>'+
                  '<p>'+this.get_label('msg_contact_with_admin')+'</p>';                    
        },
        logout: function(){
          localStorage.setItem('token_auth','');
          localStorage.setItem('token_csrf','');
          this.user=initial_data().user;
          if(router.path != '/login')
          {
            router.push("/login");
            return;
          }
        }
      }
    }
  );
  Vue.prototype.$system_variables=system_variables