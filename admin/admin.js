// Admin CMS starter: this preview is read-only. Connect authenticated admin APIs before enabling edits.
const catalogs=['Quest templates','Campaign templates','Achievements','Languages','Events','Cosmetics','Reports','Users'];document.querySelector('#admin-content').innerHTML=catalogs.map(x=>`<div class="admin-row">${x}<span class="pill">Backend required</span></div>`).join('');
