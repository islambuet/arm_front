import Vue from 'vue'
var system_functions= new Vue(
{    
    methods:{
        //language file
        load_languages:function(languageFiles)        
        {          
          var labels={};
          try{
            for (var i = 0; i < languageFiles.length; i++) 
            {
                var language=languageFiles[i].language;                
                var filedata = require(`@/${languageFiles[i].file}`);               
                for(var item in filedata.labels)
                {
                    labels[item]=filedata.labels[item][language]?filedata.labels[item][language]:item;
                
                }
            }          
          }
          catch(error){
            console.log('error');
          }
          return labels;
        },
        //display seconds to string
        display_date:function(time)
        {
            if(parseInt(time) !=NaN)
            {
                var date=new Date(time * 1000);
                var day=date.getDate();
                if(day<10)
                {
                    day='0'+day;
                }
                return day+'-'+date.toLocaleString('default', { month: 'short' })+'-'+date.getFullYear();
                //return date.toDateString().substr(0,19);
            }
            else
            {
                return '';
            }            
        },
        //column preferene
        save_preference:function(event,formId,bvToast) 
        {
            // this.$systemVariables.statusSaving=1;        
            // var formData=new FormData(document.getElementById(formId));
            // formData.append ('tokenAuth', this.$systemVariables.user.tokenAuth);      
                
                    
            // this.$axios.post('/variety/save_preferences',formData)
            // .then(response=>{          
            //     this.$systemVariables.statusSaving=0;
            //     if(response.data.errorString)        
            //     {            
            //         if(response.data.errorString==this.$systemResponse.NoAccess)
            //         { 
            //             this.$systemVariables.statusTaskLoaded=-2;
            //         }
            //         else
            //         {
            //             this.$systemVariables.statusDataLoaded=1;
            //             bvToast.toast(response.data.errorString, {
            //                 title: 'Error',
            //                 autoHideDelay: 5000,
            //                 appendToast: false    
            //             });
            //         }          
            //     }
            //     else
            //     {   
            //         bvToast.toast("Preference saved Succesfully", {
            //             title: 'Success',
            //             autoHideDelay: 5000,
            //             appendToast: false    
            //         });
            //     }        
            // })
            // .catch(error => {   
            //     this.$systemVariables.statusSaving=0;
            //     bvToast.toast('Server Error', {
            //     title: 'Save Problem',
            //     autoHideDelay: 5000,
            //     appendToast: false
            //     });     
            //     console.log("here");
            // });
        },
        //filter section
        on_change_filter_option:function(event,columns, field) 
        {
            if(columns[field]['child'])
            {
                //resttings childs
                for (var i=0; i < columns[field]['child']['resetFields'].length; i++)
                {
                    var resetField = columns[field]['child']['resetFields'][i];                    
                    columns[resetField].options = [];
                    columns[resetField].value = columns[resetField].defaultValue;
                }
                //setting childs options
                columns[columns[field]['child']['field']]['options']=columns[field]['child']['options'][columns[field]['value']];
            }
        },
        //b-table filtering
        get_filter_items:function (items,filter_columns)
        {   
            return items.filter((item)=>{            
                for(var field in filter_columns)
                {
                    var filterColumn=filter_columns[field];
                    if(filterColumn['filter_type']=='list')
                    {
                        if(filterColumn['value']!='')
                        {                     
                            if(item[field]!=filterColumn['value'])
                            {                         
                                return false;
                            }                    
                        }
                    }
                    else if(filterColumn['filter_type']=='number')
                    {   
                        if(filterColumn['filter_from']['value'].length>0)
                        {
                            if(parseFloat(item[field])<parseFloat(filterColumn['filter_from']['value']))
                            {                        
                                return false;
                            }
                        }
                        if(filterColumn['filter_to']['value'].length>0)
                        {
                            if(parseFloat(item[field])>parseFloat(filterColumn['filter_to']['value']))
                            {                        
                                return false;
                            }
                        }
                    }
                    else if(filterColumn['filter_type']=='date')
                    {
                        if(filterColumn['filter_start']['value'].length>0)
                        {                            
                            var starttime=new Date(filterColumn['filter_start']['value']).getTime() / 1000;
                            if(parseFloat(item[field])<starttime)
                            {                        
                                return false;
                            }
                        }
                        if(filterColumn['filter_end']['value'].length>0)
                        {                            
                            var endtime=new Date(filterColumn['filter_end']['value']).getTime() / 1000;
                            if(parseFloat(item[field])>endtime)
                            {                        
                                return false;
                            }
                        }
                    }
                    else
                    {
                        if(filterColumn['value'].length>0)
                        {
                                                        
                            if(item[field].toLowerCase().indexOf(filterColumn['value'].toLowerCase())==-1)
                            {
                                return false;
                            }                          
                        }
                    }
                  
                }                
                return true;}) 
        },
        //b-table data to csv        
        export_csv: function(headers,datas)
        {
            var csvStr="";
            for(var i=0;i<headers.length;i++)
            {
                csvStr=csvStr+'"'+headers[i].label+'",';
            }
            csvStr+="\n";
            for (var j=0;j<datas.length;j++)
            {
                for(var i=0;i<headers.length;i++)
                {
                    if(headers[i].fieldType=='date')
                    {
                        csvStr=csvStr+'"'+this.displayDate(datas[j][headers[i].key])+'",';
                    }
                    else
                    {
                        csvStr=csvStr+'"'+datas[j][headers[i].key]+'",';
                    }
                
                    
                
                }
                csvStr+="\n";
            }
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvStr);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'output.csv';
            hiddenElement.click();            
        }

    }
});
Vue.prototype.$system_functions=system_functions