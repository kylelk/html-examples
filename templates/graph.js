var graph_{{title}} = new google.visualization.DataTable();
        graph_{{title}}.addColumn('string', '{{title}}');
        graph_{{title}}.addColumn('number', '{{title}}');
        graph_{{title}}.addRows( {{data}} );

        // Set chart options
        var graph_{{title}}_options = {'title':'{{title}}',
                                    'width':{{width}},
                                    'height':{{height}}};

        // Instantiate and draw our chart, passing in some options.
        var graph_{{title}}_chart = new google.visualization.BarChart(document.getElementById('{{title}}-div'));
        graph_{{title}}_chart.draw(graph_{{title}}, graph_{{title}}_options);
      