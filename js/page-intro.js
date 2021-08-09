/*
 * @Author: geek
 * @LastEditors: geek
 * @Description: 介绍页主文件
 * @Src: https://geek.qq.com/tetris/js/page-intro.js (编译前的源文件)
 */
((global) => {
  let tipRead = false;
  try {
    tipRead = JSON.parse(localStorage.getItem('TIP_READ'));
  } catch (e) {}

  const PageIntro = {
    template: '#template-intro',
    components: {
      Share: window.Share,
    },
    data() {
      return {
        pageInfo: {},
        tipVisible: !tipRead,
        tipRead,
      };
    },
    created() {
      this.pageInfo = global.pageInfo;
    },
    methods: {
      popShare() {
        this.$refs.share.show();
      },
      closeTip() {
        this.tipVisible = false;
        try {
          localStorage.setItem('TIP_READ', true);
        } catch (e) {}
      },
    },
  };

  global.PageIntro = PageIntro;
})(window);
