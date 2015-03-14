var Chart = React.createClass({
  render: function() {
    return( <div>I am a chart</div>);
  }
});

var QCL = React.createClass({
  render: function() {
    return(
      <div id="app">
      <Chart />
      <Chart />
        </div>
    )
  }
})
  React.render(<QCL />, document.getElementById("example"));
