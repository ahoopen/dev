module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.initConfig({
    
    jshint: {
      src: ['src/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          require: true,
          define: true,
          requirejs: true,
          describe: true,
          expect: true,
          module: true,
          console: true,
          it: true,
          $: true,
          moment : true
        }
      }
    },


    /**
    * JavaScript unit testing
    **/
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          ui: 'bdd',
          clearRequireCache: true,
          // Require blanket wrapper here to instrument other required
          // files on the fly. 
          //
          // NB. We cannot require blanket directly as it
          // detects that we are not running mocha cli and loads differently.
          //
          // NNB. As mocha is 'clever' enough to only run the tests once for
          // each file the following coverage task does not actually run any
          // tests which is why the coverage instrumentation has to be done here
          require: 'reports/coverage/blanket'
        },
        src: ['tests/**/*.js']
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'reports/coverage.html'
        },
        src: ['tests/**/*.js']
      },
      'travis-cov' : {
      	options : {
      		reporter: 'travis-cov'
      	},
      	src : ['tests/**/*.js']
      }
    },

    watch: {
      js: {
        options: {
          spawn: false,
        },
        files: ['<%= jshint.src %>','src/**/*.js'],
        tasks: ['jshint', 'mochaTest']
      }
    },


	jsdoc : {
        dist : {
            src: ['src/*.js', 'tests/*.js'], 
            options: {
                destination: 'doc'
            }
        }
    }

  });
	
  grunt.registerTask('build', ['mochaTest']);
  grunt.registerTask('default', ['mochaTest', 'watch:js']);

}