var path = decodeURIComponent(location.hash.substr(2));
var page = 1;
if(location.search.substr(1,19)=='_escaped_fragment_='){
	path = decodeURIComponent(location.search.substr(20).split('&')[0]);
}
if(path == '/'){path = ''; window.history.replacetate(null, '', '/');page=1;}
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

var pending;

main();

function main(){
	content.innerHTML = '';
	loading.style.display = 'block';
	if(path.split('/')[1] == 'search'){
		search(path.split('/')[2]);
	}
	else if(path && path.split('/')[1] != 'page'){
		disqus_url = hostbase + path;
		showpost(path);
		(function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
	}
	else{
		//backhome.style.display = 'none';
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
				//backhome.style.display = 'block';
				if (xmlhttp.status==200){// 200 = "OK"
					var converter = new Showdown.converter();
					content.innerHTML = '<div style="padding: 20px 20px 20px 40px;"><div id="back_home"><a href="/" onclick="home();return false;">Sneezry</a><span>&nbsp;›&nbsp;</span></div><div id="post_title">' + path.substr(1).split('/')[path.substr(1).split('/').length-1].replace(/_/g, ' ') + '</div>' + converter.makeHtml(xmlhttp.responseText) + '<div class="date"><span>S</span>Posted at ' + pdate + '</div></div>';
					if(dis){
						dis.style.display = 'block';
					}
				}
				else if(xmlhttp.status==404) {
					document.title = 'Not Found - Sneezry';
					content.innerHTML = '<img src="images/despicable_me.png" />';
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
	if(path.split('/')[1] == 'page'){
		page = Number(path.split('/')[2]);
		if(isNaN(page)){
			page = 1;
			window.history.replaceState(null, '', '/');
		}
	}
	pending = false;
	document.getElementById('takinglonger').style.display = 'none';
	postList = list;
	var txt = '';
	if(page*20>list.data.length){
		page = Math.ceil(list.data.length/20);
		window.history.replaceState(null, '', '/#!/page/'+page);
	}
	for(var i = list.data.length-(page-1)*20; i > 0 && i > list.data.length-page*20; i--){
		txt += '<postlist><a href="/#!/' + list.data[i-1].name.replace(/-/g, '/') + '">' + list.data[i-1].name.split('-')[list.data[i-1].name.split('-').length-1].replace(/_/g, ' ') + '</a><div class="post_info"><span class="post_date">Posted at '+list.data[i-1].name.split('-')[0]+'-'+list.data[i-1].name.split('-')[1]+'-'+list.data[i-1].name.split('-')[2]+'</span><span class="disqus_count"><a href="' + hostbase + '/' + encodePath(list.data[i-1].name) + '#disqus_thread"></a></span></div></postlist>';
	}
	if(page==1 && page*20<list.data.length){
		txt += '<postlist><a class="prev_page" href="/#!/page/'+(page+1)+'">←之前的文章</a><div style="clear:both"></div></postlist>';
	}
	else if(page>1 && page*20>=list.data.length){
		txt += '<postlist><a class="next_page" href="/#!/page/'+(page-1)+'">更新的文章→</a><div style="clear:both"></div></postlist>';
	}
	else if(page>1 && page*20<list.data.length){
		txt += '<postlist><a class="prev_page" href="/#!/page/'+(page+1)+'">←之前的文章</a><a class="next_page" href="/#!/page/'+(page-1)+'">更新的文章→</a><div style="clear:both"></div></postlist>';
	}
	loading.style.display = 'none';
	content.innerHTML = txt;
	(function () {
        var s = document.createElement('script'); s.async = true;
		s.type = 'text/javascript';
        s.src = '//' + disqus_shortname + '.disqus.com/count.js';
        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
    }());
}

function encodePath(path){
  path = encodeURIComponent(path).replace(/-/g, '/');
  for(var i=0; i<path.length; i++){
    if(path.substr(i,1) == '%'){
      path = path.substr(0,i+1)+path.substr(i+1,2).toLowerCase()+path.substr(i+3);
      i+=2;
    }
  }
  return path;
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
