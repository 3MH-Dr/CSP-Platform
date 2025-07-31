let isEditing = false;

// ✅ 你未来只需替换这两个变量即可换图
const DEFAULT_ICON_URL = 'custom-default-icon.png'; // 可替换成本地图标、CDN图标或Base64
const DEFAULT_ICON = 'data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <circle cx="16" cy="16" r="16" fill="#ddeeff"/>
  </svg>
`);

let platforms = JSON.parse(localStorage.getItem('customPlatforms')) || [
  {
    name: 'B站',
    logo: 'https://www.bilibili.com/favicon.ico',
    searchUrl: 'https://search.bilibili.com/all?keyword='
  },
  {
    name: '小红书',
    logo: 'https://www.xiaohongshu.com/favicon.ico',
    searchUrl: 'https://www.xiaohongshu.com/search_result?keyword='
  },
  {
    name: '知乎',
    logo: 'https://static.zhihu.com/heifetz/favicon.ico',
    searchUrl: 'https://www.zhihu.com/search?type=content&q='
  }
];

let currentIndex = 0;

function updatePlatform(index) {
  currentIndex = index;
  const platform = platforms[currentIndex];
  document.getElementById('platformName').innerText = platform.name;

  const logoImg = document.getElementById('toggleSidebar');
  logoImg.src = platform.logo;

  // ✅ 切换时如果图标无效，显示默认蓝色图标（此处可改成 DEFAULT_ICON_URL）
  logoImg.onerror = () => {
    logoImg.src = DEFAULT_ICON; // ← 你未来可以把 DEFAULT_ICON 改成 DEFAULT_ICON_URL
  };
}

function handleKey(event) {
  if (event.key === 'Enter') {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
      const url = platforms[currentIndex].searchUrl + encodeURIComponent(query);
      window.open(url, '_blank');
    }
  }
}

// 原来renderSidebar只有简单生成图标，这里是改写后的核心函数
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';  // 清空原有内容

  platforms.forEach((p, index) => {
    // 新增一个图标外层容器，用于定位叉号
    const wrapper = document.createElement('div');
    wrapper.className = 'platform-icon';

    const img = document.createElement('img');
    img.src = p.logo;
    img.title = p.name;
    img.onerror = () => { img.src = DEFAULT_ICON; };
    img.onclick = () => {
      if (!isEditing) {     // 非编辑状态点击切换平台
        updatePlatform(index);
        sidebar.style.display = 'none';
      }
    };

    // 新增删除叉号
    const del = document.createElement('div');
    del.className = 'delete-icon';
    del.innerText = '×';
    del.onclick = (e) => {
      e.stopPropagation();
      platforms.splice(index, 1);
      localStorage.setItem('customPlatforms', JSON.stringify(platforms));
      renderSidebar();
    };

    // 编辑模式显示删除叉号，否则隐藏
    del.style.display = isEditing ? 'block' : 'none';

    wrapper.appendChild(img);
    wrapper.appendChild(del);
    sidebar.appendChild(wrapper);
  });

  // 新增操作按钮区域，原来没有或只有加号
  const buttons = document.createElement('div');
  buttons.className = 'sidebar-buttons';

  const addBtn = document.createElement('div');
  addBtn.className = 'add-button';
  addBtn.id = 'addPlatform';
  addBtn.innerText = '+';
  addBtn.onclick = () => {
    const name = prompt('请输入平台名称');
    const logo = prompt('请输入平台图标 URL');
    const searchUrl = prompt('请输入搜索 URL（必须包含关键词占位符）');
    if (name && searchUrl) {
      platforms.push({
        name,
        logo: logo || DEFAULT_ICON,
        searchUrl
      });
      localStorage.setItem('customPlatforms', JSON.stringify(platforms));
      renderSidebar();
    }
  };

  const editBtn = document.createElement('div');
  editBtn.className = 'edit-button';
  editBtn.id = 'editPlatform';
  editBtn.innerText = '−';
  editBtn.onclick = () => {
    isEditing = true;   // 进入编辑状态
    renderSidebar();
  };

  const confirmBtn = document.createElement('div');
  confirmBtn.className = 'confirm-button';
  confirmBtn.id = 'confirmEdit';
  confirmBtn.innerText = '✔';
  confirmBtn.onclick = () => {
    isEditing = false;  // 退出编辑状态
    renderSidebar();
  };

  // 编辑状态显示“对号”，否则显示“加号”和“减号”
  if (isEditing) {
    buttons.appendChild(confirmBtn);
  } else {
    buttons.appendChild(addBtn);
    buttons.appendChild(editBtn);
  }

  sidebar.appendChild(buttons);
}


document.getElementById('toggleSidebar').onclick = () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
};

updatePlatform(0);
renderSidebar();
