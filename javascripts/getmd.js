var path = location.pathname ? location.pathname : 'defalut';

var main = document.getElementById('main-content');
var xmlhttp;

var url = location.protocol + '//' + location.hostname + '/md/' + path;

loadXMLDoc(url);

function loadXMLDoc(url){
	xmlhttp=null;
	if (window.XMLHttpRequest){// code for IE7, Firefox, Opera, etc.
		xmlhttp=new XMLHttpRequest();
	}
	else if (window.ActiveXObject){// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp!=null){
		xmlhttp.onreadystatechange=state_Change;
		xmlhttp.open("GET",url,true);
		xmlhttp.send(null);
	}
	else{
		alert("Your browser does not support XMLHTTP.");
	}
}

function state_Change(){
	if (xmlhttp.readyState==4){// 4 = "loaded"
		if (xmlhttp.status==200){// 200 = "OK"
			var converter = new Showdown.converter();
			main.innerHTML = converter.makeHtml(xmlhttp.responseText);
		}
		else if(xmlhttp.status==404) {
			main.innerHTML = '404';
		}
		else {
			main.innerHTML = 'We meet a problem.';
		}
	}
}