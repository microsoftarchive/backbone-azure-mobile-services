/*
Copyright © Microsoft Open Technologies, Inc. 
All Rights Reserved 
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at  http://www.apache.org/licenses/LICENSE-2.0  
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.  
See the Apache 2.0 License for the specific language governing permissions and limitations under the License. 
*/

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> built <%= grunt.template.today("yyyy-mm-dd") %> */\n/*\n' + grunt.file.read('LICENSE.md') + '\n*/\n'
      },
      min: {
        src: 'src/index.js',
        dest: 'dist/<%= pkg.name%>.min.js'
      },
      concat: {
        src: 'src/index.js',
        dest: 'dist/<%= pkg.name%>.js',
        options: {
          beautify: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9999,
          base: '.'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: __dirname + '/.jshintrc'
      },
      files: ['Gruntfile.js', 'src/*.js', 'tests/spec/*.js']
    },
    watch: {
      files: ['src/*.js'],
      tasks: ['build']
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) grunt.loadNpmTasks(key);
  }

  // Default task(s).
  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('dev', ['build', 'connect', 'watch']);
  grunt.registerTask('default', ['build']);

};