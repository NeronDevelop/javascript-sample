
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 60, left: 60},
  width = 600 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/NeronDevelop/data/main/csv/japan-national-cencus-foreginer_2022.csv")
  .then( function(data) {

  // 1-1. 全国と都道府県のデータのみに制限
  // 1-2.必要な列のみに制限する
  //     (割合のデータに変換する)
  const limit_data = data.filter((d, i) => {return (d['地域識別コード'] == "a" & d['男女'] == "0_総数")})
  const use_data = Object.keys(limit_data).map(function(k) {
    const item = limit_data[k]; 
    return {
      "都道府県": item["都道府県"].substring(3),
      //"総数": item["都道府県"],
      // "日本人": item["日本人"] / item["総数"],
      // "外国人": item["外国人"] / item["総数"],
      "韓国|朝鮮": item["韓国|朝鮮"] / item["外国人"],
      "中国": item["中国"] / item["外国人"],
      "フィリピン": item["フィリピン"] / item["外国人"],
      "タイ": item["タイ"] / item["外国人"],
      "インドネシア": item["インドネシア"] / item["外国人"],
      "ベトナム": item["ベトナム"] / item["外国人"],
      "インド": item["インド"] / item["外国人"],
      "ネパール": item["ネパール"] / item["外国人"],
      "イギリス": item["イギリス"] / item["外国人"],
      "アメリカ": item["アメリカ"] / item["外国人"],
      "ブラジル": item["ブラジル"] / item["外国人"],
      "ペルー": item["ペルー"] / item["外国人"],
      "その他": item["その他"] / item["外国人"],
      // "不詳": item["不詳"] / item["外国人"],
    }
  })

  // 縦軸のラベルの作成
  var xlabel = [
      "中国",
      "韓国|朝鮮", 
      "ベトナム",
      "ブラジル",
      "フィリピン", 
      "ネパール",
      "アメリカ",
      "タイ",
      "インドネシア",
      "ペルー",
      "インド",
      "イギリス",
      "その他"]
  
  // 縦軸の作成
  var ylabel = []
  use_data.forEach(element => 
    {ylabel.unshift(element['都道府県'])})

  // プロットするデータを作る
  var plot_data = []
  use_data.forEach(element =>{
    for (const country of xlabel) {
      plot_data.push({
        'prefecture': element['都道府県'], 
        'country': country,
        'rate': element[country]
      })
    }
  })

  // 色付けの関数
  max_val = Math.max.apply(null, plot_data.map(d => d['rate']))
  var myColor = d3.scaleLinear()
    .range(["#FFFFFF", "#AAD5FF", "#5566FF", "#4C00FF", "#00800D", 
            "#53A600", "#CCB800", "#FFE680", "#FF9640", "#FF1900"])
    .domain([0, 
             max_val * 1 / 9, 
             max_val * 2 / 9, 
             max_val * 3 / 9, 
             max_val * 4 / 9, 
             max_val * 5 / 9, 
             max_val * 6 / 9, 
             max_val * 7 / 9, 
             max_val * 8 / 9, 
             max_val])


  // 横軸の描画
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(xlabel)
    .padding(0.01);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("x", 10)
    .attr("y", -2)
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  // 縦軸の描画
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(ylabel)
    .padding(0.01);
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.selectAll()
      .data(plot_data, function(d) {return d['country']+':'+d['prefecture'];})
      .join("rect")
      .attr("x", function(d) { return x(d['country']) })
      .attr("y", function(d) { return y(d['prefecture']) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d['rate'])} )
      //.style("fill", function(d) { return selfColor[d.value]} )
})
