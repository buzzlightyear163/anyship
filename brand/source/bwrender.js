// Renderar byggfönster (samma som sajtens BuildWindow) från windows.json.
// <div class="bw" data-t="chat" data-p="0.6" data-file="hearth.html" data-tag="WRITE · 09:14 / 20:00"></div>
(() => {
  const W = window.WINDOWS
  const shapes = (t) => W[t].map((s) => `<span class="bw-s s-${s.t} v${s.v ?? 0}${s.round ? ' r' : ''}" style="left:${s.x}%;top:${s.y}%;width:${s.w}%;${s.h != null ? `height:${s.h}%;` : ''}"></span>`).join('')
  const frame = (t, f) => `<div class="bw-win"><div class="bw-bar"><i></i><i></i><i></i><span class="bw-title">${f}</span></div><div class="bw-body">${shapes(t)}</div></div>`
  document.querySelectorAll('.bw[data-t]').forEach((el) => {
    const t = el.dataset.t, f = el.dataset.file || '', p = +el.dataset.p
    el.style.setProperty('--x', `${(1 - p) * 100}%`)
    el.style.setProperty('--xn', String(1 - p))
    if (p >= 1) el.classList.add('is-done')
    el.innerHTML = `<div class="bw-layer bw-wire">${frame(t, f)}</div><div class="bw-layer bw-solid">${frame(t, f)}</div>` +
      `<div class="bw-line">${el.dataset.tag ? `<span class="bw-tag">${el.dataset.tag}</span>` : ''}</div>`
  })
  document.body.dataset.ready = '1'
})()
