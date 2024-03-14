
const chart1 = echarts.init(document.getElementById('main'));
const chart2 = echarts.init(document.getElementById('six'));
const chart3 = echarts.init(document.getElementById('county'));

console.log(chart1, chart2, chart3);
$("#update").click(() => {
    drawPM25();
})

// select選擇option時的監聽
$("#select_county").change(() => {
    // val=>value (選擇的option value)
    county = $("#select_county").val();
    console.log(county);
    drawCountyPM25(county);
});

window.onresize = function () {
    chart1.resize();
    chart2.resize();
    chart3.resize();
};


// 呼叫後端資料跟繪製
drawPM25();

function drawCountyPM25(county) {
    chart3.showLoading();
    $.ajax(
        {
            url: `/county-pm25-data/${county}`,
            type: "GET",
            dataType: "json",
            success: (result) => {


                drawChat(chart3, county, "PM2.5", result["site"], result["pm25"], "#007F73");
                chart3.hideLoading();
            },
            error: () => {
                alert("讀取資料失敗，請稍後在試!");
                chart3.hideLoading();
            }

        }
    )
}


function drawSixPM25() {
    chart2.showLoading();
    $.ajax(
        {
            url: "/six-pm25-data",
            type: "GET",
            dataType: "json",
            success: (result) => {


                drawChat(chart2, "六都PM2.5平均值", "PM2.5", result["site"], result["pm25"], "#4CCD99");
                chart2.hideLoading();
            },
            error: () => {
                alert("讀取資料失敗，請稍後在試!");
                chart2.hideLoading();
            }

        }
    )
}

drawPM25();
function drawPM25() {
    chart1.showLoading();
    $.ajax(
        {
            url: "/pm25-data",
            type: "GET",
            dataType: "json",
            success: (result) => {
                this.setTimeout(() => {



                    $("#pm25_high_site").text(result["highest"]["site"]);
                    $("#pm25_high_value").text(result["highest"]["pm25"]);
                    $("#pm25_low_site").text(result["lowest"]["site"]);
                    $("#pm25_low_value").text(result["lowest"]["pm25"]);


                    // document.querySelector("#pm25_high_site").innerText = result["highest"]["site"]
                    // document.querySelector("#pm25_high_value").innerText = result["highest"]["pm25"]
                    // document.querySelector("#pm25_high_site").innerText = result["highest"]["site"]
                    // document.querySelector("#pm25_high_value").innerText = result["highest"]["pm25"]



                    drawChat(chart1, result["datetime"], "PM2.5", result["site"], result["pm25"]);
                    chart1.hideLoading();

                    this.setTimeout(() => {
                        // 繪製六都平均值
                        drawSixPM25();
                        drawCountyPM25("彰化縣");
                    }, 1000);
                }, 1000);
            },
            error: () => {
                alert("讀取資料失敗，請稍後在試!");
                chart1.hideLoading();
            }

        }
    )
}

function drawChat(chart, title, legend, xData, yData, color = '#FFC700') {

    // 基于准备好的dom，初始化echarts实例


    // 指定图表的配置项和数据
    var option = {
        title: {
            text: title
        },
        tooltip: {},
        legend: {
            data: [legend]
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: [
            {
                name: legend,
                type: 'bar',
                data: yData,
                itemStyle: {
                    color: color
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    chart.setOption(option);
}

