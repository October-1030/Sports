/* ========= 表单提交（Formspree 自愈版） ========= */
/* 你的 Formspree endpoint：*/
const SUBMIT_ENDPOINT = 'https://formspree.io/f/movnqvan';
const SUBMIT_HEADERS = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

/* 工具：创建元素并插入到参考节点后面 */
function ensureAfter(refNode, html) {
  const wrap = document.createElement('div');
  wrap.innerHTML = html.trim();
  const node = wrap.firstElementChild;
  refNode.parentNode.insertBefore(node, refNode.nextSibling);
  return node;
}

/* 1) 找到或修正表单、按钮、提示区 */
function ensureBasics() {
  let form = document.getElementById('survey-form') || document.querySelector('form');
  if (!form) {
    // 页面没有表单就不处理
    console.warn('未找到 <form>，提交功能未启用');
    return {};
  }
  if (!form.id) form.id = 'survey-form';

  let btn = document.getElementById('btn-submit');
  if (!btn) {
    // 自动创建一个提交按钮，放到表单最末尾
    btn = document.createElement('button');
    btn.id = 'btn-submit';
    btn.type = 'button';
    btn.textContent = '提交';
    btn.className = 'primary';
    form.appendChild(btn);
  }

  let tip = document.getElementById('submit-result');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'submit-result';
    tip.style.marginTop = '8px';
    form.appendChild(tip);
  }

  return { form, btn, tip };
}

/* 2) 给没有 name 的控件补一个（用它的 id） */
function normalizeNames(form) {
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(el => {
    if (!el.name) {
      if (el.id) el.name = el.id;
      else {
        // 为彻底无 id 的控件生成一个唯一 name
        el.name = 'field_' + Math.random().toString(36).slice(2, 8);
      }
    }
  });
}

/* 3) 收集表单数据 */
function collectFormData(form) {
  normalizeNames(form);
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  data.__submitted_at = new Date().toISOString();
  return data;
}

/* 4) 提交到 Formspree */
async function submitToServer(payload, btn) {
  btn && (btn.disabled = true);
  try {
    const res = await fetch(SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: SUBMIT_HEADERS,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    btn && (btn.disabled = false);
  }
}

/* 5) 绑定事件（按钮点击 & 表单提交） */
(function initSubmit() {
  const { form, btn, tip } = ensureBasics();
  if (!form || !btn) return;

  const showTip = (ok, msg) => {
    if (!tip) return;
    tip.style.fontSize = '14px';
    tip.style.color = ok ? '#16a34a' : '#ef4444';
    tip.textContent = msg;
  };

  async function handleSubmit(e) {
    e && e.preventDefault();
    const payload = collectFormData(form);
    const { ok, error } = await submitToServer(payload, btn);
    if (ok) {
      showTip(true, '✅ 提交成功，我们已收到您的信息！');
      try { localStorage.removeItem('sports-talent-form.v1'); } catch {}
      // 如需跳转感谢页，请取消下一行注释并替换路径
      // location.href = '/thanks.html';
    } else {
      showTip(false, '❌ 提交失败，请稍后再试 ' + (error || ''));
    }
  }

  // 点击按钮提交
  btn.addEventListener('click', handleSubmit);
  // 回车提交（如果按钮不存在或用户按回车）
  form.addEventListener('submit', handleSubmit);
})();
