exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [  
   'app/templates/users/spec.js'   
    
   
   //Specs
   , 'app/templates/commands/spec.js' 
   , 'app/templates/commands/spec.js' 

  ]
}

