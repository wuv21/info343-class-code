module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    keepalive: true,
                    port: 8080,
                    base: 'dist'
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/main.css': 'dawg-coffee/scss/main.scss'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/js/medium-effect.js': 'dawg-coffee/js/medium-effect.js'
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dawg-coffee/index.html',
                    'dist/order.html': 'dawg-coffe/order.html'
                }
            }
        },
        copy: {
            dist: {
                expand: true,
                cwd: 'dawg-coffee/img/',
                src: '*',
                dest: 'dist/img/'
            }
        }
    });

    grunt.registerTask('minify', ['uglify', 'htmlmin']);
    grunt.registerTask('default', ['minify', 'sass', 'copy', 'connect']);
};