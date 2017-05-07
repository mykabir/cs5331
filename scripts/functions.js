var graph;
var betweenness;
var colorGroup = d3.scale.category10()

d3.json("data/data.json", function (error, data) {
    graph = data;
 var linksArr = [];   
       console.log(graph.nodes[0]);

  for(var i =0; i<graph.links.length;i++){
    linksArr.push(graph.links[i].source);
    linksArr.push(graph.links[i].target);
  }

  var unique = linksArr.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
console.log(unique)
var nodestest = [];
    for(var j=0;j<graph.nodes.length;j++){
            var count = 0;
        for(k=0;k<unique.length;k++){
            if(graph.nodes[j].id==unique[k]){
                 count = 1;
                break;
            }
            

        }
         if(count == 1){
                nodestest.push(graph.nodes[j])
            }
    }

    graph.nodes = nodestest;

    
})

function adjList() {
    var adjacencyList =[];
    for(var i=0;i<graph.nodes.length;i++){
        adjacencyList[i]=[];
    }
    for (var linkitem = 0; linkitem < graph.links.length; linkitem++) {
        for (var nodeItem = 0; nodeItem < graph.nodes.length; nodeItem++) {

            if (graph.nodes[nodeItem].id == graph.links[linkitem].source) {
                graph.links[linkitem].source = nodeItem;
            }
            if (graph.nodes[nodeItem].id == graph.links[linkitem].target) {
                graph.links[linkitem].target = nodeItem;
            }
        }
    }
   graph.links.forEach(function (d) {
       adjacencyList[d.source.index].push(d.target.index);
       adjacencyList[d.target.index].push(d.source.index);
   });
    return adjacencyList;

}

function UpdateGraphProperties(){
    var avg_degree = average_node_degree(adjList());
    var graph_diameter = diameter(adjList());
    var avg_stpl = average_shortest_path_length(adjList());
    console.log(edge_betweenness_centrality(adjList()));
     $('#lblavg_degree').html(Number(avg_degree).toFixed(2));
     $('#lblgraph_diameter').html(graph_diameter);
     $('#num_node').html(graph.nodes.length);
     $('#num_link').html(graph.links.length);
     $('#lblavg_stpl').html(Number(avg_stpl).toFixed(2));


    betweenness = betweenness_centrality(adjList());
     console.log(betweenness);

     for(var i=0;i<graph.nodes.length;i++){
        if(betweenness[i])
        graph.nodes[i].betweenness = betweenness[i];
        else
         graph.nodes[i].betweenness = 0;   
     }

    $('#lblavg_degree1').html(Number(avg_degree).toFixed(2));
     $('#lblgraph_diameter1').html(graph_diameter);
     $('#num_node1').html(graph.nodes.length);
     $('#num_link1').html(graph.links.length);
     $('#lblavg_stpl1').html(Number(avg_stpl).toFixed(2));
     $('#betweenness').html(Number(avg_stpl).toFixed(2));


 

     console.log(graph)
}
function MergeTwoArrarys(arr1, arr2) {
    arr2.forEach(function (d) {
        if (arr1.indexOf(d) < 0)
            arr1.push(d);
    });
    return arr1;
}

