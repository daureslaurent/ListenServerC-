var randomColor = function(){
    return Math.random() * Math.floor(255);
}

var setLoadOneData = function(id, path){
    
    var ctx = document.getElementById(id).getContext('2d');
    var chartObj = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: {},
        options: {}
    });



    doReqCb(path, function(dataGraph){
        var endData = {
            label: 'Request',
            backgroundColor: 'rgba('+randomColor()+', '+randomColor()+', '+randomColor()+', 0.8)',
            data: dataGraph.data
        };
        console.log(dataGraph)
        chartObj.data.labels = dataGraph.labels;
        chartObj.data.datasets = [endData];

        chartObj.options.title.text = 'time: '+dataGraph.timeProc;
        chartObj.update();
    });
}

var doReqCb = function(path, cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText))
        }
    };
    xhttp.open("GET", path, true);
    xhttp.send();
};

var setLoadChart = function(id, path, progressIdHtml, isDot){
    var progressId = document.getElementById(progressIdHtml);

    var type = isDot?'pie':'bar';
    var ctx = document.getElementById(id).getContext('2d');
    var chartObj = new Chart(ctx, {
        // The type of chart we want to create
        type: type,
        // The data for our dataset
        data: {},
        options: {
            title : {
                display : true
            }
        }
    });

    doReqCb(path, function(data){
    if (isDot)
        graphSetDot(data, chartObj, progressId, id);
    else
        graphSetClassic(data, chartObj, progressId, id);
    });
};

var graphSetClassic = function(dataGraph, chartObj, progressId, chartId){
    console.log(dataGraph)
    //Format data for chart
    var listData = new Array();
    for (i = 0; i < dataGraph.data.length; i++) {
        var dataPort = dataGraph.data[i];
        var endLabel;
        if (dataGraph.portList == null){
            endLabel = dataGraph.labels[i];
        }
        else {
            endLabel = dataGraph.portList[i];
        }
        console.log(endLabel)
        var endData = {
            label: endLabel,
            backgroundColor: 'rgba('+randomColor()+', '+randomColor()+', '+randomColor()+', 0.8)',
            data: dataPort
        };
        listData.push(endData);
    }
    chartObj.data.labels = dataGraph.labels;
    chartObj.data.datasets = listData;
    chartObj.options.title.text = 'time: '+dataGraph.timeProc;
    progressId.style.visibility = "hidden";
    document.getElementById(chartId).style.visibility = "visible";
    chartObj.update({duration: 1000, easing: 'easeOutElastic'});
};

var graphSetDot = function(dataGraph, chartObj, progressId, chartId){
    //console.log(dataGraph)
    var listColor = new Array();
    for (i = 0; i < dataGraph.labels.length; i++) {
        listColor.push('#'+Math.floor(Math.random()*16777215).toString(16));
    }
    data = {
        datasets: [{data: dataGraph.data, backgroundColor: listColor}],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: dataGraph.labels
    };

    chartObj.data = data;
    progressId.style.visibility = "hidden";
    document.getElementById(chartId).style.visibility = "visible";
    chartObj.update();
};