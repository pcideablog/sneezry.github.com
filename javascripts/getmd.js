var path = location.hash.substr(2);

var converter = new Showdown.converter();
var content = document.getElementById('content');
var dis = document.getElementById('disqus_thread');
var xmlhttp;

main();

function main(){
	if(path){
		content.innerHTML = 'loading...';
		showpost(path);
	}
	else{
		var el = document.createElement('script');
		el.src = 'https://api.github.com/repos/sneezry/sneezry.github.com/contents/md?callback=showlist';
		document.getElementsByTagName('head')[0].appendChild(el);
	}
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
			content.innerHTML = converter.makeHtml(xmlhttp.responseText);
			if(dis){
				dis.style.display = 'block';
			}
		}
		else if(xmlhttp.status==404) {
			content.innerHTML = '<img src="/images/404.jpg" />';
		}
		else {
			content.innerHTML = 'We meet a problem.';
		}
	}
}

function showpost(path){
	//window.history.pushState(null, path.substr(1).split('/')[path.substr(1).split('/').length-1] + ' - Sneezry', path);
	var url = location.protocol + '//' + location.hostname + '/md/' + path.substr(1).replace(/\//g, '-');
	document.title = path.substr(1).split('/')[path.substr(1).split('/').length-1] + ' - Sneezry';
	loadXMLDoc(url);
}

function showlist(list){
	var txt = '';
	for(var i = list.data.length; i > 0; i--){
		txt += '<h2><a href="/#!/' + list.data[i-1].name.replace(/-/g, '/') + '">' + list.data[i-1].name.split('-')[list.data[i-1].name.split('-').length-1] + '</a></h2>';
	}
	content.innerHTML = converter.makeHtml(txt);
}

window.onpopstate = function(event){
	path = location.hash.substr(2);
	main();
}