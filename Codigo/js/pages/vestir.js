/* =========================================================
   ¡Vestí a tu personaje!
   - Panel con las 12 categorías del prototipo.
   - Una prenda por categoría; tocar la prenda puesta la saca
     (el pelo siempre queda puesto).
   - Bufanda y collar se excluyen (ocupan el mismo lugar).
   - Las prendas de nivel N se desbloquean al terminar el nivel N.
   - La elección se guarda y se usa en el tribunal y el ranking.
   ========================================================= */
DF.boot(function(){
  const t = DF.i18n.t;
  const S = DF.sprites;
  const lang = DF.i18n.lang();
  const EXCLUDES = { bufandas:'collares', collares:'bufandas' };
  let av = S.normalize(DF.store.state.avatar);

  const box = document.getElementById('avatar-box');
  const panel = document.getElementById('dress-panel');
  const skins = document.getElementById('skins');

  function drawAvatar(){ box.innerHTML = S.avatar(av, 5.6); }

  panel.innerHTML = S.categories().map(c =>
    '<div class="dbox c-' + c.key + '"><span class="lbl">' + c.label + '</span>'
    + c.items.map(it => {
        const ok = DF.progress.itemUnlocked(it.lvl);
        return '<button type="button" class="ditem' + (ok ? '' : ' locked') + '" data-cat="' + c.key + '" data-key="' + it.key + '" title="' + DF.esc(it.name) + (ok ? '' : ' · ' + DF.esc(t('prendaBloq', { n:it.lvl }))) + '" aria-label="' + DF.esc(it.name) + '">'
          + S.itemPreview(c.key, it.key, 3)
          + (ok ? '' : '<span class="lock">🔒' + it.lvl + '</span>') + '</button>';
      }).join('')
    + '</div>').join('');

  skins.innerHTML = Object.keys(S.SKINS).map(k => '<button type="button" class="skin" data-skin="' + k + '" style="background:' + S.SKINS[k].S + '" title="' + S.SKINS[k].name[lang] + '" aria-label="' + S.SKINS[k].name[lang] + '"></button>').join('');

  function refresh(){
    panel.querySelectorAll('.ditem').forEach(b => {
      const on = av[b.dataset.cat] === b.dataset.key;
      b.classList.toggle('sel', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    skins.querySelectorAll('.skin').forEach(b => b.classList.toggle('sel', b.dataset.skin === av.piel));
    drawAvatar();
  }
  function save(){ DF.store.update(s => { s.avatar = Object.assign({}, av); }); }

  panel.addEventListener('click', e => {
    const b = e.target.closest('.ditem'); if(!b) return;
    const cat = b.dataset.cat, key = b.dataset.key, it = S.item(cat, key);
    if(!DF.progress.itemUnlocked(it.lvl)){
      DF.audio.play('bad'); DF.toast(t('prendaBloq', { n:it.lvl }));
      b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400);
      return;
    }
    if(av[cat] === key && cat !== 'pelo') delete av[cat];          // sacar
    else {
      av[cat] = key;                                               // poner
      const other = EXCLUDES[cat];
      if(other && av[other]){ delete av[other]; DF.toast(t('excluye')); }
    }
    save(); DF.audio.play('ok'); refresh();
  });
  skins.addEventListener('click', e => {
    const b = e.target.closest('.skin'); if(!b) return;
    av.piel = b.dataset.skin; save(); refresh();
  });

  refresh();
}, { requiresUser:true });
