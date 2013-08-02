module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-karma');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        karma: {
            unit: {
                configFile: 'config/karma.conf.js'
            }
        },
    });
}
