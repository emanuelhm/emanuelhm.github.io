var isPieSelected = true;

var colors = [
		'rgba(25,25,112,0.5)',
		'rgba(0,0,255,0.5)',
		'rgba(0,206,209,0.5)',
		'rgba(75,0,130,0.5)',
		'rgba(255,0,0,0.5)',
		'rgba(255,69,0,0.5)',
		'rgba(0,100,0,0.5)',
		'rgba(139,69,19,0.5)',
		'rgba(255,255,0,0.5)',
		'rgba(255,215,0,0.5)',
];

function ResizeColors(size){
    var aux = colors;
    while (aux.length < size)
        aux.concat(colors);
    return aux;
}

var barChartConfig = {
    type: 'bar',
    data: {
        datasets: [
            {
                data: [],
                backgroundColor: {},
            }
        ],
        labels: []
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Quantidade de pontos'
                }
            }]
        },
        responsive: true,
        title:{
            display: true,
            text: ""
        },
        legend:{
            display: false
        },
    }
};

var pieChartConfig = {
    type: 'pie',
    data: {
        datasets: [{
            data: [],
            backgroundColor: {},
        }],
        labels: []
    },
    options: {
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                    var total = 0;
                    for (var i in allData)
                        total += allData[i];
                    var tooltipPercentage = Math.round((allData[tooltipItem.index] / total) * 100);
                    return data.labels[tooltipItem.index] + ': ' + tooltipPercentage + "%";
                }
            }
        },
        responsive: true,
        title:{
            display: true,
            text: ""
        },
        legend:{
            display: true
        },
    }
}; 

var ganttChartConfig = {
    type: 'horizontalBar',
    month: "",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: "rgba(0,0,0,0)",
        },
        {
            data: [],
            backgroundColor: {},
        }]
    },
    options: {
        title:{
            display: true,
            text: ""
        },
        tooltips: {
            filter: function (tooltipItem) {
                return tooltipItem.datasetIndex === 1;
            },
        },
        scales: {
            xAxes: [{
                label:"Duration",
                stacked: true,
                ticks: {
                    min: 1,
                    max: 0,
                    stepSize: 1,
                    beginAtZero: false,
                    callback: function(label, index, labels) {
                        return label + " de " + ganttChartConfig.month;
                    }
                },
            }],
            yAxes: [{
                stacked: true
            }]
        },
        legend:{
            display:false
        },
    }
};

$(document).ready(function () {
    if($("#chartContainer").data("id") != undefined){
        $.post("/Chart/Index", { Id: $("#chartContainer").data("id") }, function(data){
            if (data.Response != "Error")
            {
                if(data.model.Data.length === 0)
                    $("#chartContainer").hide();
                else{
                    var integrantes = "";
                    $.each(data.Integrantes, function(index, value){
                        integrantes += `<option value="${value.Id}" data-isCurrentUser="${value.IsCurrentUser}">${value.Nome}</option>`;
                    })
                    $("#integrantesChart").append(integrantes);

                    var quests = "";
                    $.each(data.Quests, function(index, value){
                        quests += `<option value="${value.Id}">${value.Nome}</option>`;
                    })
                    $("#questsChart").append(quests);

                    barChartConfig.data.datasets[0].data = data.model.Data;
                    barChartConfig.data.datasets[0].backgroundColor = ResizeColors(data.model.Data.length);;
                    barChartConfig.data.labels = data.model.Labels;
                    barChartConfig.options.title.text = data.model.Title;

                    var ctx = document.getElementById("chart").getContext("2d");
                    window.chart = new Chart(ctx, barChartConfig);
                }
            }
            else{
                $("#divChart").hide();
                showBalloon("Algo deu errado", "yellow-alert");
            }

        })
        .fail(function() {
            $("#divChart").hide();
            showBalloon("Algo deu errado", "yellow-alert");
        })
        .always(function(){
            $("#loading").hide();
        });
    }
});

$("#btnBarChart").on("click", function(){
    $("#integrantesChart").show();
    $("#questsChart").hide();
    barChart("");
    $("#integrantesChart").val("");
});

