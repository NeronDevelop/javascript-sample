const map = L.map('map').setView([34.983808, 138.386879], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 本当はここも計算できるとよさそう
const popup = L.popup()
    .setLatLng([34.983808, 138.386879])
    .setContent('I am a standalone popup.')
    .openOn(map);
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(`You clicked the map at ${e.latlng.toString()}`)
        .openOn(map);
}


map.on('click', onMapClick);

// 自分で作成
const xhr = new XMLHttpRequest();
// ローカル向け(ファイルは追加しない予定)
// xhr.open('get', 'P11-10_22-jgd-g.xml')
xhr.overrideMimeType("text/xml")
xhr.open('get', 'https://raw.githubusercontent.com/NeronDevelop/data/main/xml/P11-10_22-jgd-g.xml')
xhr.send();
xhr.onloadend = function() {
    debugger
    const mapinfo = this.responseXML.documentElement

    // バスの路線のリストを出す
    bus_stop_num = mapinfo.getElementsByTagName('ksj:BusStop').length
    bus_line_set = new Set()
    bus_company_set = new Set()
    for (var i = 0; i < bus_stop_num; i++) {
        bus_line = mapinfo.getElementsByTagName('ksj:BusStop')[i]
                            .getElementsByTagName('ksj:busLineName')
        bus_company = mapinfo.getElementsByTagName('ksj:BusStop')[i]
                            .getElementsByTagName('ksj:busOperationCompany')
        bus_line_num = bus_line.length
        for (var j = 0; j < bus_line_num; j++) {
            bus_line_set.add(bus_line[j].textContent)
            bus_company_set.add(bus_company[j].textContent)
        }
    }


    use_bus_company= []
    var count = 0
    for (var bus_company of bus_company_set) {
        use_bus_company.push(bus_company)
        count = count + 1
        if (count >= 5) {
            break
        }
    }

    // プロットする色の設定
    color = ['red', 'black', 'yellow','blue', 'orange']

    // 0番目の要素の取り出し
    for (var i = 0; i < bus_stop_num; i++) {
        bus_stop = bus_stop_name = mapinfo.getElementsByTagName('ksj:BusStop')[i]
        bus_companys = bus_stop.getElementsByTagName('ksj:busOperationCompany')        
        bus_company_num = bus_companys.length
        plot_flag = false
        plot_color_num = -1
        for (var j = 0; j < bus_company_num; j++) {
            if (use_bus_company.includes(bus_companys[j].textContent)) {
                plot_color_num = use_bus_company.indexOf(bus_companys[j].textContent)
                plot_flag = true
                break
            }
        }

        // プロット対象外ならば除外する
        if (!plot_flag) {
            continue
        }

        tmp_str = mapinfo.getElementsByTagName('gml:Point')[i].getElementsByTagName('gml:pos')[0].textContent
        lat_lng_str = tmp_str.split(' ')
        // 0番目のバス停名
        bus_stop_name = bus_stop
                            .getElementsByTagName('ksj:busStopName')[0].textContent

        L.circle([lat_lng_str[0], lat_lng_str[1]], {
                                color: color[plot_color_num],
                                fillColor: color[plot_color_num],
                                fillOpacity: 0.5,
                                radius: 5
                            }).addTo(map).bindPopup(bus_stop_name);
        console.log(bus_stop_name)
    }
}