/*
やりたいことを書いていく
1. ファイルの選択をできるようになりたい
2. heatmapの部分をできるだけ関数かしたい
3. 任意のデータを受け取れるようにしたい
4. 色も変えられるようにしたい

*/


// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var selfColor = [
    "#FFFFFF", "#F7FEFF", "#F0FCFF", "#E8FAFF", "#E0F7FF", "#D8F4FF", "#D1F0FF", "#C9ECFF", "#C1E7FF", "#B9E1FF",
    "#B2DBFF", "#AAD4FF", "#A2CDFF", "#9BC5FF", "#93BDFF", "#8BB4FF", "#83ABFF", "#7CA1FF", "#7496FF", "#6C8BFF", 
    "#647FFF", "#5D73FF", "#5566FF", "#4D59FF", "#464BFF", "#403EFF", "#3F36FF", "#3F2EFF", "#4027FF", "#421FFF", 
    "#4317FF", "#460FFF", "#4908FF", "#4C00FF", "#00800D", "#008208", "#008403", "#028700", "#078900", "#0C8B00", "#128E00", "#179000",
    "#1D9300", "#239500", "#2A9700", "#309A00", "#379C00", "#3D9F00", "#44A100", "#4CA300", "#53A600", "#5AA800", "#62AB00", "#6AAD00", "#72AF00", "#7AB200",
    "#83B400", "#8BB600", "#94B900", "#9DBB00", "#A6BE00", "#AFC000", "#B9C200", "#C2C500", "#C7C200", "#CABD00", "#CCB800", "#FFE680", "#FFE27C", "#FFDE78",
    "#FFDA74", "#FFD670", "#FFD16C", "#FFCD68", "#FFC864", "#FFC360", "#FFBE5C", "#FFB958", "#FFB454", "#FFAE50", "#FFA84C", "#FFA248", "#FF9C44", "#FF9640",
    "#FF8F3C", "#FF8938", "#FF8234", "#FF7B30", "#FF742C", "#FF6C28", "#FF6524", "#FF5D20", "#FF551C", "#FF4D18", "#FF4514", "#FF3D10", "#FF340C", "#FF2B08",
    "#FF2304", "#FF1900"]

// Build color scale
var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([1,100])

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then( function(data) {

  // xlabelを作成する
  var xlabel = []
  data.forEach(element => 
    {if (xlabel.indexOf(element['group']) !== -1) {
        // 何もしない
    } else {
        xlabel.push(element['group'])
    }})

  var ylabel = []
  data.forEach(element => 
    {if (ylabel.indexOf(element['variable']) !== -1) {
        // 何もしない
    } else {
        ylabel.push(element['variable'])
    }})
  debugger;

  // 横軸を作成する
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(xlabel)
    .padding(0.01);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // 縦軸を作成する
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(ylabel)
    .padding(0.01);
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.selectAll()
      .data(data, function(d) {return d.group+':'+d.variable;})
      .join("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
      //.style("fill", function(d) { return selfColor[d.value]} )
})
