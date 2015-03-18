'use strict';

// var React = require('react');
// var Chart = require('chart');

var App = React.createClass({

  loadDataFromServer:  function() {
  },

  getInitialState: function() {
    return { data: []};
  },

  componentDidMount: function() {
    this.requestData();
  },

  render: function() {
    return (
      <div className="App">
      <Chart
      data={this.state.data} />
      </div>
    );
  },

  requestData: function() {
    var socket = this.props.socketService;

    socket.onDataReceived(function (datum) {
      datum.obs_time = new Date(datum.obs_time);
      datum.time = new Date(datum.time);
      var mydata = this.state.data;

      mydata.push(datum);
      if (mydata.length > 50) {
        mydata.shift();
      };

      this.setState({data: mydata});
    }.bind(this));
  }

});

var socketService = new SocketService({
    path: '/ws'
});

React.render(
  < App socketService={socketService} />, 
  document.getElementById('example')
)

