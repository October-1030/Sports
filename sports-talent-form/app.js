/* ========= 可配置区 ========= */
const STORAGE_KEY = 'sports-talent-form.v1';
const SUBMIT_ENDPOINT = 'https://formspree.io/f/movnqvan';  // ← 用你的 endpoint
const SUBMIT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
/* ========================== */

const form = document.getElementById('survey-form');
const steps = Array.from(document.querySelectorAll('.step'));
const progressBar = document.getElementById('progress-bar');
const stepLabel = document.getElementById('step-label');
const autosaveLabel = document.getElementById('autosave-label');
const lastSaved = document.getElementById('last-saved');

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSave = document.getElementById('btn-save');

const btnPreview = document.getElementById('btn-preview');
const btnExportJson = document.getElementById('btn-export-json');
const btnPrint = document.getElementById('btn-print');
const btnSubmit = document.getElementById('btn-submit');
const submitResult = document.getElementById('submit-result');

const previewDialog = document.getElementById('preview-dialog');
const previewClose = document.getElementById('preview-close');
const previewJson = document.getElementById('preview-json');
const copyJsonBtn = document.getElementById('copy-json');

let currentStep = 1;
init();

function init(){
  restore();
  updateStep(deriveStepFromData() || 1, false);
  bindEvents();
  tickProgress();
  announceSavedTime();
}

function bindEvents(){
  btnPrev.addEventListener('click', ()=> updateStep(currentStep-1));
  btnNext.addEventListener('click', ()=> {
    if(validateStep(currentStep)) updateStep(currentStep+1);
  });
  btnSave.addEventListener('click', save);

  form.addEventListener('input', onInput);
  form.addEventListener('change', onInput);

  btnPreview?.addEventListener('click', openPreview);
  previewClose?.addEventListener('click', ()=> previewDialog.close());
  copyJsonBtn?.addEventListener('click', copyPreviewJson);

  btnExportJson?.addEventListener('click', exportJsonFile);
  btnPrint?.addEventListener('click', ()=> window.print());

  form.addEventListener('submit', onSubmit);
}

function updateStep(step, scrollTop=true){
  if(step<1) step=1;
  if(step>steps.length) step=steps.length;
  steps.forEach((s,i)=> s.hidden = (i !== step-1));
  currentStep = step;
  tickProgress();
  const titles=['基本信息','运动发展状况','身体状况','运动发展规划','儿童运动潜质观察','运动心理与行为特征','提交'];
  stepLabel.textContent = `步骤 ${step} / ${steps.length} · ${titles[step-1]||''}`;
  if(scrollTop) window.scrollTo({top:0,behavior:'smooth'});
  btnPrev.disabled = step===1;
  btnNext.disabled = step===steps.length;
}

function tickProgress(){
  progressBar.style.width = `${(currentStep-1)/(steps.length-1)*100}%`;
}

function onInput(e){
  // 动态：单选"其他"联动文本框
  if(e.target.matches('input[type="radio"]')){
    const wrap = e.target.closest('.with-input');
    if(!wrap){
      // 清空同组选项的附属输入
      const groupName = e.target.name;
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(r=>{
        if(r!==e.target){
          const wi = r.closest('.with-input');
          if(wi){
            wi.querySelectorAll('input[type="text"],input[type="number"]').forEach(x=> x.value='');
          }
        }
      });
    }
  }
  autoSaveDebounced();
}

let saveTimer=null;
function autoSaveDebounced(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 400);
}

function collect(){
  // 将所有控件聚合为对象（支持多选组 .checkbox-grid）
  const data = {};
  const fd = new FormData(form);

  // 常规：单值
  for(const [k,v] of fd.entries()){
    // 避免复用 name 的多值覆盖（如 with-input 的小输入不应覆盖主项）
    if(k.includes('.')) set(data,k,v);
    else set(data,k,v);
  }

  // 多选组：以 data-name 标记
  document.querySelectorAll('.checkbox-grid').forEach(grid=>{
    const name = grid.getAttribute('data-name');
    if(!name) return;
    const list = Array.from(grid.querySelectorAll('input[type="checkbox"]:checked')).map(i=> i.value);
    set(data, name, list);
  });

  // 将空字符串标准化为 undefined，方便后端处理
  function cleanup(obj){
    for(const k in obj){
      if(obj[k] && typeof obj[k]==='object') cleanup(obj[k]);
      else if(obj[k]==='') obj[k]=undefined;
    }
    return obj;
  }
  return cleanup(data);
}

function set(obj, path, value){
  const keys = path.split('.');
  let cur = obj;
  for(let i=0;i<keys.length-1;i++){
    cur[keys[i]] = cur[keys[i]] || {};
    cur = cur[keys[i]];
  }
  cur[keys.at(-1)] = value;
}

function restore(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const data = JSON.parse(raw);
    fillForm(data);
  }catch(e){}
}

function fillForm(data, prefix=''){
  if(!data) return;
  for(const k in data){
    const v = data[k];
    if(v && typeof v==='object'){
      fillForm(v, prefix ? `${prefix}.${k}` : k);
    }else{
      const name = prefix ? `${prefix}.${k}` : k;
      const el = form.querySelector(`[name="${cssEscape(name)}"]`);
      if(el){
        el.value = v ?? '';
      }else{
        // 多选在 change 时处理，这里忽略
      }
    }
  }
  // 多选组恢复
  document.querySelectorAll('.checkbox-grid').forEach(grid=>{
    const name = grid.getAttribute('data-name');
    const arr = get(data, name) || [];
    grid.querySelectorAll('input[type="checkbox"]').forEach(chk=>{
      chk.checked = arr.includes(chk.value);
    });
  });
}

