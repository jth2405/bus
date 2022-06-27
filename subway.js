window.onload = init;

var date = '';
var originalUrl="http://openapi.seoul.go.kr:8088/49747559716a7468383958694b4648/json/CardBusStatisticsServiceNew/1/1000/";
var buses = [];
var year, month, day;
var bus_num='/'

function init() {
    $( function(){
        //날짜 고르는 datepicker()
        $("#datepicker").datepicker();
        $('#datepicker').datepicker('option','dateFormat','yymmdd')

        $('#datepicker').change(function () { 
            date = $('#datepicker').val();
            year = date.substring(0,4);
            month = date.substring(4,6);
            day = date.substring(6,8);
            
            $.getJSON(originalUrl+date+bus_num, getBUSInfo);
        });

        

        //지하철 호선을 고르는 selectmenu()
        $('#busLine').selectmenu();

        //조회버튼 button()
        $('#searchButton').button();

        //버튼 클릭시
        $('#searchButton').click(function(event){           
            $(".dataItem").remove();   
            findbusInfo($('#busLine').val());
        })
    })
}

function getBUSInfo(str) {
    var select = document.getElementById('busLine');
    var stationNum = document.getElementById('numOfStation');
    var lineNumArray =[];
    try {
        buses = str.CardBusStatisticsServiceNew.row;
        stationNum.innerHTML = "성공적으로 데이터를 불러왔습니다. "+ year + '년 ' + month + '월 ' 
            + day + "일 기준 버스정류장의 수 : " + String(buses.length);
    } catch (error) {
        stationNum.innerHTML = '데이터가 없습니다. '+  year + '년 ' + month + '월 ' 
        + day + '일 이전의 값을 찾아보세요.';
    }
    
    for (let index = 0; index < buses.length; index++) {
        const bus = buses[index];
        if (lineNumArray.includes(bus.BUS_ROUTE_NM) == false) {
            lineNumArray.push(bus.BUS_ROUTE_NM);
            var option = document.createElement('option');
            option.setAttribute('value', bus.BUS_ROUTE_NM);
            option.setAttribute('class','options');
            option.innerHTML = bus.BUS_ROUTE_NM;
            select.appendChild(option);
        }
    }
}


function findbusInfo(lineNumber) {
    dataDiv = document.getElementById('bus');
    var totalppl = document.getElementById('ttlppl');
    var ride_sum = 0;
    var alight_sum = 0;
    var busName = [];
    var busRideArray = [];
    var busAlightArray = [];

    for (let index = 0; index < buses.length; index++) {
        const bus = buses[index];
        if (lineNumber == bus.BUS_ROUTE_NM) {
            var div = document.createElement('div');
            div.setAttribute('class', 'dataItem');
            div.innerHTML = bus.BUS_ROUTE_NM + '\t' + bus.BUS_STA_NM + '의 탑승 인원 : ' + bus.RIDE_PASGR_NUM + ' 하차 인원 : ' +  bus.ALIGHT_PASGR_NUM + ' 총 인원 : ' + String( bus.RIDE_PASGR_NUM +  bus.ALIGHT_PASGR_NUM);
            dataDiv.appendChild(div);

            busRideArray.push( bus.RIDE_PASGR_NUM);
            busAlightArray.push( bus.ALIGHT_PASGR_NUM);

            busName.push(bus.BUS_STA_NM);
            // subwayTotal.push([subway.RIDE_PASGR_NUM, subway.ALIGHT_PASGR_NUM]);
            ride_sum +=  bus.RIDE_PASGR_NUM;
            alight_sum +=  bus.ALIGHT_PASGR_NUM;
        }
    }

    totalppl.innerHTML = lineNumber + '의 총 탑승승객은 ' + ride_sum + '명이고 하차 승객은 ' + alight_sum +'명입니다. '; 
    
}

