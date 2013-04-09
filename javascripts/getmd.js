var path = location.hash.substr(1);

var converter = new Showdown.converter();
var main = document.getElementById('content');
var dis = document.getElementById('disqus_thread');
var xmlhttp;

if(path){
	window.history.pushState({title: path.substr(1) + ' - Sneezry', url: path}, path.substr(1) + ' - Sneezry', path);
	var url = location.protocol + '//' + location.hostname + '/md' + path;
	loadXMLDoc(url);
}
else{
	var el = document.createElement('script');
	el.src = 'https://api.github.com/repos/sneezry/sneezry.github.com/contents/md?callback=showlist';
	document.getElementsByTagName('head')[0].appendChild(el);
}

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

function showlist(list){
	var txt = "";
	for(var i = 0; i < list.data.length; i++){
		txt += "## [" + list.data[i].name + "](/" + list.data[i].name + ")\n\n";
	}
	main.innerHTML = converter.makeHtml(txt);
}