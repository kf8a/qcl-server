'use strict';

// var React = require('react');
// var Chart = require('chart');

var App = React.createClass({

  getInitialState: function() {
    return { 
      data: [],
      ch4: [],
      n2o: [],
      co2: [],
      text: "Record",
      state: 'freerun',
      n2o_flux: 0,
      co2_flux: 0,
      ch4_flux: 0
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
      <form onSubmit={this.handleSubmit}>
        <button>{ this.state.text}</button>
      </form>
      <Result 
        n2o={this.state.n2o_flux} 
        co2={this.state.co2_flux} 
        ch4={this.state.ch4_flux}/>
      </div>
    );
  },

  resetData: function() {
    this.setState({data: [], co2:[], ch4:[], n2o:[]});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.resetData();
    if (this.state.state == 'freerun') {
      this.setState({text: 'Save', 
                    state: 'record',
                    now: new Date()})
    } else {
      this.setState({text: 'Record', state: 'freerun'})
      // send data back to server
    }
  },

  prepareData: function(datum) {
      this.state.data.push(datum);
      // var myco2 = this.state.co2.concat({ time: datum.obs_time, value: datum.CO2_ppm})
      this.state.co2.push({time: datum.obs_time, value: datum.CO2_ppm})
      this.state.n2o.push({time: datum.obs_time, value: datum.N2O_dry_ppm})
      this.state.ch4.push({time: datum.obs_time, value: datum.CH4_dry_ppm})

      if (this.state.data.length > 200) {
        this.state.data.shift();
        this.state.co2.shift();
        this.state.n2o.shift();
        this.state.ch4.shift()
      };

      this.setState({data: this.state.data, 
                    co2: this.state.co2,
                    ch4: this.state.ch4, 
                    n2o: this.state.n2o});
  },

  computeFluxes: function() {
    if (this.state.data.length < 2) {return; };
    var n2o_flux = this.computeFlux(this.state.n2o);
    var co2_flux = this.computeFlux(this.state.co2);
    var ch4_flux = this.computeFlux(this.state.ch4);
    this.setState({n2o_flux: n2o_flux['slope'], 
                  co2_flux: co2_flux['slope'], 
                  ch4_flux: ch4_flux['slope']});
  },

  computeFlux: function(data) {
    var x = data.map(function(e, now) {
      return (e.time.valueOf() - this.state.now.valueOf());
    }, this);
    var y = data.map(function(e) {
      return e.value;
    });
    return(this.linearRegression(x,y));
  },

  linearRegression: function(x,y) {
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
  },

  requestData: function() {
    var socket = this.props.socketService;

    socket.onDataReceived(function (datum) {
      datum.obs_time = new Date(datum.obs_time);
      datum.time = new Date(datum.time);

      this.prepareData(datum);
      if (this.state.state == 'record') {
        this.computeFluxes();
      }
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

