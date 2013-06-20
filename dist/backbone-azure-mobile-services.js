/*! backbone-azure-mobile-services v0.0.1 built 2013-05-28 */
/*
Copyright © Microsoft Open Technologies, Inc. 
All Rights Reserved 
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at  http://www.apache.org/licenses/LICENSE-2.0  
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.  
See the Apache 2.0 License for the specific language governing permissions and limitations under the License. 
*/
(function() {
    Backbone.ajaxSync = Backbone.sync, Backbone.sync = function(a, b, c, d) {
        function e(a) {
            return b[a] || b.collection && b.collection[a];
        }
        var f = e("table");
        if (!f) return Backbone.ajaxSync(a, b, c, d);
        var g = e("client");
        if (!g) throw "A WindowsAzure.MobileServiceClient needs to be specified for the model or collection";
        var h = g.getTable(f);
        switch (a) {
          case "create":
            h.insert(b.toJSON()).then(function(a) {
                b.id = a.id, c.success(a);
            }, function(a) {
                console.error(a), c.error(a);
            });
            break;

          case "update":
            h.update(b.toJSON()).then(function(a) {
                c.success(a);
            }, function(a) {
                console.error(a), c.error(a);
            });
            break;

          case "delete":
            h.del(b.toJSON()).then(function() {
                c.success(b.toJSON());
            }, function(a) {
                console.error(a), c.error(a);
            });
            break;

          case "read":
            b.id && (c.where = {
                id: b.id
            }, c.take = 1);
            var i = h;
            "undefined" != typeof c.skip && (i = i.skip(c.skip)), "undefined" != typeof c.take && (i = i.take(c.take)), 
            "undefined" != typeof c.where && (i = _.isArray(c.where) && "function" == typeof c.where[0] ? i.where.apply(i, c.where) : i.where(c.where)), 
            i.read().then(function(a) {
                b.id ? c.success(a[0]) : c.success(a);
            }, function(a) {
                console.error(a), c.error(a);
            });
        }
    };
})();