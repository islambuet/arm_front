<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-sm-6">
                <div class="text-center pt-2">
                    <h1 class="text-error mt-4">404</h1>
                    <h3 class="text-uppercase text-danger mt-3">Page Not Found</h3>
                    <p class="text-muted mt-3">It's looking like you may have taken a wrong turn. Don't worry... it
                        happens to the best of us. You might want to check your internet connection. Here's a
                        little tip that might help you get back on track.
                    </p>
                </div>
            </div><!-- end col -->
        </div>
            <!-- end row -->                        
    </div>
</template>
<script>
export default { 
  name: "NotFound", 
  mounted:function()
  {
    this.$system_variables.status_task_loaded=1;  
    this.$system_variables.status_data_loaded=1; 
    console.log('404 monted');    
  },  
  
};
</script>