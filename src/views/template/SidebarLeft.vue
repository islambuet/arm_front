<template>
    
<nav id="system_left_sidebar" class="sidebar d-print-none">  
    <ul class="list-unstyled">
        <li @click="$system_htm_elements_action.click_task_links($event)">
          <router-link to="/">
            <!-- <b-iconstack font-scale="1" animation="spin">
              <b-icon stacked icon="circle-fill" variant="primary"></b-icon>
              <b-icon stacked icon="brightness-high-fill" scale="0.75" variant="white"></b-icon>
              <b-icon stacked icon="circle" variant="danger"></b-icon>
            </b-iconstack> -->
            {{$system_variables.get_label('label_dashboard')}}
          </router-link>
          </li>
        <menu-tree v-for="(item, index) in $system_variables.user.tasks" :key="index" :menu="$system_variables.user.tasks[index]" :item_id_prefix="'side_menu_user_'"></menu-tree>        
        <menu-tree v-for="(item, index) in $system_variables.visitors.tasks" :key="index" :menu="$system_variables.visitors.tasks[index]" :item_id_prefix="'side_menu_visitors_'"></menu-tree>        
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

