'use strict';

// var React = require('react');
// var Chart = require('chart');

var App = React.createClass({

  getInitialState: function() {
    return { 
      data: [],
      ch4: [],
      n2o: [],
      co2: []
    };
  },

  componentDidMount: function() {
    this.requestData();
  },

  render: function() {
    return (
      <div className="App">
      <Chart
      data={this.state.co2} />
      <Chart
      data={this.state.n2o} />
      <Chart
      data={this.state.ch4} />
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
      var myco2 = this.state.co2;
      myco2.push({time: datum.obs_time, value: datum.CO2_ppm})
      var myn2o = this.state.n2o;
      myn2o.push({time: datum.obs_time, value: datum.N2O_dry_ppm})
      var mych4 = this.state.ch4;
      mych4.push({time: datum.obs_time, value: datum.CH4_dry_ppm})

      if (mydata.length > 50) {
        mydata.shift();
        myco2.shift();
        myn2o.shift();
        mych4.shift()
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

