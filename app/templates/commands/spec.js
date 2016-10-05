// spec.js
describe('Testing Commands CRUD Module', function() {

var Command = function() {
        
        var name = element(by.id('name'));
        this.setName = function(nameText) { name.clear(); name.sendKeys(nameText); };
        
        var task_id = element(by.id('task_id'));
        this.setTask_Id = function(task_idText) { task_id.clear(); task_id.sendKeys(task_idText); };
        
        var status = element(by.id('status'));
        this.setStatus = function(statusText) { status.clear(); status.sendKeys(statusText); };
        
        var result = element(by.id('result'));
        this.setResult = function(resultText) { result.clear(); result.sendKeys(resultText); };
        
         
        this.get = function() {
                                   browser.get('http://localhost:5000/');
                                       };    
        
        this.toast = function(message){
                                        $('.form-button .button-primary').click()  // css selectors http://angular.github.io/protractor/#/api?view=build$  
                                            .then(function() {     
                                                  var EC = protractor.ExpectedConditions;
                                                  var toastMessage = $('.toast-message');                                      
                                                  browser.wait(EC.visibilityOf(toastMessage), 6000) //wait until toast is displayed
                                                             .then(function(){
                                                                    expect(toastMessage.getText()).toBe(message);

                                                                        });
                                                                  });                                                    
                                    }                    
                    };
    
it('Should add a new Command', function() {
    
    var command = new Command();
    
    // Get commands URL
    command.get();
    
    // Goto the new menu    
    element(by.id('commands_menu')).click();
    element(by.id('commands_new')).click();
    
    // Fill in the Fields
    
        command.setName("Your Title text here");
        command.setTask_Id("Your Body text here 77569yuii3wui&%$$^"); 
        command.setStatus("Your Title text here");
        command.setResult("Your Body text here 77569yuii3wui&%$$^"); 

    //Expectations
    command.toast("Command saved successfully");
                 
  });
      
it('Should  edit a Command', function() {

    var command = new Command();
    
    command.get();
    
    //Goto the edit menu
    element(by.id('commands_menu')).click();
    element(by.id('commands_list')).click(); 
    element(by.css('.ag-row-level-0')).click();
    element(by.id('editButton')).click();
     
    // Fill in the fields
    
        command.setName("Your Updated Title text here");
        command.setTask_Id("Your Updated Body text here 77569yuii3wui&%$$^"); 
        command.setStatus("Your Updated Title text here");
        command.setResult("Your Updated Body text here 77569yuii3wui&%$$^"); 
    
    //Expectations
    command.toast("Update was a success");
      
 

});
    
it('Should  delete a Command', function() {
    browser.get('http://localhost:5000/');
    element(by.id('commands_menu')).click();
    element(by.id('commands_list')).click();
    element(by.css('.ag-row-level-0')).click();
    element(by.id('deleteButton')).click()
            
    .then(function(){

        var EC = protractor.ExpectedConditions;
        var toastMessage = $('.toast-message');

         browser.wait(EC.visibilityOf(toastMessage), 60) //wait until toast is displayed
            .then(function(){

                expect(toastMessage.getText()).toBe("Command deleted successfully")

      });
  
  });
});
      
  });
