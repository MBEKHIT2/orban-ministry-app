(function(){
  const HYDRATION = 0.65;
  const SCALD_FLOUR_FRAC = 0.4255319148936170;
  const YEAST_PERKG = { 'winter': 6.5, 'summer': 5.0 };
  const SIZES = [250,350,450,500,850,1000,1300];
  const WEEKDAY_DEFAULTS = { 'monday':13, 'tuesday':'', 'wednesday':13, 'thursday':'', 'friday':23, 'saturday':25, 'sunday':'' };
  const daySelect = document.getElementById('daySelect');
  const dayKg = document.getElementById('dayKg');
  const qtyKg = document.getElementById('qtyKg');
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const byDay = document.getElementById('by-day');
  const byQty = document.getElementById('by-qty');
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  days.forEach(function(d){ var opt=document.createElement('option'); opt.value=d; opt.textContent=d[0].toUpperCase()+d.slice(1); daySelect.appendChild(opt); });
  function applyDayDefault(){ var d=daySelect.value; var v=WEEKDAY_DEFAULTS[d]; dayKg.value = (v !== '' ? v : ''); }
  applyDayDefault(); daySelect.addEventListener('change', applyDayDefault);
  function setMode(){ var mode=document.querySelector('input[name="mode"]:checked').value; byDay.classList.toggle('hidden', mode !== 'day'); byQty.classList.toggle('hidden', mode !== 'quantities'); }
  modeRadios.forEach(function(r){ r.addEventListener('change', setMode); }); setMode();
  function recalcQtyKg(){ var grams=0; SIZES.forEach(function(s){ var el=document.getElementById('n'+s); var n=parseInt(el.value||'0',10)||0; grams += n*s; }); qtyKg.value=(grams/1000).toFixed(2); }
  SIZES.forEach(function(s){ var el=document.getElementById('n'+s); if(el){ el.addEventListener('input', recalcQtyKg); } }); recalcQtyKg();
  function fmt(x,digits){ digits=(digits===undefined?2:digits); var p=Math.pow(10,digits); return (Math.round(x*p)/p).toFixed(digits);}
  document.getElementById('calcBtn').addEventListener('click', function(){
    var ratio=parseFloat(document.querySelector('input[name="ratio"]:checked').value);
    var season=document.querySelector('input[name="season"]:checked').value;
    var mode=document.querySelector('input[name="mode"]:checked').value;
    var targetKg=parseFloat(mode==='day' ? (dayKg.value||'0') : (qtyKg.value||'0')) || 0;
    if(!targetKg||targetKg<=0){ alert('Please provide a valid total dough target (kg).'); return; }
    var totalDough=targetKg;
    var totalFlour= totalDough / (1 + HYDRATION);
    var totalWater= totalDough - totalFlour;
    var scaldDough= totalDough * ratio;
    var b1Flour= scaldDough * SCALD_FLOUR_FRAC;
    var b1Boil= scaldDough - b1Flour;
    var b2Flour= totalFlour - b1Flour;
    var b2Water= Math.max(0, totalWater - b1Boil);
    var yeastG= totalFlour * (season==='winter' ? YEAST_PERKG.winter : YEAST_PERKG.summer);
    document.getElementById('b1Flour').textContent = fmt(b1Flour);
    document.getElementById('b1Boil').textContent = fmt(b1Boil);
    document.getElementById('b2Flour').textContent = fmt(b2Flour);
    document.getElementById('b2Water').textContent = fmt(b2Water);
    document.getElementById('tFlour').textContent = fmt(totalFlour);
    document.getElementById('tWater').textContent = fmt(totalWater);
    document.getElementById('tDough').textContent = fmt(totalDough);
    document.getElementById('sDough').textContent = fmt(scaldDough);
    document.getElementById('yeast').textContent = fmt(yeastG,0);
    var tbody=document.getElementById('qtyTable'); tbody.innerHTML='';
    SIZES.forEach(function(sz){ var maxQty=Math.floor(totalDough*1000/sz); var tr=document.createElement('tr'); tr.innerHTML='<td>'+sz+'</td><td>'+maxQty+'</td>'; tbody.appendChild(tr); });
    document.getElementById('results').classList.remove('hidden');
  });
})();