$("#btnPieChart").on("click", function(){
    isPieSelected = true;
    if (questsChart.options.length === 0){
        showBalloon("O grupo ainda não tem Quests", "yellow-alert");
    }
    else{
        $("#integrantesChart").hide();
        $("#questsChart").show();
        pieChart(questsChart.options[0].value);
    }
});

$("#btnGanttChart").on("click", function(){
    isPieSelected = false;
    if (questsChart.options.length === 0){
        showBalloon("O grupo ainda não tem Quests", "yellow-alert");
    }
    else{
        $("#integrantesChart").hide();
        $("#questsChart").show();
        ganttChart(questsChart.options[0].value);
    }
});

$("#questsChart").change(function(){
    if(isPieSelected)
        pieChart($("#questsChart").val());
    else
        ganttChart($("#questsChart").val());
});

function pieChart(index){
    if(window.chart != undefined)
        window.chart.destroy();

    $("#loading").show();

    $.post("/Chart/PieChart", { Id: index }, function(data) {
        if (data.Response === "Ok"){
            $("#divChart").show();
            pieChartConfig.data.datasets[0].data = data.Data;
            pieChartConfig.data.datasets[0].backgroundColor = ResizeColors(data.Data.length);;
            pieChartConfig.data.labels = data.Labels;
            pieChartConfig.options.title.text = data.Title;

            var ctx = document.getElementById("chart").getContext("2d");
            window.chart = new Chart(ctx, pieChartConfig);
        }
        else{
            $("#divChart").hide();
            showBalloon("Algo deu errado", "yellow-alert");
        }
            
    })
    .fail(function() {
        $("#divChart").hide();
        showBalloon("Algo deu errado", "yellow-alert");
    })
    .always(function(){
        $("#loading").hide();
    });
}

function barChart(index){
    if(window.chart != undefined)
        window.chart.destroy();

    $("#loading").show();

    if (index == ""){
        var path = "/Chart/BarChartGrupo";
        var data = { Id: $("#chartContainer").data("id") };
    }
    else{
        var path = "/Chart/BarChartIntegrante";
        var data = { GrupoId: $("#chartContainer").data("id"), UserId: index };
    }

    $.post(path, data, function(data) {
        if(data.Response === "Ok"){
            $("#divChart").show();
            barChartConfig.data.datasets[0].data = data.Data;
            barChartConfig.data.datasets[0].backgroundColor = ResizeColors(data.Data.length);;
            barChartConfig.data.labels = data.Labels;
            barChartConfig.options.title.text = data.Title;

            var ctx = document.getElementById("chart").getContext("2d");
            window.chart = new Chart(ctx, barChartConfig);
        }
        else{
            $("#divChart").hide();
            showBalloon("Algo deu errado", "yellow-alert");
        }
    })
    .fail(function() {
        showBalloon("Algo deu errado", "yellow-alert");
    })
    .always(function(){
        $("#loading").hide();
    });
}

function ganttChart(index){
    if(window.chart != undefined)
        window.chart.destroy();

    $("#loading").show();

    $.post("/Chart/GanttChart", { Id: index }, function(data) {

        if(data.Response === "Ok"){
            ganttChartConfig.data.datasets[0].data = data.Offset;

            for(var x = 0; x < data.Data.length; x++)
                if(data.Data[x] === 0)
                    data.Data[x] = 0.5
            
            ganttChartConfig.data.datasets[1].data = data.Data;
            ganttChartConfig.data.datasets[1].backgroundColor = ResizeColors(data.Data.length);;
            ganttChartConfig.data.labels = data.Labels;
            ganttChartConfig.options.title.text = data.Title;
            ganttChartConfig.month = data.Month;
            ganttChartConfig.options.scales.xAxes[0].ticks.max = data.DaysInMonth;

            $("#loading").hide();

            var ctx = document.getElementById("chart").getContext("2d");
            window.chart = new Chart(ctx, ganttChartConfig);
        }
        else{
            $("#divChart").hide();
            showBalloon("Algo deu errado", "yellow-alert");
        }
    })
    .fail(function() {
        $("#divChart").hide();
        showBalloon("Algo deu errado", "yellow-alert");
    })
    .always(function(){
        $("#loading").hide();
    });
}