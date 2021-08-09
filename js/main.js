/*
 * @Author: geek
 * @LastEditors: geek
 * @Description: 入口文件
 * @Src: https://geek.qq.com/tetris/js/main.js (编译前的源文件)
 */
((global) => {
  const { Vue } = global;
  const viewportRatio = 0.6;
  const fontSzieBase = 1.5;

  // 动态容器计算
  const resizeHandler = () => {
    const $app = document.querySelector('#app');
    const ratio = global.innerWidth / global.innerHeight;
    let cssText = '';

    if (ratio < viewportRatio) {
      cssText += `width: ${global.innerWidth}px;`;
      cssText += `height: ${global.innerWidth / viewportRatio}px;`;
      cssText += `font-size: ${fontSzieBase / viewportRatio}vw;`;
    } else {
      cssText += `width: ${global.innerHeight * viewportRatio}px;`;
      cssText += `height: ${global.innerHeight}px;`;
      cssText += `font-size: ${fontSzieBase}vh;`;
    }

    $app.style.cssText = cssText;
  };
  global.addEventListener('resize', resizeHandler);
  resizeHandler();

  // 禁用双击缩放
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 500) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );

  const yunPlusActivityUrl = 'https://cloud.tencent.com/developer/competition/introduction/10015';
  const mkActivityUrl = 'https://mk.woa.com/contest/40/rule';
  const isMobile = 'ontouchend' in document;
  const isInternal = location.hostname !== 'geek.qq.com';
  const internalChannelName = '腾讯员工赛道';
  const internalEntryUrl = isMobile
    ? 'https://oa.m.tencent.com/an:llvis/tetris/#/game'
    : 'https://geek.oa.com/tetris/#/game';
  const externalChannelName = '全国赛道';
  const externalEntryUrl = `${yunPlusActivityUrl}${isMobile ? '' : '/result'}`;
  const ruleUrl = isInternal ? mkActivityUrl : yunPlusActivityUrl;

  const pageInfo = {
    isMobile,
    isInternal,
    channel: isInternal ? internalChannelName : externalChannelName,
    gameUrl: isInternal ? internalEntryUrl : externalEntryUrl,
    internalChannelName,
    internalEntryUrl,
    externalChannelName,
    externalEntryUrl,
    ruleUrl,
  };
  global.pageInfo = pageInfo;

  const kvParse = (src = '', name, sep = ';') => {
    const pairs = src.split(sep);
    const ret = {};

    pairs.forEach((pair) => {
      const [k, v] = pair.trim().split('=');

      if (k) {
        ret[k] = v;
      }
    });

    return ret[name] || '';
  };
  const getUser = () => {
    if (location.hostname === 'geek.qq.com') {
      return kvParse(decodeURIComponent(kvParse(document.cookie, 'userInfo')), 'uid', '&');
    }
    return kvParse(document.cookie, 'geek-user');
  };
  global.user = getUser();

  // 获取、设置访问来源渠道
  let srcChannel = kvParse((location.hash.split('?') || ['', ''])[1], 'channel', '&');
  if (srcChannel) {
    try {
      localStorage.setItem('SRC_CHANNEL', srcChannel);
    } catch (e) {}
  } else {
    try {
      srcChannel = localStorage.getItem('SRC_CHANNEL') || '';
    } catch (e) {}
  }

  const beacon = new global.BeaconAction({
    appkey: location.hostname === 'localhost' ? '0WEB0F4AFG41OC1Z-test' : '0WEB0F4AFG41OC1Z',
    versionCode: '1.0.0',
    strictMode: false,
    onReportSuccess: (e) => {
      console.log(`onReportSuccess : ${e}`);
    },
    onReportFail: (e) => {
      console.log(`onReportFail : ${e}`);
    },
  });
  beacon.addAdditionalParams({
    user_name: global.user || '',
    channel: pageInfo.channel,
    src_channel: srcChannel,
  });

  global.beacon = beacon;

  const { PageIntro, PageGame, VueRouter } = global;
  const routes = [
    { path: '/', name: 'Intro', component: PageIntro, meta: { pageCnName: '首页' } },
    { path: '/intro', name: 'Intro', component: PageIntro, meta: { pageCnName: '首页' } },
    { path: '/game', name: 'Game', component: PageGame, meta: { pageCnName: '游戏页' } },
  ];
  const router = new VueRouter({
    // mode: location.hostname === "localhost" ? "hash" : "history",
    base: location.hostname === 'localhost' ? '/' : '/tetris',
    routes,
  });

  router.afterEach((to) => {
    const pageName = to.meta.pageCnName || 'unknown';

    beacon.onDirectUserAction('page_view', {
      page_name: pageName,
    });
  });

  new Vue({
    router,
  }).$mount('#app');
})(window);
