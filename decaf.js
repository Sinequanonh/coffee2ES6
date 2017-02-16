const glob           = require('glob')
const shell          = require("shelljs")
const colors         = require('colors')

glob('angular/**/*.coffee', {}, (er, files) => {
  const totalCSFiles = files.length
  files.map((file, index) => {
    // Decaffeinate *.coffee to .js
    const decaf = shell.exec(`decaffeinate ${file}`, { silent: true })
    if (decaf.code === 0) { 
      console.log(`#${index+1}/${totalCSFiles} ${decaf.stdout.replace('\n', '').green}`)
      // Transpils from ES5 to ES6/ES7
      const lebab = shell.exec(`lebab --replace ${file.replace('coffee', 'js')} --transform arrow,let,template,includes,default-param,commonjs`).red
    } else { 
      console.log(`#${index+1}/${totalCSFiles } | ${decaf.stderr.replace('\n', '').red}`); 
    }
  })
  console.log('Done!')
})
