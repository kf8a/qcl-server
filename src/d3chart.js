var d3Chart = {};

d3Chart.create = function(el, props, state) {

  var height = 240 //props.height
  var width =  960 //props.width
  var data  =  state.data
  console.log(data)
  var margin = {top: 20, right: 20, bottom: 20, left: 40}

  var svg = d3.select(el).append('svg')
  .attr('class', 'd3')
  .attr('width', width)
  .attr('height', height);

  state.x = d3.time.scale()
      .domain([d3.min(data, function(d) {return d.obs_time}), 
               d3.max(data, function(d) {return d.obs_time})])
      .range([0, width]);

  state.y = d3.scale.linear()
    .domain([2.2, 4.5])
    .range([height, 0]);

  var line = d3.svg.line()
    state.x(function(d, i) { return x(d.obs_time); })
    state.y(function(d, i) { return y(d.CH4_ppm); });

  state.svg = d3.select(el).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  state.svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  state.xAxis = d3.svg.axis().scale(state.x).orient("top");

  state.svg.append("g")
  .attr("class", "x axis")
  .call(state.xAxis);

  state.yAxis = d3.svg.axis().scale(state.y).orient("left");

  state.svg.append("g")
  .attr("class", "y axis")
  .call(state.yAxis);

  state.path = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", state.line);

  this.update(el, props, state);
};

d3Chart.update = function(el, props, state) {
  var data = state.data;
  // Re-compute the scales, and render the data points
      state.x.domain([d3.min(data, function(d) {return d.obs_time}), 
               d3.max(data, function(d) {return d.obs_time})]);
      state.svg.select(".x.axis")
        .transition().duration(100).call(state.xAxis);

      state.y.domain([d3.min(data, function(d) { return d.CH4_ppm}), 
               d3.max(data, function(d) {return d.CH4_ppm})]);
      state.svg.select(".y.axis")
        .transition().duration(100).ease('cubic').call(state.yAxis);

      // redraw the line, and slide it to the left
      if (data.length > 50) {
        var tr = d3.min(data, function(d) {return d.obs_time});
        state.path
          .attr("d", state.line)
          .attr("transform", null)
          .transition()
          .duration(100)
          .ease("linear")
          .attr("transform", "translate(" + state.x(tr-1) + ",0)");

      } else {
        state.path
        .attr("d", state.line);
      }
  // var scales = this._scales(el, state.domain);
  // this._drawPoints(el, scales, state.data);
};

d3Chart.destroy = function(el) {
  // Any clean-up would go here
};

// module.exports = d3Chart;