function DrawBublleChart() {

    var proteindata = [];
    var diameter = 400, //max size of the bubbles
        color = d3.scale.category10(); //color category
    var toggle = 0;
    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#cancer_bubble")
        .append("svg")
        .attr("id", "svgbubble")
        .attr("width", diameter)
        .attr("height", "700")
        .attr("class", "bubble");
    var data = [
        {"id": "AMLE", "value": 0, "name": "Acute Myeloid Leukemia", "genes": []},
        {"id": "BASA", "value": 0, "name": "Basal Cell Carcinoma", "genes": []},
        {"id": "BLAD", "value": 0, "name": "Bladder Cancer", "genes": []},
        {"id": "BRCA", "value": 0, "name": "Breast Cancer", "genes": []},
        {"id": "CMLE", "value": 0, "name": "Chronic Myeloid Leukemia", "genes": []},
        {"id": "COLO", "value": 0, "name": "Colorectal Cancer", "genes": []},
        {"id": "ENDO", "value": 0, "name": "Endometrial Cancer", "genes": []},
        {"id": "GLIO", "value": 0, "name": "Glioma", "genes": []},
        {"id": "MELA", "value": 0, "name": "Melanoma", "genes": []},
        {"id": "nSCLC", "value": 0, "name": "Non-Small Cell Lung Cancer", "genes": []},
        {"id": "PROS", "value": 0, "name": "Prostate Cancer", "genes": []},
        {"id": "PANC", "value": 0, "name": "Pancreatic Cancer", "genes": []},
        {"id": "RENA", "value": 0, "name": "Renal Cell Carcinoma", "genes": []},
        {"id": "SCLC", "value": 0, "name": "Small Cell Lung Cancer", "genes": []},
        {"id": "THYR", "value": 0, "name": "Thyroid Cancer", "genes": []}
    ]

    graph.nodes.forEach(function (d) {
        d.comment.forEach(function (e) {
            data.forEach(function (f) {
                if (e == f.id) {
                    f.genes.push(d.id);
                    f.value = f.genes.length;
                }
            })
        })
        $('#slgenes').append($('<option>', {
            value: d.id,
            text: d.label
        }));

    })
    var nodes = bubble.nodes({children: data}).filter(function (d) {
        return !d.children;
    });
    console.log(nodes);

    //setup the chart
    var bubbles = svg.append("g")
        .attr("transform", "translate(0,80)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    //create the bubbles
    bubbles.append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .style("fill", function (d, i) {
            return color(i);
        })
        .attr("class", "state")


    bubbles.append("text")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y + 5;
        })
        .attr("text-anchor", "middle")
        .html(function (d) {
            return (d.name.substring(0, d.r / 3));
            // return d.name;
        })
        .style({
            "fill": "white",
            "font-family": "Arial",
            "font-size": "12px",
            "width": "40px"
        })

}
function UpdateGenesNetwork() {

   var div = d3.select("body")
        .append("div")  // declare the tooltip div
       .attr("class", "tooltip")              // apply the 'tooltip' class
       .style("opacity", 0);
  
    var w = window.innerWidth / 2;
    var h = window.innerHeight / 2;

    var keyc = true, keys = true, keyt = true, keyr = true, keyx = true, keyd = true, keyl = true, keym = true, keyh = true, key1 = true, key2 = true, key3 = true, key0 = true

    var focus_node = null, highlight_node = null;

    var text_center = false;
    var outline = false;

    var min_score = 0;
    var max_score = 1;

    var color = d3.scale.linear()
        .domain([min_score, (min_score + max_score) / 2, max_score])
        .range(["lime", "yellow", "red"]);

    var highlight_color = "blue";
    var highlight_trans = 0.1;

    var sizeCir = d3.scale.linear()
                    .domain([0,1])
                    .range([200,2000]);

    var size = d3.scale.pow().exponent(1)
        .domain([1, 100])
        .range([8, 24]);

    var force = d3.layout.force()
        .linkDistance(60)
        .charge(-200)
        .size([w, h]);

    var default_node_color = "#ccc";
    //var default_node_color = "rgb(3,190,100)";
    var default_link_color = "#888";
    var nominal_base_node_size = 8;
    var nominal_text_size = 10;
    var max_text_size = 24;
    var nominal_stroke = 1.5;
    var max_stroke = 4.5;
    var max_base_node_size = 36;
    var min_zoom = 0.1;
    var max_zoom = 7;
    var svg = d3.select("#geneforce").append("svg");
    var zoom = d3.behavior.zoom().scale(0.8).scaleExtent([min_zoom, max_zoom])
    var g = svg.append("g")
        .attr("transform", "translate(20,120)scale(.4,.4)");
    svg.style("cursor", "move");
    for (var linkitem = 0; linkitem < graph.links.length; linkitem++) {
        for (var nodeItem = 0; nodeItem < graph.nodes.length; nodeItem++) {

            if (graph.nodes[nodeItem].id == graph.links[linkitem].source) {
                graph.links[linkitem].source = nodeItem;
            }
            if (graph.nodes[nodeItem].id == graph.links[linkitem].target) {
                graph.links[linkitem].target = nodeItem;
            }
        }
    }

    var nodeids=[], linksid=[];
    graph.nodes.forEach(function (d) {
        nodeids.push(d.id);
    });
    graph.links.forEach(function (d) {
        linksid.push({"source":d.source,"target":d.target,"weight":1})
    });

    var community = jLouvain().nodes(nodeids).edges(linksid)();
    graph.nodes.forEach(function (d) {
        d.community = community[d.id];
    });

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();



    function update(nodes, links) {
        var linkedByIndex = {};
        links.forEach(function (d) {
            linkedByIndex[d.source.index + "," + d.target.index] = true;
        });
        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

        function hasConnections(a) {
            for (var property in linkedByIndex) {
                s = property.split(",");
                if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property])                    return true;
            }
            return false;
        }


        var link = g.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", nominal_stroke)
            .style("stroke", function (d) {
                return default_link_color;
            })


        var node = g.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag)


        node.on("dblclick.zoom", function (d) {
            d3.event.stopPropagation();
            var dcx = (window.innerWidth / 2 - d.x * zoom.scale());
            var dcy = (window.innerHeight / 2 - d.y * zoom.scale());
            zoom.translate([dcx, dcy]);
            g.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scale() + ")");


        });
        var tocolor = "fill";
        var towhite = "stroke";
        if (outline) {
            tocolor = "stroke"
            towhite = "fill"
        }
        var circle = node.append("path").attr("class", "circle_path")
            .attr("d", d3.svg.symbol()
                .size(340)
                .type(function (d) {
                    return d.type;
                }))

            .style("fill", function (d) {
               return colorGroup(d.community);
            })
            .style("stroke-width", nominal_stroke)
            .style(towhite, "white");


        var text = g.selectAll(".text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "text")
            .attr("dy", ".35em")
            .style("font-size", nominal_text_size + "px")

        if (text_center)
            text.text(function (d) {
                return d.label;
            })
                .style("text-anchor", "middle");
        else
            text.attr("dx", function (d) {
                return (size(d.size) || nominal_base_node_size);
            })
                .text(function (d) {
                    return '\u2002' + d.label;
                });

        node.on("mouseover", function (d) {
            set_highlight(d);
            // div
            //     .style("opacity", 1);
            // div	.html(
            //     '<a href='+d.url+'>' + // The first <a> tag
            //     d.label +
            //     "</a>")
            //     .style("left", (d3.event.pageX)-10 + "px")
            //     .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mousedown", function (d) {
                d3.event.stopPropagation();
                focus_node = d;
                set_focus(d)
                if (highlight_node === null) set_highlight(d)

            }).on("mouseout", function (d) {
            exit_highlight();
            div.style("opacity", 0)

        });

        d3.select(window).on("mouseup",
            function () {
                if (focus_node !== null) {
                    focus_node = null;
                    if (highlight_trans < 1) {

                        circle.style("opacity", 1);
                        text.style("opacity", 1);
                        link.style("opacity", 1);
                    }
                }

                if (highlight_node === null) exit_highlight();
            });

        function exit_highlight() {
            var circle = d3.select("#svgbubble").selectAll("circle");
            circle.style("opacity", 1);


            highlight_node = null;
            if (focus_node === null) {
                svg.style("cursor", "move");
                if (highlight_color != "white") {
                    circle.style(towhite, "white");
                    text.style("font-weight", "normal");
                    link.style("stroke", function (o) {
                        return (isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color
                    });
                }

            }
        }

        function set_focus(d) {
            if (highlight_trans < 1) {
                circle.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });

                text.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });

                link.style("opacity", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
                });
            }
        }


        function set_highlight(d) {
            svg.style("cursor", "pointer");
            if (focus_node !== null) d = focus_node;
            highlight_node = d;
            var circle = d3.select("#svgbubble").selectAll("circle");
            circle.style("opacity", function (e) {
                return d.comment.indexOf(e.id)>=0?1:0;
            });
            if (highlight_color != "white") {
                circle.style(towhite, function (o) {
                    return isConnected(d, o) ? highlight_color : "white";
                });
                text.style("font-weight", function (o) {
                    return isConnected(d, o) ? "bold" : "normal";
                });
                link.style("stroke", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color);

                });
            }
        }


        zoom.on("zoom", function () {

            var stroke = nominal_stroke;
            if (nominal_stroke * zoom.scale() > max_stroke) stroke = max_stroke / zoom.scale();
            link.style("stroke-width", stroke);
            circle.style("stroke-width", stroke);

            var base_radius = nominal_base_node_size;
            if (nominal_base_node_size * zoom.scale() > max_base_node_size) base_radius = max_base_node_size / zoom.scale();
            circle.attr("d", d3.svg.symbol()
                .size(function(d) {
                    // console.log(d);
                    return sizeCir(d.betweenness);
                })
                .type(function (d) {
                    return d.type;
                }))

            //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
            if (!text_center) text.attr("dx", function (d) {
                return (size(d.size) * base_radius / nominal_base_node_size || base_radius);
            });

            var text_size = nominal_text_size;
            if (nominal_text_size * zoom.scale() > max_text_size) text_size = max_text_size / zoom.scale();
            text.style("font-size", text_size + "px");

            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });

        svg.call(zoom);

        resize();
        //window.focus();
        d3.select(window).on("resize", resize).on("keydown", keydown);

        force.on("tick", function () {

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            text.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
        });

        function resize() {
            var width = window.innerWidth, height = window.innerHeight;
            svg.attr("width", width).attr("height", height);

            force.size([force.size()[0] + (width - w) / zoom.scale(), force.size()[1] + (height - h) / zoom.scale()]).resume();
            w = width;
            h = height;
        }

        function keydown() {
            if (d3.event.keyCode == 32) {
                force.stop();
            }
            else if (d3.event.keyCode >= 48 && d3.event.keyCode <= 90 && !d3.event.ctrlKey && !d3.event.altKey && !d3.event.metaKey) {
                switch (String.fromCharCode(d3.event.keyCode)) {
                    case "C":
                        keyc = !keyc;
                        break;
                    case "S":
                        keys = !keys;
                        break;
                    case "T":
                        keyt = !keyt;
                        break;
                    case "R":
                        keyr = !keyr;
                        break;
                    case "X":
                        keyx = !keyx;
                        break;
                    case "D":
                        keyd = !keyd;
                        break;
                    case "L":
                        keyl = !keyl;
                        break;
                    case "M":
                        keym = !keym;
                        break;
                    case "H":
                        keyh = !keyh;
                        break;
                    case "1":
                        key1 = !key1;
                        break;
                    case "2":
                        key2 = !key2;
                        break;
                    case "3":
                        key3 = !key3;
                        break;
                    case "0":
                        key0 = !key0;
                        break;
                }

                link.style("display", function (d) {
                    var flag = vis_by_type(d.source.type) && vis_by_type(d.target.type) && vis_by_node_score(d.source.score) && vis_by_node_score(d.target.score) && vis_by_link_score(d.score);
                    linkedByIndex[d.source.index + "," + d.target.index] = flag;
                    return flag ? "inline" : "none";
                });
                node.style("display", function (d) {
                    return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
                });
                text.style("display", function (d) {
                    return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
                });

                if (highlight_node !== null) {
                    if ((key0 || hasConnections(highlight_node)) && vis_by_type(highlight_node.type) && vis_by_node_score(highlight_node.score)) {
                        if (focus_node !== null) set_focus(focus_node);
                        set_highlight(highlight_node);
                    }
                    else {
                        exit_highlight();
                    }
                }

            }
        }



        function vis_by_type(type) {
            switch (type) {
                case "circle":
                    return keyc;
                case "square":
                    return keys;
                case "triangle-up":
                    return keyt;
                case "diamond":
                    return keyd;
                case "cross":
                    return keyx;
                case "triangle-down":
                    return keyr;
                default:
                    return true;
            }
        }

        function vis_by_node_score(score) {
            if (isNumber(score)) {
                if (score >= 0.666) return keyh;
                else if (score >= 0.333) return keym;
                else if (score >= 0) return keyl;
            }
            return true;
        }

        function vis_by_link_score(score) {
            if (isNumber(score)) {
                if (score >= 0.666) return key3;
                else if (score >= 0.333) return key2;
                else if (score >= 0) return key1;
            }
            return true;
        }

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    }

    function update_transparent(protein) {
        var selectednodes =g.selectAll(".node");
        var selectedlinks = g.selectAll(".link");
        var selectedtext = g.selectAll(".text");
        selectedlinks.style("opacity",function (d) {
            if(protein.indexOf(d.source.id)===-1||protein.indexOf(d.target.id)===-1) return 0.1
        })
        selectednodes.style("opacity",function(d){
            if(protein.indexOf(d.id)===-1) return 0.1;
        });
        selectedtext.style("opacity",function(d){
            if(protein.indexOf(d.id)===-1) return 0.1;
        });

    }

    update(graph.nodes, graph.links);
    var bubblechart = d3.select("#svgbubble").selectAll("circle");
    bubblechart.on("click", function (d, i) {
        var store_protein = [];
        var e = d3.event,
            isSelected = d3.select(this).classed("selected");

        if (!e.ctrlKey && !e.metaKey) {
            d3.selectAll('circle.selected').classed("selected", false);
        }

        d3.select(this).classed("selected", !isSelected);
        var selectedvalue = d3.select("#svgbubble").selectAll('.selected')
        selectedvalue.each(function (d, i) {
            store_protein.push(d.genes);
        })
        var protein = store_protein[0];
        for (i = 1; i < store_protein.length; i++) {
            protein = _.intersection(protein, store_protein[i])
        }
        var node_filter = graph.nodes.filter(function (d) {
            if (protein.indexOf(d.id) >= 0) {
                return d
            }
        })

        var
            newlink = graph.links.filter(function (d) {
                if (protein.indexOf(d.source.id) >= 0 && protein.indexOf(d.target.id) >= 0) {
                    return d;
                }
            })
        update_transparent(protein);
        $('#slgenes').children().remove();
        $.each(node_filter, function (i, item) {
            $('#slgenes').append($('<option>', {
                value: item.id,
                text: item.label
            }));
            $('#slgenes').multiselect('destroy');
            $('#slgenes').multiselect({
                enableFiltering: true,
                includeSelectAllOption: true,
                maxHeight: 300
            });
        });


        $("#slgenes")
            .change(function () {
                var str = [];
                $("select option:selected").each(function () {
                    str.push($(this).val());
                });
                update_transparent(protein=str)


            })


    })

}