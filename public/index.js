$(function() {

  var conn;
  var log = $("#log");

  var n = 40,
    random = d3.random.normal(0, .2),
    ch4 = d3.range(n).map(random);

  var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3.scale.linear()
  .domain([0, n - 1])
  .range([0, width]);

  var y = d3.scale.linear()
  .domain([2.2, 4.5])
  .range([height, 0]);

  var line = d3.svg.line()
  .x(function(d, i) { return x(i); })
  .y(function(d, i) { return y(d); });

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

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + y(0) + ")")
  .call(d3.svg.axis().scale(x).orient("bottom"));

  svg.append("g")
  .attr("class", "y axis")
  .call(d3.svg.axis().scale(y).orient("left"));

  var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(ch4)
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
    conn = new WebSocket("ws://127.0.0.1:9000/ws");
    conn.onclose = function(evt) {
      appendLog($("<div><b>Connection closed.</b></div>"))
    }
    conn.onmessage = function(evt) {
      appendLog($("<div/>").text(evt.data));
      data = JSON.parse(evt.data)
      console.log(data.CH4_dry_ppm)

      // push data onto the array
      ch4.push(data.CH4_dry_ppm)

      // // redraw the line, and slide it to the left
      path
        .attr("d", line)
        .attr("transform", null)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)")

      // pop the old data point off the front
      ch4.shift();

    }
  } else {
    appendLog($("<div><b>Your browser does not support WebSockets.</b></div>"))
  }
});
