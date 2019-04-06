(function () {

    'use strict';

    module.exports = function (grunt) {

        const sass = require('node-sass');

        require('load-grunt-tasks')(grunt);

        grunt.initConfig({
            sass: {
                options: {
                    implementation: sass,
                    style: 'compressed'
                },
                dist: {
                    files: {
                        'css/app.css': 'scss/app.scss'
                    }
                }
            },
            cssmin: {
                options: {
                    sourceMap: true
                },
                target: {
                    files: {
                        'css/app.min.css': ['css/app.css']
                    }
                }
            },
            watch: {
                options: {
                    nospawn: true
                },
                css: {
                    files: 'scss/**/*.scss',
                    tasks: ['sass', 'cssmin']
                }
            }
        });
    };
})();
