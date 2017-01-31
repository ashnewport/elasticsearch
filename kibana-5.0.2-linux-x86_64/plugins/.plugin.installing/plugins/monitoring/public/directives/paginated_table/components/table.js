import _ from 'lodash';
import React from 'react';
import TableHead from './tableHead';
import TableBody from './tableBody';
import Pagination from './pagination';

const make = React.DOM;

function getFilteredData(data, filter) {
  function flattenStrings(obj) {
    const values = _.values(obj);
    const nestedObjects = _.filter(values, (val) => {
      return typeof val === 'object';
    });
    let searchStrings = _.filter(values, (val) => {
      return typeof val === 'string';
    });
    _.each(nestedObjects, (nested) => {
      searchStrings = searchStrings.concat(flattenStrings(nested));
    });
    return searchStrings;
  }

  if (!filter) return data;
  return data.filter(function (obj) {
    var concatValues = flattenStrings(obj)
      .join('|')
      .toLowerCase();
    return (concatValues.indexOf(filter.toLowerCase()) !== -1);
  });
}

const Table = React.createClass({
  displayName: 'Table',
  getInitialState: function () {
    var sortColObj = null;
    if (this.props.options.columns) {
      sortColObj = this.props.options.columns.reduce((prev, dataKey) => {
        return prev || (dataKey.sort !== 0 ? dataKey : null);
      }, null);
    }
    return {
      itemsPerPage: 20,
      pageIdx: 0,
      sortColObj: sortColObj,
      filter: '',
      title: 'Kb Paginated Table!',
      template: null,
      tableData: null,
      filterMembers: this.props.filterMembers || []
    };
  },
  setData: function (data) {
    if (data) {
      // no length check so if the results is an empty set it clears the loading message
      this.setState({tableData: data});
    }
  },
  setSortCol: function (colObj) {
    if (colObj) {
      if (this.state.sortColObj && colObj !== this.state.sortColObj) {
        this.state.sortColObj.sort = 0;
      }
      this.setState({sortColObj: colObj});
    }
  },
  setFilter: function (str) {
    str = str || '';
    this.setState({filter: str, pageIdx: 0});
  },
  setItemsPerPage: function (num) {
    // Must be all;
    if (_.isNaN(+num)) {
      num = 0;
    }
    this.setState({
      itemsPerPage: num,
      pageIdx: 0
    });
  },
  setCurrPage: function (idx) {
    this.setState({pageIdx: idx});
  },
  render: function () {
    var isLoading = (this.state.tableData === null);
    if (isLoading) {
      let nodes = [
        make.i({ className: 'fa fa-spinner fa-pulse' }),
        make.span(null, 'Loading Data...')
      ];
      return make.div({className: 'paginated-table loading'}, nodes);
    }

    // Make the Title Bar
    var $title = make.h3({className: 'pull-left title'}, this.props.options.title);
    var that = this;
    var $filter = make.input({
      type: 'text',
      className: 'pull-left filter-input filter-member filter-member-first',
      placeholder: this.props.options.searchPlaceholder,
      onKeyUp: function (evt) {
        that.setFilter(evt.target.value);
      }
    });
    var filteredTableData = getFilteredData(this.state.tableData, this.state.filter);
    var viewingCount = Math.min(filteredTableData.length, this.state.itemsPerPage);
    var $count = make.div({className: 'pull-left filter-member'}, `${viewingCount} of ${this.state.tableData.length}`);
    var titleClasses = 'title-bar';
    if (this.props.options.title == null) {
      titleClasses += ' no-title';
    }

    var $titleBar = make.div({className: titleClasses},
      $title, $filter, $count, ...this.state.filterMembers, make.div({className: 'clearfix'}));

    // Make the Table
    var $tableHead = React.createFactory(TableHead);
    var $tableBody = React.createFactory(TableBody);
    var $table = make.table({ key: 'table', className: 'table monitoring-view-listing-table' },
      $tableHead({
        key: 'table.head',
        setSortCol: this.setSortCol,
        columns: this.props.options.columns,
        sortColObj: this.state.sortColObj
      }),
      $tableBody({
        key: 'table.body',
        tableData: filteredTableData,
        columns: this.props.options.columns,
        sortColObj: this.state.sortColObj,
        pageIdx: this.state.pageIdx,
        itemsPerPage: this.state.itemsPerPage,
        template: this.props.template
      }));

    // Footer
    var $pagination = React.createElement(Pagination, {
      dataLength: filteredTableData.length,
      itemsPerPage: this.state.itemsPerPage,
      pageIdx: this.state.pageIdx,
      setCurrPage: this.setCurrPage,
      setItemsPerPage: this.setItemsPerPage
    });


    // Finally wrap it all up and add it to a wrapping div
    return React.createElement('div', {className: 'paginated-table'},
      $titleBar,
      $table,
      $pagination);
  }
});

export default Table;
