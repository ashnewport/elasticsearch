import _ from 'lodash';
import React from 'react';

const maxListSize = 10; // TODO - make this as a config option

const ItemsPerPageLink = React.createClass({
  handleClick() {
    this.props.setItemsPerPage(this.props.choice);
  },
  render() {
    return <span onClick={this.handleClick}>{this.props.choice}</span>;
  }
});

const ItemsPerPageSet = React.createClass({
  render() {
    // choices for how many results to show per page
    let itemsPerPageChoices = [];
    if (this.props.dataLength > 20) {
      itemsPerPageChoices.push(20);
    }
    if (this.props.dataLength > 60) {
      itemsPerPageChoices.push(60);
    }
    if (this.props.dataLength > 80) {
      itemsPerPageChoices.push(80);
    }
    if (this.props.dataLength > 20) {
      itemsPerPageChoices.push('Show All');
    }

    // markup for the choices
    let itemsPerPageLinks = [];
    itemsPerPageChoices.forEach((choice, idx) => {
      if (idx !== 0) {
        // add a vertical line separator before every non-first choice
        itemsPerPageLinks.push(<span> | </span>);
      }
      itemsPerPageLinks.push(<ItemsPerPageLink
        setItemsPerPage={this.props.setItemsPerPage}
        choice={choice}/>);
    });

    return <div className='pull-right items-per-page'>
        {itemsPerPageLinks}
      </div>;
  }
});

const Chevron = React.createClass({
  scrollRightOrLeft() {
    if (this.props.direction === 'left') {
      this.props.setCurrPage(this.props.pageIdx - 1);
    } else if (this.props.direction === 'right') {
      this.props.setCurrPage(this.props.pageIdx + 1);
    }
  },
  render() {
    return <li onClick={this.scrollRightOrLeft}>
        <i className={`fa fa-chevron-${this.props.direction}`} />
      </li>;
  }
});

const PageLink = React.createClass({
  goToPage() {
    // if the link content is "1", go to page 0
    this.props.setCurrPage(this.props.pageIdx - 1);
  },
  render() {
    const currentClass = this.props.isCurrent ? 'current' : '';
    return <li onClick={this.goToPage} className={currentClass}>
        {this.props.pageIdx}
      </li>;
  }
});

const Ellipsis = React.createClass({
  scrollList() {
    if (this.props.direction === 'left') {
      this.props.setCurrPage(Math.max(this.props.pageIdx - maxListSize, 0));
    }
    if (this.props.direction === 'right') {
      this.props.setCurrPage(Math.min(this.props.pageIdx + maxListSize, this.props.numPages - 1));
    }
  },
  render() {
    // HTML entity for ellipsis
    return <li onClick={this.scrollList}>&hellip;</li>;
  }
});

export default React.createClass({
  displayName: 'Pagination',
  render() {
    if (this.props.dataLength <= this.props.itemsPerPage) {
      // not enough data to paginate, so don't render anything real
      return <div className='footer'></div>;
    }

    let numPages = Math.ceil(this.props.dataLength / this.props.itemsPerPage);
    if (!_.isFinite(numPages)) { numPages = 1; } // Because Dividing by 0 results in Infinity

    // list of page links
    let listBeginning = 1;

    if (numPages > maxListSize && this.props.pageIdx >= Math.floor(maxListSize / 2)) {
      // keep a shortened list of 5 on the left, 4 on the right of current
      listBeginning = this.props.pageIdx - Math.floor(maxListSize / 2) + 1;
      // if we're at the end of the list, the window shows the last 10 pages
      listBeginning = Math.min(listBeginning, numPages - maxListSize + 1);
    }

    let pageLinks = [];
    let listEnd = Math.min(numPages, listBeginning + maxListSize - 1);
    for (let i = listBeginning; i <= listEnd; i++) {
      pageLinks.push(
          <PageLink
            key={`pageLink-${i}`}
            isCurrent={this.props.pageIdx === i - 1}
            pageIdx={i}
            setCurrPage={this.props.setCurrPage} />
        );
    }

    let chevronLeft;
    let chevronRight;
    if (this.props.pageIdx > 0) {
      chevronLeft = <Chevron
        direction='left'
        pageIdx={this.props.pageIdx}
        setCurrPage={this.props.setCurrPage} />;
    }

    if (this.props.pageIdx < numPages - 1) {
      chevronRight = <Chevron
        direction='right'
        pageIdx={this.props.pageIdx}
        setCurrPage={this.props.setCurrPage} />;
    }

    let ellipsisLeft;
    let ellipsisRight;
    let jumpStart;
    let jumpEnd;
    // check if the number of pages to show is greater than the max that should
    // be shown in the list
    if (numPages > maxListSize) {
      if (listBeginning > 1) {
        jumpStart = <PageLink
          pageIdx={1}
          setCurrPage={this.props.setCurrPage} />;
        ellipsisLeft = <Ellipsis
          direction='left'
          pageIdx={this.props.pageIdx}
          setCurrPage={this.props.setCurrPage} />;
      }
      if (numPages - listEnd > 0) {
        jumpEnd = <PageLink
          pageIdx={numPages}
          setCurrPage={this.props.setCurrPage} />;
        ellipsisRight = <Ellipsis
          direction='right'
          pageIdx={this.props.pageIdx}
          numPages={numPages}
          setCurrPage={this.props.setCurrPage} />;
      }
    }

    let pagination = <ul className='pagination'></ul>;
    if (numPages > 1) {
      pagination = <ul className='pagination'>
        {chevronLeft}
        {jumpStart}
        {ellipsisLeft}
        {pageLinks}
        {ellipsisRight}
        {jumpEnd}
        {chevronRight}
      </ul>;
    }
    // markup that ties sub-components together
    return <div className='footer'>
        <ItemsPerPageSet
          dataLength={this.props.dataLength}
          setItemsPerPage={this.props.setItemsPerPage}/>
        {pagination}
      </div>;
  }
});
