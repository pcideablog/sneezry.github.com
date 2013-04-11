var listTotal;
var currentTotal = 0;

function search(q){
	if(!q){
		home();
	}
	else{
		content.innerHTML = '';
		loading.style.display = 'block';
		dis.style.display = 'none';
		dis.innerHTML = '';
		document.title = 'Search:' + q + ' - Sneezry';
		kw = q;
		var el = document.createElement('script');
		el.src = 'https://api.github.com/repos/' + githubname + '/' + repos + '/contents/md?callback=searchlist';
		document.getElementsByTagName('head')[0].appendChild(el);
	}
}

function searchlist(list){
	listTotal = list.data.length;
	for(var i = list.data.length; i > 0; i--){
		if(list.data[i-1].name.indexOf(kw) != -1){
			content.innerHTML += '<h2><a href="/#!/' + list.data[i-1].name.replace(/-/g, '/') + '">' + list.data[i-1].name.split('-')[list.data[i-1].name.split('-').length-1] + '</a></h2>';
		}
		else{
			var url = location.protocol + '//' + location.hostname + '/md/' + path.substr(1).replace(/\//g, '-');
			searchLoadXMLDoc(url, list.data[i-1].name);
		}
	}
}

function searchLoadXMLDoc(url, pname){
	var xmlhttp=null;
	if (window.XMLHttpRequest){// code for IE7, Firefox, Opera, etc.
		xmlhttp=new XMLHttpRequest();
	}
	else if (window.ActiveXObject){// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp!=null){
		xmlhttp.onreadystatechange=searchState_Change;
		xmlhttp.open("GET",url,true);
		xmlhttp.send(null);
	}
}

function searchState_Change(xmlhttp){
	if (xmlhttp.readyState==4){// 4 = "loaded"
		currentTotal++;
		loading.style.display = 'none';
		backhome.style.display = 'block';
		if (xmlhttp.status==200){// 200 = "OK"
			if(xmlhttp.responseText.indexOf(kw) != -1){
				content.innerHTML += '<h2><a href="/#!/' + pname.replace(/-/g, '/') + '">' + pname.split('-')[pname.split('-').length-1] + '</a></h2>';
			}
		}
		if(currentTotal == listTotal){
			loading.style.display = 'none';
		}
	}
}