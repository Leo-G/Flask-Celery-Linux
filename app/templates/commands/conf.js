exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
                  
  onPrepare: function() {
    
       browser.get('http://localhost:5000/');
       element(by.id("login-email")).clear();
       element(by.id("login-email")).sendKeys("root@localhost");
       element(by.id("login-password")).clear();
       element(by.id('login-password')).sendKeys("Str0ng P@$$w)*&^+=");       
       element(by.id("login-button")).click()
           .then(function() {           
              
                
                  expect(browser.getTitle()).toEqual('Home | Flask-Scaffold');

                });                 
                    
    
    
  }
}