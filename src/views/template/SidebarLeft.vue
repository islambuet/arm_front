<template>
    
<nav id="system_left_sidebar" class="sidebar d-print-none">
    <ul class="list-unstyled">
        <li @click="$system_htm_elements_action.click_task_links($event)">
          <router-link to="/">
            <b-iconstack font-scale="1" animation="spin">
              <b-icon stacked icon="circle-fill" variant="primary"></b-icon>
              <b-icon stacked icon="brightness-high-fill" scale="0.75" variant="white"></b-icon>
              <b-icon stacked icon="circle" variant="danger"></b-icon>
            </b-iconstack>
            {{$system_variables.get_label('menu_dashboard')}}
          </router-link>
          </li>
        <li @click="$system_htm_elements_action.click_task_links($event)"><router-link to="/sys_module_task"><img src="http://45.251.59.5/arm/images/menu_icons/1/dashboard.png">Module and Task</router-link></li>
        <li @click="$system_htm_elements_action.click_task_links($event)"><router-link to="/sys_user_group"><img src="http://45.251.59.5/arm/images/menu_icons/1/dashboard.png">User Group</router-link></li>
        <menu-tree v-for="(item, index) in $system_variables.users.tasks" :key="index" :menu="$system_variables.users.tasks[index]" :itemIdPrefix="'left_side_menu_'"></menu-tree>        
    </ul>
</nav>
</template>
<script>
import MenuTree from "./MenuTree.vue";
export default {
  name: 'SidebarLeft',  
  components:{MenuTree}
}
</script>

