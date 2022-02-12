

document.getElementById("inputWindow").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key === 'Enter') {
        document.getElementById("enterbtn").click();
    }
});

window.onload = function() {

    function formatDate(day) {
        let str = day.toDateString().split(' ');
        let dayOfWeek = str[0];
        let date = str[1] + ' ' + str[2];
        return [dayOfWeek, date];
    }

    function dayDisplay(dayString, day) {
        document.getElementById(dayString).innerHTML = day.join(' ');
    }
    //day 1 = today
    let day1 = new Date();
    //day 0 = yesterday
    let day0 = new Date(day1);
    day0.setDate(day0.getDate() - 1);
    //day 2 = tomorrow
    let day2 = new Date(day1);
    day2.setDate(day2.getDate() + 1);

    //shorten daystring and display on day tab buttons
    day0 = formatDate(day0);
    day1 = formatDate(day1);
    day2 = formatDate(day2);

    dayDisplay("day0", day0);
    dayDisplay("day1", day1);
    dayDisplay("day2", day2);
  
}

//globals 
let key = 'key=b7bf7b0695b74998a88214335221401'
let baseURL = 'http://api.weatherapi.com/v1'
let type = '/forecast.json?'
let q = '&q='
let days = '&days=3'
let aqi = '&aqi=yes'
let alerts = '&alerts=yes'

let F = '&#176;' + 'F';
let C = '&#176;' + 'C';


//collect the relevant data for easy manipulation
let threeDayForecast = [];

//converts JSOn icon url to local folder path
function parseIconURL(url) {
    let array = url.split('/');
    let newUrl = "icons\\" + array[5] + '\\' + array[6];
    "//icons//" + array[5] + '/' + array[6];
    return newUrl;
}
function fahrenheit_or_celsius (checked) {
    document.getElementById("avgTemp").innerHTML = checked.avg;
    document.getElementById("lowTemp").innerHTML = checked.low;
    document.getElementById("highTemp").innerHTML = checked.high;
}

function updateDisplay (index) {
    //replace welcome banner with title info
    document.getElementById('welcomeMessage').style.display = 'none';
    document.getElementById('titles').style.display = 'flex';
    
    let today = threeDayForecast[index];
    threeDayForecast.map(function(day) {
        let dateArray = day.date.split(' ');
        dateArray.pop();
        let date = dateArray.join(' ');

        let index = threeDayForecast.indexOf(day);
        document.getElementById("day" + index).innerHTML = date;
        

    });
    let iconURL = parseIconURL(today.icon);
    document.getElementById('icon').setAttribute("src", iconURL)

    console.log(today);
    let hours = [];
    today.hour.map(function(hour) {
        let hourObj = {"time" : hour.time.split(' ')[1], 
                    "condition" : hour.condition.text,
                    "icon" : parseIconURL(hour.condition.icon),
                    "isDay" : hour["is_day"]}
        hours.push(hourObj);
    });

    for (let i = 0; i < hours.length; i++) {
        let hour = hours[i];
        let isDay;
        if (hour.isDay == 1) {
            isDay = "day";
        } else if (hour.isDay == 0) {
            isDay = "night";
        } else {
            alert("error");
        }

        let parent = document.getElementById(hour.time);
        //create unique id
        let id = document.getElementById("disposable" + i);
        //check if square needs to be cleared
        if (id !== null) {
            parent.removeChild(id);
        }


        let disposableNode = document.createElement("div");
        disposableNode.id = "disposable" + i;
        let conditionNode = document.createTextNode(hour.condition);
        let hourIcon = document.createElement('img');
        hourIcon.setAttribute("src", hour.icon)
        hourIcon.style.cssText += 'margin:0 auto; max-height:3em;'
        disposableNode.appendChild(hourIcon);
        disposableNode.appendChild(conditionNode);
        
        disposableNode.style.cssText += 'display:flex;flex-direction:column;padding:.5em;'
        parent.appendChild(disposableNode);
        
    }
    
            
            
            
      

    let fahrenheit = {"avg" : today.avgF,
                        "high" : today.highF,
                        "low" : today.lowF};

    let celsius = {"avg" : today.avgC,
                    "high" : today.highC,
                    "low" : today.lowC};


    if (document.getElementById("celsius").checked) {
        fahrenheit_or_celsius(celsius);
    } else {
        fahrenheit_or_celsius(fahrenheit);
    }

    let Entries = Object.entries(threeDayForecast[index]);
    Entries.map(function(field) {
        //only update fields that have corresponding elements
        if ((document.getElementById(field[0]) !== null) && (field[0] !== "icon")) {
            document.getElementById(field[0]).innerHTML = field[1];
        }
    });
     
    //document.getElementById("icon").src=threeDayForecast[index].icon;
};

function getData() {
    let userCity = document.getElementById('inputWindow').value;
    let fullURL = baseURL + type + key + q + userCity + days + aqi + alerts;
    console.log(fullURL);
    fetch(fullURL)
    .then (res => res.json())
    .then (data => parseData(data))


}

function parseData(d) {
    let location = d.location.name + ', ' + d.location.country;
    document.getElementById("locationName").innerHTML = location
    
    threeDayForecast.length = 0;
  
  class weatherData {
    constructor(today) {
        this.date = new Date(today.date).toDateString();
        this.avgC = today.day["avgtemp_c"] + C;
        this.avgF = today.day["avgtemp_f"] + F;
        this.lowC = today.day["mintemp_c"] + C;
        this.lowF = today.day["mintemp_f"] + F;
        this.highC = today.day["maxtemp_c"] + C;
        this.highF = today.day["maxtemp_f"] + F;
        this.condition = today.day.condition.text;
        this.icon = today.day.condition.icon;
        this.sunrise = today.astro.sunrise;
        this.sunset = today.astro.sunset;
        this.moonphase = today.astro["moon_phase"];
        this.willRain = today.day["daily_will_it_rain"];
        this.willSnow = today.day["daily_will_it_snow"];
        this.chanceRain = today.day["daily_chance_of_rain"] + "% chance of rain";
        this.chancesnow = today.day["daily_chance_of_snow"] + "% chance of snow";
        //this.alerts = today.alerts.alert;
        this.aqi = today.day["air_quality"];
        this.hour = today.hour;
    }
  }

    d.forecast.forecastday.map(function (today) {
        
        threeDayForecast.push(new weatherData(today))
    
    });


    threeDayForecast.map(day => console.log(day));
    updateDisplay(0);
   


}

    

    

