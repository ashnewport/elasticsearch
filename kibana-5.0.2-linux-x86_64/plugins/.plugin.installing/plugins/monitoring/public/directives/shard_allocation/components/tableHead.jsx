/**
 * ELASTICSEARCH CONFIDENTIAL
 * _____________________________
 *
 *  [2014] Elasticsearch Incorporated All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Elasticsearch Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Elasticsearch Incorporated.
 */

import React from 'react';

export default React.createClass({
  displayName: 'TableHead',
  createColumn: function (label) {
    return (
      <th key={ label } colSpan={ 1 }>{ label }</th>
    );
  },
  render: function () {
    var columns = this.props.columns.map((row) => this.createColumn(row));
    return (
      <thead>
        <tr>{ columns }</tr>
      </thead>
    );
  }
});