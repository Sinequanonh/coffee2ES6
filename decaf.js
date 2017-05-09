const glob          = require('glob')
const shell         = require('shelljs')
const colors        = require('colors')
const replaceInFile = require('replace-in-file');

const options = {
  ignore: ['angular/node_modules/**', 'angular/tasks/**']
}

const files = 'angular/**/*.coffee'

glob(files, options, (er, files) => {
  const totalCSFiles = files.length
  files.map((file, index) => {

    // Decaffeinate *.coffee to .js
    // ========================================
    console.log(`#${index+1}/${totalCSFiles} ${file.green} (1/4 decaffeinate)`)
    const decaf = shell.exec(`decaffeinate ${file}`, { silent: true })

    if (decaf.code === 0) {
      // Transpils from ES5 to ES6/ES7 with lebab
      // ========================================
      console.log(`#${index+1}/${totalCSFiles} ${decaf.stdout.replace('\n', '').magenta} (2/4 ES6/ES7 transpiling)`)
      const lebab = shell.exec(`lebab --replace ${file.replace('coffee', 'js')} --transform arrow,let,template,includes,default-param`).red

      // ESLINT --FIX (see .eslintrc)
      // ========================================
      console.log(`#${index+1}/${totalCSFiles} ${decaf.stdout.replace('\n', '').blue} (3/4 eslint)`)
      const eslint = shell.exec(`eslint --fix ${file.replace('coffee', 'js')}`, { silent: true })

      // REPLACE (strings/regex)
      // ========================================
      console.log(`#${index+1}/${totalCSFiles} ${decaf.stdout.replace('\n', '').cyan} (4/4 replace)`)

      const replaceOptions = {
        files: file.replace('coffee', 'js').replace('\n', ''),
        from: '}\n)',
        to: '})',
        allowEmptyPaths: true,
        encoding: 'utf8',
      }

      try {
        let changedFiles = replaceInFile.sync(replaceOptions);
      } catch (error) {
        console.error('Error occurred:', error);
      }

    } else { 
      console.log(`#${index+1}/${totalCSFiles } | ${decaf.stderr.replace('\n', '').red}`);
    }
  })
  console.log('Done!')
})
