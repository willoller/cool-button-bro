"use strict";
angular.module('willoller.coolButtonBro', []);

var coolSaveButtonDirectiveLink = function($scope, $element, $attrs, $q, $timeout){
	$element.addClass('cool-button');

	var config = {
		strings: {
			dirty: "Save",
			clean: "Saved!",
			saving: "Saving...",
		},
		saveCallback:      function(){},
		setSavingCallback: function(){ console.debug('setSavingCallback'); },
		setSavedCallback:  function(){ console.debug('setSavedCallback'); },
		setDirtyCallback:  function(){ console.debug('setDirtyCallback'); },
		watchThis: null
	};
	angular.extend(config, $scope.$eval($attrs.coolButton), true);

	var watchThis    = config.watchThis; // $pristine
	var saveCallback = config.saveCallback; // Promise of save

	/*
		allow to work:
		{
			strings: {
				dirty: function(){...}
			}
		}

	and

		{
			strings: function(){
				return {
					dirty: "value"
				}
			}
		}

	and

		{
			strings: function(){
				return {
					dirty: function(){...}
				}
			}
		}

	 */
	var strings = function(key){
		var result = config.strings;

		if (typeof config.strings === 'function'){
			result = config.strings();
		}

		if (key !== undefined && result[key] !== undefined){
			result = result[key];

			if (typeof result === 'function'){
				result = result();
			}
		}

		return result;
	}

	var reallySaveCallback = function(){
		return $q.when()
		.then(config.setSavingCallback)
		.then(setSaving)
		.then(saveCallback)
		.then(setSaved)
		.then(config.setSavedCallback);
	};

	var setSaving = function(){
		$element.attr('disabled', 'disabled');
		$element.addClass('disabled');
		$element.html(strings('saving'));
	};
	var setSaved = function(){
		$element.attr('disabled', 'disabled');
		$element.addClass('disabled');
		$element.html(strings('clean'));
		stillDirty = false;
	};
	var setDirty = function(){
		$element.attr('disabled', false);
		$element.removeClass('disabled');
		$element.html(strings('dirty'));
		stillDirty = true;
	};

	$q.all([
		setSaved,
		config.setSavedCallback
	]);

	var stillDirty = false;
	$scope.$watch(watchThis, function(newVal, oldVal){
		if (newVal !== undefined && oldVal !== undefined){
			var set = $q.when().then(setDirty);

			// Don't run the setDirtyCallbackevery time the thing is set dirty, 
			// just once in between clicks.
			if (!stillDirty){
				set = $q.when(set).then(config.setDirtyCallback);
			}
		}
	});

	$element.bind("click", function(){
	    reallySaveCallback();
	});
};

var coolSaveButtonDefinition = ['$q', function($q){
	return {
		restrict: 'EACM',
		controller: coolSaveButtonDirectiveLink
	};
}];

angular.module('willoller.coolButtonBro')
.directive('coolSaveButton', coolSaveButtonDefinition);
