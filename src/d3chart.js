var d3Chart = {};

d3Chart.elements = {};

d3Chart.create = function(el, props, state) {
  var height = props.height
  var width =  props.width
  var data  =  state.data
  var margin = {top: 20, right: 20, bottom: 20, left: 40}

  var svg = d3.select(el).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  this.elements.svg = svg;

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  var x = d3.time.scale()
      .domain([d3.min(data, function(d) {return d.time}), 
               d3.max(data, function(d) {return d.time})])
      .range([0, state.width]);
  this.elements.x = x;

  var y = d3.scale.linear()
    .domain([2.2, 4.5])
    .range([state.height, 0]);
  this.elements.y = y

  var line = d3.svg.line()
    .x(function(d, i) { return x(d.time); })
    .y(function(d, i) { return y(d.value); });
  this.elements.line = line;

  xAxis = d3.svg.axis().scale(x).orient("top");

  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  yAxis = d3.svg.axis().scale(y).orient("left");

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

  svg.append("g").
    attr("class", "circles")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 3.5)
    .attr("cx", x(function(d) {return(d.time)}))
    .attr("cy", y(function(d) {return(d.value)}))


  // this.elements.path = svg.append("g")
  //   .attr("clip-path", "url(#clip)")
  //   .append("path")
  //   .datum(state.data)
  //   .attr("class", "line")
  //   .attr("d", line);

  return(this);
};

d3Chart.update = function(el, state) {

  var data = state.data;
  // if (data.length == 0) { return }

  var svg = d3.select(el).select('svg');

  // Re-compute the elements, and render the data points
  var x = this.elements.x;
  x.domain([d3.min(data, function(d) {return d.time}), 
           d3.max(data, function(d) {return d.time})]);
  svg.select(".x.axis")
    .transition().duration(100).call(xAxis);

  var y = this.elements.y;
  y.domain([d3.min(data, function(d) { return d.value}), 
           d3.max(data, function(d) {return d.value})]);
  svg.select(".y.axis")
    .transition().duration(100).call(yAxis);

  // redraw the line, and slide it to the left
  var path = svg.select("path.line"); 
  var line = this.elements.line;

  var tr = d3.min(data, function(d) {return d.time});

  svg.select(".circles").selectAll("circle")
    .data(data)
    .transition()
    .duration(100)
    .attr("r",2)
    .attr("cx", function(d) {return x(d.time)})
    .attr("cy", function(d) { return y(d.value)})

  svg.select(".circles").selectAll("cirlce")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 2)
    .attr("cx", function(d) {
      return x(d.time);
    })
    .attr("cy", function(d) { return y(d.value)})

  svg.select(".circles").selectAll("circle")
    .data(data)
    .exit()
    .remove()

  // if (data.length == 0 ) {
  //   path.datum(data)
  // } else {
  // path
  //   .attr("d", line)
  //   .attr("transform", null)
  //   .transition()
  //   .duration(100)
  //   .ease("linear")
  //   .attr("transform", "translate(" + x(tr-1) + ",0)");
  // }
};

d3Chart._x = function() {
};
d3Chart.destroy = function(el) {
  // Any clean-up would go here
};

// module.exports = d3Chart;
