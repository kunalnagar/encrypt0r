module.exports = function(grunt) {
  const sass = require('node-sass');

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    sass: {
      options: {
        implementation: sass,
        style: 'compressed',
      },
      dist: {
        files: {
          'src/css/app.css': 'scss/app.scss',
        },
      },
    },
    cssmin: {
      options: {
        sourceMap: true,
      },
      target: {
        files: {
          'src/css/app.min.css': ['src/css/app.css'],
        },
      },
    },
    watch: {
      options: {
        nospawn: true,
      },
      css: {
        files: 'scss/**/*.scss',
        tasks: ['sass', 'cssmin'],
      },
    },
  });

  grunt.registerTask('build', ['sass', 'cssmin']);
};
