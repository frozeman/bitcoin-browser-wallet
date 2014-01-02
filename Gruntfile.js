// just CONCAT and UGLIFY

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['js/*.js'],
        tasks: ['default'],
        options: {
          spawn: true,
        },
      },
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/**/*.js','!js/background.js','!js/addressFetcher.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    copy: {
      dist: {
        files: [
          // includes files within path
          {expand: true, src: ['*','!Gruntfile.js','!package.json','!karma.conf.js','!dist.zip'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'build/', src: ['bitcoin-browser-wallet.min.js'], dest: 'dist/js/'},
          {expand: true, src: ['js/vendor/*','js/background.js','js/addressFetcher.js','styles/*','icons/*'], dest: 'dist/', filter: 'isFile'},
        ]
      }
    },
    clean: {
      dist: {
        src: ["dist/"]
      }
    },
    replace: {
      dist: {
        src: ['dist/wallet.html'],
        dest: 'dist/wallet.html',
        replacements: [{ 
          from: '<script src="js/i18n.js"></script>',
          to: '<script src="js/bitcoin-browser-wallet.min.js"></script>' 
        },
        { 
          from: '<script src="js/wallet.js"></script>',
          to: '' 
        }]
      },
      distManifest: {
        src: ['dist/manifest.json'],
        dest: 'dist/manifest.json',
        replacements: [{ 
          from: 'Bitcoin Browser Wallet Dev',
          to: 'Bitcoin Browser Wallet' 
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify','watch']);
  grunt.registerTask('dist',['concat', 'uglify','clean:dist','copy:dist','replace:dist','replace:distManifest']);

};