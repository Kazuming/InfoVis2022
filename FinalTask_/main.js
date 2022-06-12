
d3.csv("https://kazuming.github.io/InfoVis2022/FinalTask/nhk_news_covid19_prefectures_daily_data.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d["日付"] = d["日付"];
            d["都道府県コード"] = +d["都道府県コード"];
            d["都道府県名"] = +d["都道府県名"];
            d["各地の感染者数_1日ごとの発表数"] = +d["各地の感染者数_1日ごとの発表数"];
            d["各地の感染者数_累計"] = ++d["各地の感染者数_累計"];
            d["各地の死者数_1日ごとの発表数"] = +d["各地の死者数_1日ごとの発表数"];
            d["各地の死者数_累計"] = +d["各地の死者数_累計"];
            d["各地の直近1週間の人口10万人あたりの感染者数"] = +d["各地の直近1週間の人口10万人あたりの感染者数"];
        });

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: '日付',
            cscale: color_scale
        }, input_data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });






// 237カ国
d3.csv("https://kazuming.github.io/InfoVis2022/W04/WHO-COVID-19-global-table-data.csv", draw);
function draw(data){
    // http://defghi1977.html.xdomain.jp/tech/svgMemo/svgMemo_20.htm
    data.shift()
    var max_cases = 100000000
    var x_padding = 50;
    var y_padding = 30;
    var width = 1200;
    var height = 5000;
    var name_width = 150;
    var bar_width = width-2*x_padding-name_width;
    var total_space = 800
    var canvas = d3.select("body");
    var svg = canvas.append("svg")
        .attr("width",width)
        .attr("height",height)
        .attr("shape-rendering", "crispEdges");    //アンチエイリアスを無効にする．
    //スケール
    var scaleX = d3.scale.linear()
        .domain([0, max_cases]).range([0, bar_width]);
    var scaleY = d3.scale.linear()
        .domain([0, data.length]).range([y_padding,height]);
    var nameScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.Name.length;})]).range([0, name_width]);
    // 地域の配列
    var region = {"Americas": "red", "South-East Asia": "blue", "Europe": "yellow", "Western Pacific": "cyan", "Eastern Mediterranean": "orange", "Africa": "green", "Other": "gray"};
    //データ駆動のドローイング
    //棒グラフ部
    svg.selectAll("rect")
        .data(data).enter().append("rect")
        .attr("x", function(d, i){return x_padding+name_width})
        // .attr("y", function(d, i){return scaleY(i) + 100/data.length})
        .attr("y", function(d, i){return scaleY(i)})
        .attr("width", function(d, i){return scaleX(d["Cases - cumulative total"])})
        .attr("height", function(d, i){return (height-total_space)/data.length})
        .attr("fill", function(d, i){return region[d["WHO Region"]]});
    //名前の出力
    svg.selectAll("text.name")//便宜上クラスを設定しているが，ここでは特に意味はない．
        .data(data).enter().append("text")
        .attr("x", function(d, i){return name_width+x_padding-3})
        // .attr("y", function(d, i){return scaleY(i) + 100/data.length})
        .attr("y", function(d, i){return scaleY(i+1)-8})
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .attr("font-family", "selif")
        .attr("font-size", function(d, i){return d.Name.length <= data[0].Name.length ? 14 : 14/(d.Name.length/data[0].Name.length)+"px"})
        .text(function(d, i){return d.Name})
        .attr("fill", "black");
    // 軸
    //scaleで軸の範囲をする．
    var x = d3.scale.linear().domain([0,max_cases]).range([x_padding+name_width, width-x_padding]);
    //axisで軸の設定をする．
    var xAxis = d3.svg.axis().scale(x).ticks(11).orient("top");
    svg.append("g")
    .attr("transform", "translate(0, 30)")//軸の描画位置はtransformで設定する．
    .call(xAxis)
    .selectAll("path,line")
    .attr("fill", "none").attr("stroke", "black")
    .attr("shape-rendering", "crispEdges");
    var canvas = d3.select("#graph8");
    // メモリ
    //引数はstart,stop,stepの順
    var range = d3.range(x_padding+name_width,width-x_padding+1,bar_width/10);
    svg.selectAll("line.v")
        .data(range).enter().append("line")
        .attr("x1", function(d,i){return d;}).attr("y1", y_padding)
        .attr("x2", function(d,i){return d;}).attr("y2", height);
    svg.selectAll("line")
        .attr("stroke", "black")
        .attr("stroke-dasharray", 2)
        .attr("shape-rendering", "crispEdges");
}