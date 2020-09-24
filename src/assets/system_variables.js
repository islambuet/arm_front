import Vue from 'vue'

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
      tasks:[]
    },
    visitors:{
      tasks:[]
    },
    status_task_loaded:0,    //Loading=0,success=1,failed=-1,acceesdenied=-2  for all page
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
      methods:{        
        get_label(key){        
          return this.labels[key]?this.labels[key]:key;
        },
        get_label_task(key){        
          return this.labels_task[key]?this.labels_task[key]:key;
        },
        set_user: function(data){
          // data == object {token_auth: 'value'}, ...
          for (var item in data){
              this.user[item] = data[item];
          }
        },
        logout: function(){
          localStorage.setItem('token_auth','');
          localStorage.setItem('token_csrf','');
          this.user=initial_data().user;
        }
      }
    }
  );
  Vue.prototype.$system_variables=system_variables