module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-karma');

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
          moment : true
        }
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 8, // maximum number of notifications from jshint output
        title: "Ontwikkel" // defaults to the name in package.json, or will use project directory's name
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
	
  grunt.registerTask('build', ['notify_hooks', 'karma:unit:start', 'watch']);
}