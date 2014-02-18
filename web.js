
    var nodes = {};
    // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
    // http://stackoverflow.com/questions/19111581/d3js-force-directed-on-hover-to-node-highlight-colourup-linked-nodes-and-link
    // http://jsfiddle.net/christopheviau/UutQj/
    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
      link.source.icon = link.icon;
    });
    
    var width = 1400, height = 1200;
    fill = d3.scale.category20();
    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(120)
        .charge(-300)
        .on("tick", tick)
        .start();
    
    var svg = d3.select("#main-page").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all")
        .append('svg:g')
        .call(d3.behavior.zoom().on("zoom", redraw))
        .append('svg:g');


    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
      .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    
    var path = svg.append("g").selectAll("path")
        .data(force.links())
      .enter().append("path")
        .attr("class", function(d) { 
            return "link " + d.type; 
        }).attr("marker-end", function(d) { 
            return "url(#" + d.type + ")"; });
        
    var image = svg.append("g").selectAll("image")
        .data(force.nodes())
        .enter().append("image")
        .attr("xlink:href", function(d) { return d.icon; })
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 20)
        .attr("height", 20)
     .style("stroke", function(d) {
        return d3.rgb(fill(d.group)).darker();
    }).call(force.drag)
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
      .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) { return d.name; });

    function redraw() {
        console.log("here", d3.event.translate, d3.event.scale);
        svg.attr("transform",
                 "translate(" + d3.event.translate + ")"
                 + " scale(" + d3.event.scale + ")");
    }
    var linkedByIndex = {};
        links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }
    
    function fade(opacity) {
        return function(d) {
            image.style("opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                
                this.setAttribute('opacity', thisOpacity);
                return thisOpacity;
            });
            text.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });
            path.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
//            if (opacity == .1){
//                image.attr("width", 40).attr("height", 40);
//            }else{
//                image.attr("width", 20).attr("height", 20);
//            } 
        };
    }

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
      path.attr("d", linkArc);
    
      text.attr("transform", transform);
      image.attr("transform", transform);
    }
    
    function linkArc(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }
    
    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
    