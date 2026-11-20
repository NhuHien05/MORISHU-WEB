/* Featured products carousel: arrows + auto-advance every 4s, infinite loop */
(function(){
  var root=document.querySelector('.feat-carousel'); if(!root) return;
  var vp=root.querySelector('.feat-viewport'), track=root.querySelector('.feat-grid');
  var orig=[].slice.call(track.children), N=orig.length, per=4, idx=0, timer=null, busy=false, GAP=18, DELAY=4000;
  function perView(){ var w=window.innerWidth; return w<=520?1:(w<=1000?2:4); }
  function build(){
    [].slice.call(track.querySelectorAll('.is-clone')).forEach(function(c){c.remove();});
    per=perView();
    for(var i=0;i<per;i++){ var c=orig[i%N].cloneNode(true); c.classList.add('is-clone'); c.setAttribute('aria-hidden','true'); c.tabIndex=-1; track.appendChild(c); }
    var w=(vp.clientWidth-GAP*(per-1))/per;
    [].slice.call(track.children).forEach(function(c){ c.style.flex='0 0 '+w+'px'; });
    root.classList.toggle('no-slide', false);
    go(idx % N,false);
  }
  function go(i,anim){
    idx=i; var w=track.children[0].getBoundingClientRect().width;
    track.style.transition=anim?'transform .6s cubic-bezier(.4,0,.2,1)':'none';
    track.style.transform='translateX('+(-idx*(w+GAP))+'px)';
  }
  function next(){ if(busy) return; busy=true; go(idx+1,true); }
  function prev(){ if(busy) return; busy=true;
    if(idx===0){ go(N,false); void track.offsetWidth; }
    go(idx-1,true); }
  track.addEventListener('transitionend',function(e){
    if(e.target!==track) return; busy=false;
    if(idx>=N){ go(idx-N,false); }
  });
  function start(){ stop(); if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; timer=setInterval(next,DELAY); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  root.querySelector('.next').addEventListener('click',function(){ next(); start(); });
  root.querySelector('.prev').addEventListener('click',function(){ prev(); start(); });
  var sx=null;
  vp.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; stop(); },{passive:true});
  vp.addEventListener('touchend',function(e){ if(sx===null) return; var d=e.changedTouches[0].clientX-sx; if(Math.abs(d)>40){ d<0?next():prev(); } sx=null; start(); });
  document.addEventListener('visibilitychange',function(){ document.hidden?stop():start(); });
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ busy=false; build(); },150); });
  build(); start();
})();
