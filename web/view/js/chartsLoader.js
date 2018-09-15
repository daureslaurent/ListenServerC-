var randomColor = function(){
    return Math.random() * Math.floor(255);
}

var setLoadChart = function(id, path, isDot){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (isDot)
                graphSetDot(JSON.parse(this.responseText), id);
            else
                graphSetClassic(JSON.parse(this.responseText), id);
        }
    };
    xhttp.open("GET", path, true);
    xhttp.send();
};

var graphSetClassic = function(dataGraph, chartName){
    //console.log(dataGraph)
    var ctx = document.getElementById(chartName).getContext('2d');

    //Format data for chart
    var listData = new Array();
    for (i = 0; i < dataGraph.data.length; i++) {
        var dataPort = dataGraph.data[i];
        var endData = {
            label: "Port "+ dataGraph.portList[i],
            backgroundColor: 'rgba('+randomColor()+', '+randomColor()+', '+randomColor()+', 0.8)',
            data: dataPort
        };
        listData.push(endData);
        //console.log(endData);
    }

    var chartVar = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {
            labels: dataGraph.labels,
            datasets: listData
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
};

var graphSetDot = function(dataGraph, chartName){
    //console.log(dataGraph)
    var ctx = document.getElementById(chartName).getContext('2d');

    var listColor = new Array();
    for (i = 0; i < dataGraph.labels.length; i++) {
        listColor.push('#'+Math.floor(Math.random()*16777215).toString(16));
    }
    data = {
        datasets: [{data: dataGraph.data}],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: dataGraph.labels
    };

    var chartVar = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',
        // The data for our dataset
        data: data,
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
};