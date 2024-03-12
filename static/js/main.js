
const chart1 = echarts.init(document.getElementById('main'));
const chart2 = echarts.init(document.getElementById('six'));



$('#update').click(() => {
    drawPM25();
})

function drawSixPM25() {
    chart2.showLoading();
    $.ajax(
        {
            url: "/six-pm25-data",
            type: "GET",
            dataType: "json",
            success: (result) => {


                drawChat(chart2, "六都PM2.5平均值", "PM2.5", result["site"], result["pm25"]);
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
                    drawSixPM25();
                }, 1000);
            },
            error: () => {
                alert("讀取資料失敗，請稍後在試!");
                chart1.hideLoading();
            }

        }
    )
}

function drawChat(chart, title, legend, xData, yData) {

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
                data: yData
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    chart.setOption(option);
}

