var path = decodeURIComponent(location.hash.substr(2));
if(location.search.substr(1,19)=='_escaped_fragment_='){
	path = decodeURIComponent(location.search.substr(20));
}
if(path == '/'){path = ''; window.history.replacetate(null, '', '/');}
else if(path && !location.search){window.history.pushState(null, '', '/#!'+path);}
var converter = new Showdown.converter();
var content = document.getElementById('content');
var dis = document.getElementById('disqus_thread');
var loading = document.getElementById('loading');
var backhome = document.getElementById('backhome');
var xmlhttp;
var disqus_url;
var kw;
var postList;

var disqus_shortname = 'sneezry';
var hostbase = 'http://sneezry.com';
var githubname = 'sneezry';
var repos = 'sneezry.github.com';

var pending;

main();

function main(){
	content.innerHTML = '';
	loading.style.display = 'block';
	if(path.split('/')[1] == 'search'){
		search(path.split('/')[2]);
	}
	else if(path){
		disqus_url = hostbase + path;
		showpost(path);
		(function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
	}
	else{
		backhome.style.display = 'none';
		document.title = 'Sneezry';
		if(postList){
			showlist(postList);
		}
		else{
			pending = true;
			document.getElementById('takinglonger').style.display = 'none';
			chktakinglonger();
			var el = document.createElement('script');
			el.src = 'https://api.github.com/repos/' + githubname + '/' + repos + '/contents/md?callback=showlist';
			document.getElementsByTagName('head')[0].appendChild(el);
		}
	}
}

function home(){
	path = '';
	dis.style.display = 'none';
	dis.innerHTML = '';
	window.history.pushState(null, '', '/');
	main();
}

function loadXMLDoc(url){
	var xmlhttp=null;
	if (window.XMLHttpRequest){// code for IE7, Firefox, Opera, etc.
		xmlhttp=new XMLHttpRequest();
	}
	else if (window.ActiveXObject){// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp!=null){
		pending = true;
		document.getElementById('takinglonger').style.display = 'none';
		chktakinglonger();
		xmlhttp.onreadystatechange = function (){
			if (xmlhttp.readyState==4){// 4 = "loaded"
				pending = false;
				document.getElementById('takinglonger').style.display = 'none';
				loading.style.display = 'none';
				backhome.style.display = 'block';
				if (xmlhttp.status==200){// 200 = "OK"
					var converter = new Showdown.converter();
					content.innerHTML = converter.makeHtml(xmlhttp.responseText) + '<div class="date"><span>S</span>Posted at ' + pdate + '</div>';
					if(dis){
						dis.style.display = 'block';
					}
				}
				else if(xmlhttp.status==404) {
					document.title = 'Not Found - Sneezry';
					content.innerHTML = '<iframe scrolling="no" frameborder="0" src="http://yibo.iyiyun.com/js/yibo404/key/1" width="640" height="462" style="display:block;"></iframe>';
				}
				else {
					document.title = 'Technology Problem - Sneezry';
					content.innerHTML = '<blockquote>We meet a problem when try to handle ' + path + ' (Err: ' + xmlhttp.status + ').</blockquote>';
				}
			}
		}
		xmlhttp.open("GET",url,true);
		xmlhttp.send(null);
	}
}

function chktakinglonger(){
	setTimeout(function(){
		if(pending){
			document.getElementById('takinglonger').style.display = 'block';
		}
	}, 10000);
}

function showpost(path){
	//window.history.pushState(null, path.substr(1).split('/')[path.substr(1).split('/').length-1] + ' - Sneezry', path);
	var url = location.protocol + '//' + location.hostname + '/md/' + path.substr(1).replace(/\//g, '-');
	document.title = path.substr(1).split('/')[path.substr(1).split('/').length-1].replace(/_/g, ' ') + ' - Sneezry';
	pdate = path.substr(1).split('/')[0]+'-'+path.substr(1).split('/')[1]+'-'+path.substr(1).split('/')[2];
	loadXMLDoc(url);
}

function showlist(list){
	pending = false;
	document.getElementById('takinglonger').style.display = 'none';
	postList = list;
	var txt = '';
	for(var i = list.data.length; i > 0; i--){
		txt += '<postlist><a href="/#!/' + list.data[i-1].name.replace(/-/g, '/') + '">' + list.data[i-1].name.split('-')[list.data[i-1].name.split('-').length-1].replace(/_/g, ' ') + '</a><span class="disqus_count"><a href="' + hostbase + '/' + encodeURIComponent(list.data[i-1].name).replace(/-/g, '/') + '#disqus_thread"></a></span></postlist>';
	}
	loading.style.display = 'none';
	content.innerHTML = converter.makeHtml(txt);
	(function () {
        	var s = document.createElement('script'); s.async = true;
		s.type = 'text/javascript';
        	s.src = '//' + disqus_shortname + '.disqus.com/count.js';
        	(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
    	}());
}

window.onhashchange = function(){
	if(location.hash && location.hash.substr(1,1) != '!'){
		window.history.replaceState(null, '', '/#!'+path);
		return;
	}
	dis.style.display = 'none';
	dis.innerHTML = '';
	path = location.hash.substr(2);
	if(path == '/'){path = ''; window.history.pushState(null, '', '/');}
	main();
}
