var path = location.pathname;

var main = document.getElementById('content');
var dis = document.getElementById('disqus_thread');
var xmlhttp;

var url = location.protocol + '//' + location.hostname + '/md' + path;

document.title = path.substr(1) + ' - Sneezry';

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
			if(dis){
				dis.style.display = 'block';
			}
		}
		else if(xmlhttp.status==404) {
			main.innerHTML = '<img src="/images/404.jpg" />';
		}
		else {
			main.innerHTML = 'We meet a problem.';
		}
	}
}