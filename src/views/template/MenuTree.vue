<template>
  <li @click="menu.type=='TASK'?$systemHtmElementsAction.clickTaskLinks():{}">
    <a v-if="menu.type=='MODULE'" :href="'#'+itemIdPrefix+menu.id" data-toggle="collapse" aria-expanded="false"><img src="http://45.251.59.5/arm/images/menu_icons/1/dashboard1.png">{{ menu.name }}<span class="fe-menu-arrow"></span></a>    
    <router-link v-else :to="'/'+menu.controller.toLowerCase()">{{ menu.name }}</router-link>
    
     <ul :id="itemIdPrefix+menu.id" class="list-unstyled collapse" v-if="menu.children && menu.children.length">
      <menu-item v-for="child in menu.children" :key="child.id" :menu="child"></menu-item>
    </ul>
  </li>
</template>

<script>
export default { 
  name: "menuItem",   
  props: {
    menu:Object,  
    itemIdPrefix:
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