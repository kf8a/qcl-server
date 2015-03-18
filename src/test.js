// var React = require('react');
// var Chart = require('chart');

var sampleData = [
  {"obs_time":"2015-03-13T13:46:56.591780436-04:00","time":"2015-03-13T13:46:56.591780673-04:00","CH4_ppm":0.4123402754160457,"H2O_ppm":0.026096100461634644,"N2O_ppm":0.8666395661212266,"CH4_dry_ppm":0.7660651807310661,"N2O_dry_ppm":0.16944737637790097},
  {"obs_time":"2015-03-13T13:46:57.596276768-04:00","time":"2015-03-13T13:46:57.596277183-04:00","CH4_ppm":0.06756085017116327,"H2O_ppm":0.4491986270429754,"N2O_ppm":0.511272966600524,"CH4_dry_ppm":0.04024044808584007,"N2O_dry_ppm":0.4889873523977489},
  {"obs_time":"2015-03-13T13:46:58.600005531-04:00","time":"2015-03-13T13:46:58.600005795-04:00","CH4_ppm":0.2679685169175858,"H2O_ppm":0.8688447503559271,"N2O_ppm":0.6417793067092801,"CH4_dry_ppm":0.49072165791604744,"N2O_dry_ppm":0.7623532536428133},
  {"obs_time":"2015-03-13T13:46:59.60406533-04:00","time":"2015-03-13T13:46:59.604065692-04:00","CH4_ppm":0.6673691346068724,"H2O_ppm":0.7347576395995034,"N2O_ppm":0.5801417069578508,"CH4_dry_ppm":0.747191513505307,"N2O_dry_ppm":0.423366983157917},
  {"obs_time":"2015-03-13T13:47:00.607292746-04:00","time":"2015-03-13T13:47:00.607293055-04:00","CH4_ppm":0.7975371047147812,"H2O_ppm":0.03619653219156714,"N2O_ppm":0.18975546374328697,"CH4_dry_ppm":0.918044429752888,"N2O_dry_ppm":0.3173900011402327},
  {"obs_time":"2015-03-13T13:47:01.607693565-04:00","time":"2015-03-13T13:47:01.607693844-04:00","CH4_ppm":0.023598203247920554,"H2O_ppm":0.63941942057643,"N2O_ppm":0.4646781771330456,"CH4_dry_ppm":0.6310235309897596,"N2O_dry_ppm":0.966272469847574},
];

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

      mydata.push(datum)

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

