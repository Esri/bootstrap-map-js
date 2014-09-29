

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: [
                    'Gruntfile.js',
                    'src/js/*.js',
                    'src/css/*.css',
                    'src/images/*.png'
                ],

                tasks: ['uglify','cssmin'],
                options: {
                    spawn: false
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true //remove console.log statements :)
                },
                wrap: false
            },
            dist: {
                files: {
                    'dist/js/bootstrapmap.min.js': ['src/js/bootstrapmap.js']
                }
            }
        },
        cssmin: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'src/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css/',
                    ext: '.min.css'
                }]
            }
        }
    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default',['uglify','cssmin']);
}