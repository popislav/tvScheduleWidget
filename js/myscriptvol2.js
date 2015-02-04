// global Variable of programms
var programms = new Array();
//----------------------------------------------------------------------------------------------------------------------

// Object constructor function
function Program(title_program, start_time, stop_time, description) {
    this.title_programm = title_program;
    this.start_time = start_time;
    this.stop_time = stop_time;
    this.desc_program = description;
}

//getDatum: *** što s 23:59:59??
function getDatum(date){
    if(date === "today"){
        var today = (new Date()).toISOString().slice(0,10);
        return today;
    }
    else if(date === "tomorrow"){
        var tomorrow = new Date((new Date()).setDate((new Date()).getDate()+1)).toISOString().slice(0,10);
        return tomorrow;
    }
    else if(date === "overmorrow"){
        var overmorrow = new Date((new Date()).setDate((new Date()).getDate()+2)).toISOString().slice(0,10);
        return overmorrow;
    }
}
//----------------------------------------------------------------------------------------------------------------------

//From unix to time on chosen chanel:
function fromUnixToTime(unix_time){

    var date = new Date(unix_time*1000);
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();
    var time = hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2);
    return time;
}
//----------------------------------------------------------------------------------------------------------------------

// write now and next on the first page
function writeNowAndNext(){
    var d = new Date();
    var n = (d.getTime())/1000;
    var length = programms.length;

    for(count in programms){
        if((programms[count].start_time <= n) && (programms[count].stop_time > n)){
			
            document.getElementById('now_playing_show').innerHTML = fromUnixToTime(programms[count].start_time) + "  " + programms[count].title_programm;
            var progress_pct = ((n - programms[count].start_time)/(programms[count].stop_time-programms[count].start_time));
            document.getElementById('progress').setAttribute("value", progress_pct);

            if(count < length-1){
                var next = parseInt(count) + 1;
                document.getElementById('next_playing_show').innerHTML = fromUnixToTime(programms[next].start_time) + "  " + programms[next].title_programm;
            }else{
                document.getElementById('next_playing_show').innerHTML = "End of programme for today";
            }
        }
            
    }
}
//----------------------------------------------------------------------------------------------------------------------

// write schedule on second page
function writeSchedule(day){

    var rows_length = document.getElementById('content_table').rows.length;

    while(rows_length > 0){
        document.getElementById("myTable").deleteRow(rows_length);
        rows_length--;
    }

    var day_ = getDatum(day);
    var table = document.getElementById('content_table');

    for(count in programms){
        var row = table.insertRow(count);
        var cell_1 = row.insertCell(0);
        var cell_2 = row.insertCell(1);

        cell_1.innerHTML = fromUnixToTime(programms[count].start_time);
        cell_2.innerHTML = programms[count].title_programm;
    }

}


function writeSubjects(){
    var val = document.getElementById('select_channel1').value;
    document.getElementById('ch_name1').innerHTML = val;
    /* document.getElementById('ch_name2').innerHTML = val; */

    var img = document.createElement("img");
    img.src = "logos/" + val + ".png";


    var src2 = document.getElementById('ch_name3');
    while (src2.hasChildNodes()) {
    src2.removeChild(src2.lastChild);
    }
    src2.appendChild(img);

}

//----------------------------------------------------------------------------------------------------------------------

// getObjects through JSON implemenation
function getObjects(data){
    programms = [];
    for(count in (data.programme)){

        programms[count] = new Program(data.programme[count].title.de, data.programme[count].start, data.programme[count].stop);
    }
}
//----------------------------------------------------------------------------------------------------------------------

function generateLink(temp_channel, temp_day) {
    var channel;
    switch (temp_channel) {
        case ("ORF1"):
            channel = "orf1.orf.at_" + getDatum(temp_day);
            break;
        case ("ORF2"):
            channel = "orf2.orf.at_" + getDatum(temp_day);
            break;
        case ("ORF3"):
            channel = "orf3.orf.at_" + getDatum(temp_day);
            break;
        case ("PULS4"):
            channel = "puls4.at_" + getDatum(temp_day);
            break;
        case ("SportPlus"):
            channel = "sportplus.orf.at_" + getDatum(temp_day);
            break;
        case ("EuroSport"):
            channel = "eurosport.de_" + getDatum(temp_day);
            break;
        case ("EuroSport2"):
            channel = "2.eurosport.de_" + getDatum(temp_day);
            break;
        case ("3sat"):
            channel = "3sat.de_" + getDatum(temp_day);
            break;
        case ("Das Erste"):
            channel = "bfs.daserste.de_" + getDatum(temp_day);
            break;
        case ("BoomerangTV"):
            channel = "boomerangtv.de_" + getDatum(temp_day);
            break;
        case ("ZDF"):
            channel = "zdf.de_" + getDatum(temp_day);
            break;
		case ("HRT1"):
            channel = "htv1.hrt.hr_" + getDatum(temp_day);
            break;
        case ("HRT2"):
            channel = "htv2.hrt.hr_" + getDatum(temp_day);
            break;
		case ("HRT3"):
            channel = "htv3.hrt.hr_" + getDatum(temp_day);
            break;
        case ("HRT4"):
            channel = "htv4.hrt.hr_" + getDatum(temp_day);
            break;
    }

    return channel;
}




//----------------------------------------------------------------------------------------------------------------------

//Ajax Call
function downloadData(selected_channel, day_){
    $.getJSON("http://xmltv.tvtab.la/json/"+selected_channel+".js.gz",
        function(data){
            var objects_;
            $.each(data, function(key, val){
                objects_ = val;
                getObjects(objects_);
                writeSubjects();
                writeNowAndNext();
                writeSchedule(day_);
            });

        }
    );
}

//load JSON/XML File 
$( window ).load(function() {

    $('#select_channel1').change(function(){
        var day_ = document.getElementById('selected_day').value;
        if(document.getElementById('select_channel1').value != 'choose_channel'){

        var selected_channel = generateLink(document.getElementById('select_channel1').value, day_);
        downloadData(selected_channel, day_);
		$(".now_next").show();
        }
        
    });


//----------------------------------------------------------------------------------------------------------------------
// END getObjects through JSON implemenation

    $('#selected_day').change(function(){

        var selected_day = document.getElementById('selected_day').value;
        var selected_channel = generateLink(document.getElementById('select_channel1').value, selected_day);
        downloadData(selected_channel, selected_day);
    });

    $("#check_channel_button").click(function(){
        if((document.getElementById('select_channel1').value) === "choose_channel")
        {
            document.getElementById('check_channel_button').setAttribute("href","#pageErrorDialog");
        }
        else
        {
            document.getElementById('check_channel_button').setAttribute("href","#page2");
            
        }
    });

    $("#back_page1_button").click(function(){
        document.getElementById('selected_day').value = "today";

    });

});





