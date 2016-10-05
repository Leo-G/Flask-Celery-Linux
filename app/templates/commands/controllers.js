angular.module('myApp.services').factory('Command', function($resource) {
  return $resource('api/v1/commands/:id.json', { id:'@commands.id' }, {
    update: {
      method: 'PATCH',
      
     
     
    }
    }, {
    stripTrailingSlashes: false
    });
});


angular.module('myApp.controllers').controller('CommandListController', function($scope, $state,  Command, $auth, toaster) {
 //Table header definitions  
        var columnDefs = [ {headerName: "Sr No", cellRenderer: function(params) {return params.node.id + 1;} },
                             {headerName: "name", field: "name", width: 300 },{headerName: "task_id", field: "task_id", width: 300 },{headerName: "status", field: "status", width: 300 },{headerName: "result", field: "result", width: 300 },
                            
                            
                            ];
        $scope.gridOptions = { columnDefs: columnDefs,
                               rowData: null,
                               enableSorting: true,
                               enableColResize: true,
                               rowSelection: 'single',};  
        Command.get(function(data) {
                     $scope.commands = [];
                     angular.forEach(data.data, function(value, key)
                                                        {
                                                       this.command = value.attributes;
                                                       this.command['id'] = value.id;
                                                       this.push(this.command);                    
                                                        },   $scope.commands); 
                    $scope.gridOptions.rowData = $scope.commands;
                    $scope.gridOptions.api.onNewRows();
                    $scope.gridOptions.api.sizeColumnsToFit();
                               }, 
                function(error){
                      $scope.error = error.data;
                                              });
  
  
   $scope.deleteCommand = function(selected_id) { // Delete a Command. Issues a DELETE to /api/commands/:id
      command = Command.get({ id: selected_id});
      command.$delete({ id: selected_id},function() {
        toaster.pop({
                type: 'success',
                title: 'Sucess',
                body: "Command deleted successfully",
                showCloseButton: true,
                timeout: 0
                });
      
        $state.reload();
      }, function(error) {
         toaster.pop({
                type: 'error',
                title: 'Error',
                body: error,
                showCloseButton: true,
                timeout: 0
                });;
    });
    };
    
    
    $scope.updateCommand = function(selected_id) { //Update the command. Issues a PATCH to /v1/api/commands/:id
     
     $scope.loading = true;
    $scope.command = Command.get({ id: selected_id});
    $scope.command.$update({ id: selected_id },function() {
     toaster.pop({
                type: 'success',
                title: 'Sucess',
                body: "Update was a success",
                showCloseButton: true,
                timeout: 0
                });
        
       $state.reload();
       $scope.loading = false;
      //$state.go('sites'); // on success go back to home i.e. sites state.
    }, function(error) {
    toaster.pop({
                type: 'error',
                title: 'Error',
                body: error,
                showCloseButton: true,
                timeout: 0
                });
      $scope.loading = false;
    });
  };
  
}).controller('CommandEditController', function($scope, $state, $stateParams, toaster, $window, Command) {
     $scope.loading = false;
     $scope.updateCommand = function(selected_id) { //Update the command. Issues a PATCH to /v1/api/commands/:id
     
     $scope.loading = true;
    $scope.command.$update({ id: selected_id },function() {
     toaster.pop({
                type: 'success',
                title: 'Sucess',
                body: "Update was a success",
                showCloseButton: true,
                timeout: 0
                });
        
       $state.go('commands.list');
       $scope.loading = false;
      //$state.go('sites'); // on success go back to home i.e. sites state.
    }, function(error) {
    toaster.pop({
                type: 'error',
                title: 'Error',
                body: error,
                showCloseButton: true,
                timeout: 0
                });
      $scope.loading = false;
    });
  };

  
  $scope.loadCommand = function() { //Issues a GET request to /api/commands/:id to get a command to update
                       $scope.command = Command.get({ id: $stateParams.id },
                                       function() {}, function(error) {
                                          toaster.pop({
                                                type: 'error',
                                                title: 'Error',
                                                body: error,
                                                showCloseButton: true,
                                                timeout: 0
                                                });
                                                });
                                };

  $scope.loadCommand(); // Load a command 
  }).controller('CommandCreateController', function($scope, $state, Command, toaster) {
          $scope.command = new Command(); 
          $scope.loading = false;

         $scope.addCommand = function() { //Issues a POST to v1/api/command.json
                                $scope.loading = true;
                                $scope.command.data.type = "commands";
                                $scope.command.$save(function() {
                                toaster.pop({
                                            type: 'success',
                                            title: 'Sucess',
                                            body: "Command saved successfully",
                                            showCloseButton: true,
                                            timeout: 0
                                            });
                                   $state.go('commands.list');
                                   $scope.loading = false; 
                                }, function(error) {
                                toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: error,
                                            showCloseButton: true,
                                            timeout: 0
                                            });
                                 $scope.loading = false;
                                           });
                                 };
});




  