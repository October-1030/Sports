// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
  const themeSelect = document.getElementById('theme-select');
  const themeCss = document.getElementById('theme-css');
  
  // 从本地存储中恢复上次选择的主题
  const savedTheme = localStorage.getItem('selected-theme') || 'clean';
  themeSelect.value = savedTheme;
  updateTheme(savedTheme);
  
  // 监听主题选择变化
  themeSelect.addEventListener('change', function() {
    const selectedTheme = themeSelect.value;
    updateTheme(selectedTheme);
    localStorage.setItem('selected-theme', selectedTheme);
  });
  
  // 更新主题CSS链接
  function updateTheme(theme) {
    themeCss.href = `./themes/${theme}.css`;
  }
});