function cssEscape(s){ return s.replace(/([\"\\#.;])/g,'\\$1'); }

function get(obj, path){
  const keys = path.split('.');
  let cur=obj;
  for(const k of keys){ if(!cur) return undefined; cur=cur[k]; }
  return cur;
}

function save(){
  const data = collect();
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    markSaved();
  }catch(e){
    showAutosave('保存失败，存储空间不足', true);
  }
}

function markSaved(){
  const t = new Date();
  showAutosave('已自动保存');
  lastSaved.textContent = `最后保存：${fmtTime(t)}`;
}

function fmtTime(d){
  const p=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function showAutosave(text, danger=false){
  autosaveLabel.textContent = text;
  autosaveLabel.style.color = danger ? 'var(--danger)' : 'var(--muted)';
  setTimeout(()=> autosaveLabel.textContent='', 2000);
}

function deriveStepFromData(){
  // 若必填已填，跳到下一步；否则回到第一步
  const data = collect();
  if(!get(data,'child.name') || !get(data,'child.gender') || !get(data,'child.dob')) return 1;
  if(!get(data,'dev.freq')) return 2;
  if(!get(data,'health.shape')) return 3;
  return 4;
}

function validateStep(step){
  clearInvalids();
  const requiredSelectors = {
    1: ['[name="child.name"]','input[name="child.gender"]','[name="child.dob"]'],
    7: ['[name="filler.name"]','[name="filler.relation"]','[name="filler.phone"]']
  };
  const list = requiredSelectors[step] || [];
  let ok = true;
  list.forEach(sel=>{
    const controls = form.querySelectorAll(sel);
    if(controls[0]?.type === 'radio'){
      const name = controls[0].name;
      const checked = form.querySelector(`input[name="${cssEscape(name)}"]:checked`);
      if(!checked){ markInvalid(controls[0].closest('fieldset') || controls[0]); ok=false; }
    }else{
      controls.forEach(c=>{
        if(!c.value){ markInvalid(c); ok=false; }
        if(c.name==='filler.phone' && c.value && !/^1[3-9]\d{9}$/.test(c.value)){
          markInvalid(c,'请输入有效的手机号'); ok=false;
        }
      });
    }
  });
  if(!ok) window.scrollTo({top: findFirstInvalidY(), behavior:'smooth'});
  return ok;
}

function markInvalid(el, msg='必填项未填写'){
  el.classList.add('invalid');
  if(el.insertAdjacentElement){
    const hint = document.createElement('div');
    hint.className='hint';
    hint.textContent = msg;
    el.after(hint);
  }
}

function clearInvalids(){
  form.querySelectorAll('.invalid').forEach(el=> el.classList.remove('invalid'));
  form.querySelectorAll('.hint').forEach(el=> el.remove());
}

function findFirstInvalidY(){
  const el = form.querySelector('.invalid');
  return (el?.getBoundingClientRect().top||100) + window.scrollY - 80;
}

function openPreview(){
  const data = collect();
  previewJson.textContent = JSON.stringify(data, null, 2);
  previewDialog.showModal();
}

async function copyPreviewJson(){
  try{
    await navigator.clipboard.writeText(previewJson.textContent);
    alert('已复制到剪贴板');
  }catch(e){
    alert('复制失败，请手动选择文本复制');
  }
}

function exportJsonFile(){
  const data = collect();
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `sports-talent-${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

async function onSubmit(e){
  e.preventDefault();
  if(!validateStep(7)) return;
  save();
  const payload = collect();

  // 如果配置了 SUBMIT_ENDPOINT 则 POST，否则本地模拟
  if(SUBMIT_ENDPOINT){
    try{
      btnSubmit.disabled = true; btnSubmit.textContent = '提交中…';
      const res = await fetch(SUBMIT_ENDPOINT, {
        method:'POST',
        headers: SUBMIT_HEADERS,
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json().catch(()=> ({}));
      submitResult.textContent = '提交成功！我们已收到您的信息。';
      submitResult.style.color = 'var(--ok)';
      track('submit_success', data);
      // 可选：清空
      // localStorage.removeItem(STORAGE_KEY);
    }catch(err){
      submitResult.textContent = '提交失败，请稍后重试或联系管理员。';
      submitResult.style.color = 'var(--danger)';
      track('submit_failed', {error:String(err)});
    }finally{
      btnSubmit.disabled = false; btnSubmit.textContent = '提交';
    }
  }else{
    // 模拟提交：仅展示本地 JSON
    submitResult.innerHTML = '当前为本地模式（未配置提交地址）。点击"预览结果/导出JSON/生成PDF"保存您的记录。';
    submitResult.style.color = 'var(--muted)';
    openPreview();
  }
}

function track(event, data){ /* 预留埋点 */ }

function announceSavedTime(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){ lastSaved.textContent = '未保存'; return; }
  try{
    const t = JSON.parse(raw)._savedAt;
  }catch(e){}
}