$(function() {

  var conn;
  var log = $("#log");

  var n = 0,
    data = d3.range(n).map(function() { return 0; });

  var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .domain([d3.min(ch4, function(d) {return d.obs_time}), 
               d3.max(ch4, function(d) {return d.obs_time})])
      .range([0, width]);

  var y = d3.scale.linear()
    .domain([2.2, 4.5])
    .range([height, 0]);

  var line = d3.svg.line()
    .x(function(d, i) { return x(d.obs_time); })
    .y(function(d, i) { return y(d.CH4_ppm); });

  var svg = d3.select("#ch4").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

  var xAxis = d3.svg.axis().scale(x).orient("top");

  svg.append("g")
  .attr("class", "x axis")
  // .attr("transform", "translate(0," + y(0) + ")")
  .call(xAxis);

  var yAxis = d3.svg.axis().scale(y).orient("left");

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

  var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  function appendLog(msg) {
    var d = log[0];
    var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
    msg.appendTo(log);
    if (doScroll) {
      d.scrollTop = d.scrollHeight - d.clientHeight;
    }
  }

  if (window["WebSocket"]) {
    conn = new WebSocket("ws://" + location.host + "/ws");
    conn.onclose = function(evt) {
      appendLog($("<div><b>Connection closed.</b></div>"))
    }
    conn.onmessage = function(evt) {
      appendLog($("<div/>").text(evt.data));
      datum = JSON.parse(evt.data);

      datum.obs_time = new Date(datum.obs_time);
      datum.time = new Date(datum.time);

      data.push(datum);
      // update the domain

      x.domain([d3.min(data, function(d) {return d.obs_time}), 
               d3.max(data, function(d) {return d.obs_time})]);
      svg.select(".x.axis").transition().duration(300).call(xAxis);

      y.domain([d3.min(data, function(d) { return d.CH4_ppm}), 
               d3.max(data, function(d) {return d.CH4_ppm})]);
      svg.select(".y.axis").transition().duration(300).ease('cubic').call(yAxis);

      // redraw the line, and slide it to the left
      if (data.length > 50) {
        var tr = d3.min(data, function(d) {return d.obs_time});
        path
          .attr("d", line)
          .attr("transform", null)
          .transition()
          .duration(500)
          .ease("linear")
          .attr("transform", "translate(" + x(tr-1) + ",0)");

        // pop the old data point off the front
        data.shift();
      } else {
        path
        .attr("d", line);
      }

    }
  } else {
    appendLog($("<div><b>Your browser does not support WebSockets.</b></div>"))
  }

});
