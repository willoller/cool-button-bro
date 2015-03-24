angular.module('coolButtonBro', ['willoller.coolButtonBro']);

var app = angular.module('coolButtonBro');

var CoolSaveButtonController = ['$scope', '$q', function($scope, $q){
	$scope.title = 'Hello World';
    $scope.timeoutSeconds = { number: 2000 };

    $scope.leadConfig = {
        strings: {
            dirty: "",
            clean: "Saved!",
            saving: "Saving...",
        },
        saveCallback: function(){
            var deferred = $q.defer();
            setTimeout(function(){
                deferred.resolve();
            }, $scope.timeoutSeconds.number);
            return deferred.promise;
        }
    };

    $scope.noSavedConfigDirty = false;
    $scope.noSavedConfig = {
        strings: {
            dirty: "You can always click!",
            clean: "This will not appear",
            saving: "Except while I'm working...",
        },
        saveCallback: function(){
            var deferred = $q.defer();
            setTimeout(function(){
                deferred.resolve();
            }, 2000);
            return deferred.promise;
        },
        watchThis: function(){ 
            return $scope.noSavedConfigDirty;
        },
        setSavedCallback: function(){
            // Still has to trigger a $watch inside the directive...
            $scope.noSavedConfigDirty = !$scope.noSavedConfigDirty;
        },
    }

    $scope.coolButtonConfig = {
        strings: function(){
            return {
                dirty: "Saving will take " + $scope.timeoutSeconds.number + " milliseconds...",
                clean: "Saved in just " + $scope.timeoutSeconds.number + " milliseconds!",
                saving: "Saving for " + $scope.timeoutSeconds.number + " milliseconds...",
            }
        },
        // Todo: not sure if there is a better way to pass to the $watch inside the directive
        watchThis: function(){ 
            var w = $scope.timeoutSeconds.number;
            return w;
        },
        saveCallback: function(){
            var deferred = $q.defer();
            setTimeout(function(){
                deferred.resolve();
            }, $scope.timeoutSeconds.number);
            return deferred.promise;
        }
    };

    $scope.iconConfigDirty = false;        
    $scope.iconConfig = {
        strings: {
            dirty:  "<icon class='glyphicon glyphicon-object-align-left'></i> Left",
            clean:  "<icon class='glyphicon glyphicon-object-align-vertical'></i> Center",
            saving: "<icon class='glyphicon glyphicon-object-align-right'></i> Right",
        },
        watchThis: function(){ 
            return $scope.iconConfigDirty;
        },
        saveCallback: function(){
            var deferred = $q.defer();
            setTimeout(function(){
                deferred.resolve();
            }, 1000);
            return deferred.promise;
        },
        setSavedCallback: function(){
            var deferred = $q.defer();
            setTimeout(function(){
                $scope.iconConfigDirty = !$scope.iconConfigDirty;
                deferred.resolve();
            }, 1000);
            return deferred.promise;
        }
    };
}];

app.controller('CoolSaveButtonController', CoolSaveButtonController);

app.directive('coolButton', coolSaveButtonDefinition);
