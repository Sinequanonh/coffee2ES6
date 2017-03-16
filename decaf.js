const glob   = require('glob')
const shell  = require('shelljs')
const colors = require('colors')

const args = process.argv

const projectPath = args[2]

const options = {
  ignore: `${projectPath}/node_modules/**`
}

glob(`${projectPath}/**/*.coffee`, options, (er, files) => {
  const totalCSFiles = files.length
  files.map((file, index) => {  
    // Decaffeinate *.coffee to .js
    const decaf = shell.exec(`decaffeinate ${file}`, { silent: true })
    if (decaf.code === 0) { 
      console.log(`#${index+1}/${totalCSFiles} ${decaf.stdout.replace('\n', '').green}`)
      // Transpils from ES5 to ES6/ES7
      const lebab = shell.exec(`lebab --replace ${file.replace('coffee', 'js')} --transform arrow, let, template, includes, default-param`).red
      const eslint = shell.exec(`eslint --fix ${file.replace('coffee', 'js')}`)
    } else { 
      console.log(`#${index+1}/${totalCSFiles } | ${decaf.stderr.replace('\n', '').red}`);
    }
  })
  console.log('Done!')
})
