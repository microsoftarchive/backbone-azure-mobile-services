/*
Copyright © Microsoft Open Technologies, Inc. 
All Rights Reserved 
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at  http://www.apache.org/licenses/LICENSE-2.0  
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.  
See the Apache 2.0 License for the specific language governing permissions and limitations under the License. 
*/
(function() {

	Backbone.ajaxSync = Backbone.sync;

	Backbone.sync = function(method, model, options, error) {
		function getProp(key) {
			return model[key] || (model.collection && model.collection[key]);
		}

		var tableName = getProp('table');
		if (!tableName) {
			return Backbone.ajaxSync(method, model, options, error);
		}

		var client = getProp('client');
		if (!client) {
			throw 'A WindowsAzure.MobileServiceClient needs to be specified for the model or collection';
		}

		var table = client.getTable(tableName);

		switch (method) {
			case 'create':
				table.insert(model.toJSON()).then(function(data) {
					model.id = data.id;
					options.success(data);
				}, function(err) {
					console.error(err);
					options.error(err);
				});
				break;
			case 'update':
				table.update(model.toJSON()).then(function(data) {
					options.success(data);
				}, function(err) {
					console.error(err);
					options.error(err);
				});
				break;
			case 'delete':
				table.del(model.toJSON()).then(function() {
					options.success(model.toJSON());
				}, function(err) {
					console.error(err);
					options.error(err);
				});
				break;
			case 'read':
				if (model.id) {
					options.where = {
						id: model.id
					};
					options.take = 1;
				}

				var query = table;

				if (typeof options.skip !== 'undefined') {
					query = query.skip(options.skip);
				}
				if (typeof options.take !== 'undefined') {
					query = query.take(options.take);
				}
				if (typeof options.where !== 'undefined') {
					if (_.isArray(options.where) && typeof options.where[0] === 'function') {
						query = query.where.apply(query, options.where);
					} else {
						query = query.where(options.where);
					}
				}

				query.read().then(function(data) {
					if (model.id) {
						options.success(data[0]);
					} else {
						options.success(data);
					}

				}, function(err) {
					console.error(err);
					options.error(err);
				});
				break;
		}

	};
}());