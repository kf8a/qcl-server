// var d3Chart = require('d3Chart');

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    this.d3Chart = d3Chart.create(el, {
      width: 960,
      height: 300
    }, this.getChartState());
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.data,
      width: 960,
      height: 300
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      <div className="Chart">
      </div>
    );
  }
});

// module.exports = Chart;
