/*
Copyright © Microsoft Open Technologies, Inc. 
All Rights Reserved 
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at  http://www.apache.org/licenses/LICENSE-2.0  
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.  
See the Apache 2.0 License for the specific language governing permissions and limitations under the License. 
*/

describe('Backbone Azure Mobile Services', function() {
  var Person = Backbone.Model.extend({});
  var People = Backbone.Collection.extend({
    client: client,
    table: 'Table1',
    model: Person
  });


  it('starts with empty store', function() {
    var started = false;
    var people = new People();
    runs(function() {
      people.fetch();
      people.on('sync', function() {
        started = true;
        for (var i = 0, len = people.length; i < len; i++) {
          people.models[0].destroy();
        }
      });
    });

    waitsFor(function() {
      return started && people.length === 0;
    }, 'Colletion should have been fetched and deleted', 30000);
  });

  describe('for a Model', function() {
    var employee = null;
    it('should be able to create a new model ', function() {
      // Creating a simple model
      runs(function() {
        var people = new People();
        employee = people.create(createSimpleCard());
      });

      waitsFor(function() {
        return employee.id;
      }, 'A model should have been created', 30000);

    });

    it('should be able to update a model', function() {
      var changed = false;
      runs(function() {
        expect(employee.id).toBeDefined();
        employee.set('modified', new Date());
        employee.save();
        employee.on('sync', function() {
          changed = true;
        });
      });

      waitsFor(function() {
        return changed;
      }, 'Model should have been modified', 30000);
    });

    it('should be able to read a model', function() {
      var done = false;
      runs(function() {
        expect(employee).toBeDefined();
        var clone = employee.clone();
        employee.clear();
        employee.id = clone.id;
        employee.fetch();
        employee.on('sync', function() {
          expect(employee.id).toEqual(clone.id);
          done = true;
        });
      });

      waitsFor(function() {
        return done;
      }, 'Should have fetched the object', 30000);
    });

    it('should be able to delete a model', function() {
      var changed = false;
      runs(function() {
        expect(employee.id).toBeDefined();
        employee.destroy({
          'success': function() {
            changed = true;
          }
        });
      });

      waitsFor(function() {
        return changed;
      }, 'Model should be deleted from the server', 30000);
    });
  });

  describe('for Collections', function() {
    it('should be able to add multiple records', function() {
      var people = new People(),
        count = 0;
      runs(function() {
        for (var i = 0; i < 10; i++) {
          var person = people.create(createSimpleCard());
          person.on('sync', function() {
            count++;
          });
        }
      });

      waitsFor(function() {
        return count === 10;
      }, '10 models should have been added', 30000);
    });

    it('should be able to fetch all previously added records', function() {
      var done = false;
      runs(function() {
        var people = new People();
        people.fetch();
        people.on('sync', function() {
          expect(this.length).toBe(10);
          done = true;
        });
      });

      waitsFor(function() {
        return done;
      }, '10 models should have been fetched', 30000);
    });
  });

  describe('for Queries', function() {
    it('should work with ONLY take clause', function() {
      var people = new People();
      people.fetch({
        take: 3
      });
      people.on('sync', function() {
        expect(people.length).toBe(3);
      });
    });

    it('should use a where clause', function() {
      var people = new People();
      people.fetch({
        where: {
          completed: false
        }
      });
      people.on('sync', function() {
        _.each(people, function() {
          expect(this.completed).toBe(false);
        });
      });
    });

    it('should work with a function in where clause', function() {
      var people = new People();
      people.fetch({
        where: [function(len) {
          return len > this.length;
        },
        5]
      });
      people.on('sync', function() {
        _.each(people, function() {
          console.log(this.name);
          expect(this.name.length).toBeLessThan(4);
        });
      });
    });
  });
});