import _ from 'lodash';
import { formatDateTimeLocal } from '../../../lib/formatting';
import template from 'plugins/monitoring/directives/shard_activity/index.html';
import formatNumber from 'plugins/monitoring/lib/format_number';
import uiModules from 'ui/modules';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringShardActivity', function () {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      onlyActive: '=?'
    },
    template: template,
    link: function ($scope) {
      $scope.formatNumber = formatNumber;
      $scope.formatDateTimeLocal = formatDateTimeLocal;
      $scope.visibleData = [];

      $scope.toggleActive = function () {
        $scope.onlyActive = !$scope.onlyActive;
        filterData($scope.data);
      };

      $scope.lookup = {
        STORE: 'Primary',
        GATEWAY: 'Primary',
        REPLICA: 'Replica',
        SNAPSHOT: 'Snapshot',
        RELOCATION: 'Relocation'
      };

      function filterData() {
        if ($scope.data) {
          $scope.visibleData = _.filter($scope.data, function (item) {
            if ($scope.onlyActive) {
              return item.stage !== 'DONE';
            }
            return true;
          });
        }
      }
      filterData();

      $scope.$watch('data', filterData);

      $scope.getIpAndPort = function (transport) {
        var matches = transport.match(/([\d\.:]+)\]$/);
        if (matches) return matches[1];
        return transport;
      };
    }
  };
});

