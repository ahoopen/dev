module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-plato');



  grunt.initConfig({
    
    jshint: {
      src: [
        'src/**/*.js', 
        '!src/public/vendor/**/*.js'
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        /* mixed tabs toestaan */
        "-W099": true,
        /* toe staan om parameter aan een exception toe te voegen  */
        "-W022": true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
		  exports: true,
          require: true,
          define: true,
          requirejs: true,
          describe: true,
          expect: true,
          module: true,
          jQuery: true,
          console: true,
          it: true,
          $: true,
          moment : true,
          app : true,
          __dirname : true
        }
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 8, // maximum number of notifications from jshint output
        title: "Project Name" // defaults to the name in package.json, or will use project directory's name
      }
    },

    notify: {
      plato: {
        options: {
          enabled: true,
          title : "Quality check",
          message : 'code analyse succesvol afgerond.'
        }
      },
      build : {
        options: {
          title : "Build succesfull",
          message : "application build completed succesfull"
        }
      },
      dev : {
        options : {
          title : "Dev",
          message : "Development environment started"
        }
      }
    },

    clean : {
      build : {
        src : ['dist/*']
      }
    },

    cssmin : {
      build : {
        files : {
          'dist/application.css' : ['assets/**/*.css']
        }
      }
    },

    requirejs : {
      options : {
        baseUrl: "./"
      },
      // infrastructure minification
      infrastructure : {
        options : {
          paths : {
              "project" : "./"
          },
          name : "build.infrastructure",
          out : "dist/infrastructure.build.min.js"
        }
      },
      // project minification
      project : {
        options : {
            paths : {
                "project" : "./"
            },
            name : "build.project",
            exclude : [
              "build.infrastructure"
            ],
            out : "dist/project.build.min.js"
        }
      }
    },

    /**
    * Javascript unit testing.
    *
    **/
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true,
        autoWatch: false
      }
    },

    plato : {
      test : {
        files : {
          'reports' : ['src/**/*.js']
        }
      }
    },

    watch: {
      js: {
        options: {
          spawn: false,
        },
        files: ['<%= jshint.src %>','src/**/*.js'],
        tasks: ['jshint']
      },

      karma : {
        files: ['src/**/*.js', 'tests/**/*.js'],
        tasks: ['karma:unit:run']
      }
    }


  });
	
  grunt.registerTask('dev', [ 
    'karma:unit:start',
    'watch'
    /*'notify:dev' */
  ]);
  
  /**
  * Genereert een code kwaliteit report 
  **/
  grunt.registerTask('quality', [
    'plato:test', 
    'notify:plato'
  ]);
  
  /**
  * 
  **/
  grunt.registerTask('build', [
    'clean',
    'cssmin',
    'requirejs:infrastructure',
    'requirejs:project',
    'notify:build'
  ]);
}