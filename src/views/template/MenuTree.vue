<template>
  <li @click="(menu.type=='TASK')||(menu.type=='TASK_GROUP')?$system_htm_elements_action.click_task_links($event):{}">
    <a v-if="menu.type=='MODULE'" :href="'#'+item_id_prefix+menu.id" data-toggle="collapse" aria-expanded="false">
      <b-iconstack font-scale="1" animation="spin">
        <b-icon stacked icon="circle-fill" variant="primary"></b-icon>
        <b-icon stacked :icon="menu.icon_class" scale="0.75" variant="white"></b-icon>
        <b-icon stacked icon="circle" variant="danger"></b-icon>
      </b-iconstack>
      {{menu['name_'+$system_variables.language]}}<span class="fe-menu-arrow"></span>
    </a>    
    <router-link v-else :to="'/'+menu.controller.toLowerCase()">
      <b-iconstack font-scale="1" animation="spin">
        <b-icon stacked icon="circle-fill" variant="primary"></b-icon>
        <b-icon stacked :icon="menu.icon_class" scale="0.75" variant="white"></b-icon>
        <b-icon stacked icon="circle" variant="danger"></b-icon>
      </b-iconstack>
      {{ menu['name_'+$system_variables.language]}}
    </router-link>
    
     <ul :id="item_id_prefix+menu.id" class="list-unstyled collapse" v-if="menu.children && menu.children.length">
      <menu-item v-for="child in menu.children" :key="child.id" :menu="child"></menu-item>
    </ul>
  </li>
</template>

<script>
export default { 
  name: "menuItem",   
  props: {
    menu:Object,  
    item_id_prefix:
      {
        type:String ,
        default:'side_menu_'
      }
    }
};
</script>
<style scoped>
.tree-list ul {
  padding-left: 16px;
  margin: 6px 0;
}
</style>