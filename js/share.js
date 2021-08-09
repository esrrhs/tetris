/*
 * @Author: geek
 * @LastEditors: geek
 * @Description: 生成分享图片功能
 * @Src: https://geek.qq.com/tetris/js/share.js (编译前的源文件)
 */
((global) => {
  const Share = {
    template: `<div v-show="visible" class="dialog share-dialog">
                <div class="dialog-cont">
                  <canvas ref="shareCanvas"></canvas>
                  <canvas ref="qrcode"></canvas>
                  <img ref="shareBgImg" class="bg-img" src="img/share.png" @load="onBgImgLoad">
                  <img :src="imgData" class="res-img">
                  <div class="title">
                    <p>{{ saveActionText }}保存图片</p>
                    <div class="close" @click="visible = false">×</div>
                  </div>
                </div>
              </div>`,
    data() {
      return {
        bgImgLoaded: false,
        bgImgSize: [0, 0],
        visible: false,
        imgData: '',
        saveActionText: global.pageInfo.isMobile ? '长按' : '右键',
      };
    },
    methods: {
      show(score) {
        const text = this.getText(score);

        this.visible = true;
        this.$nextTick(() => {
          this.renderShareImg(text);
        });
      },
      onBgImgLoad() {
        this.bgImgLoaded = true;
        this.bgImgSize = [this.$refs.shareBgImg.width, this.$refs.shareBgImg.height];
      },
      renderShareImg(text) {
        const $canvas = this.$refs.shareCanvas;
        const $img = this.$refs.shareBgImg;
        const ctx = $canvas.getContext('2d');
        const [posterW, posterH] = this.bgImgSize;
        const dpr = posterW / this.$refs.shareCanvas.clientWidth;

        $canvas.width = this.$refs.shareCanvas.clientWidth * dpr;
        $canvas.height = this.$refs.shareCanvas.clientHeight * dpr;

        if (this.bgImgLoaded) {
          ctx.drawImage($img, 0, 0, posterW, posterH);
          this.renderText(ctx, posterW, posterH, text);
          this.renderQrcode(ctx, posterW, posterH, $canvas);
          global.beacon.onDirectUserAction('generate', {
            score: text.score,
          });
        } else {
          alert('分享图片资源还未下载完毕，请等待几秒后重试');
        }
      },
      getText(score) {
        const text = {
          score,
          badge: '',
          res: '',
          t1: '',
          t2: '',
          share1: '',
          share2: '',
        };

        if (score === undefined) {
          text.t1 = '所有人的';
          text.t2 = '极客版的';
          text.share1 = '技术闯关之旅';
          text.share2 = '俄罗斯方块';
        } else {
          text.t1 = '我得到';
          text.t2 = '被授予';
          if (score >= 0 && score < 1000) {
            text.res = '还没进入状态吧？要不要再试一次？';
            text.share1 = '俄罗斯方块挑战，';
            text.share2 = '就差你一个！';
          } else if (score >= 1000 && score < 10000) {
            text.res = '小试牛刀，多来几局冲击高分吧！';
            text.share1 = '小试牛刀，';
            text.share2 = '一起来挑战吧！';
          } else if (score >= 10000 && score < 50000) {
            text.res = '你就是俄罗斯方块高手，再来一局向更高的称号冲击！';
            text.badge = '俄罗斯方块高手';
          } else if (score >= 50000 && score < 100000) {
            text.res = '你就是俄罗斯方块专家，加油，离顶峰只差一步！';
            text.badge = '俄罗斯方块专家';
          } else if (score >= 100000) {
            text.res = '霸占榜首，你就是俄罗斯方块大师！';
            text.badge = '俄罗斯方块大师';
          }
        }

        return text;
      },
      renderText(ctx, posterW, posterH, text) {
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'right';

        const marginValues = {
          l1: posterW * 0.92,
          l2: posterH * 0.76,
          l3: posterH * 0.69,
          l4: posterH * 0.61,
          l5: posterH * 0.54,
          l6: posterW * 0.08,
        };

        if (text.score === undefined) {
          ctx.font = '60px PingFang SC';
          ctx.fillText(text.t1, marginValues.l1, marginValues.l5);
          ctx.font = '100px hp';
          ctx.fillText(text.share1, marginValues.l1, marginValues.l4);

          ctx.font = '60px PingFang SC';
          ctx.fillText(text.t2, marginValues.l1, marginValues.l3);
          ctx.font = '100px hp';
          ctx.fillText(text.share2, marginValues.l1, marginValues.l2);
        } else {
          ctx.font = '60px PingFang SC';
          ctx.fillText(text.t1, marginValues.l1, marginValues.l5);
          ctx.font = '100px hp';
          ctx.fillText(`${text.score}分`, marginValues.l1, marginValues.l4);

          if (text.badge) {
            ctx.font = '60px PingFang SC';
            ctx.fillText(text.t2, marginValues.l1, marginValues.l3);
            ctx.font = '100px hp';
            ctx.fillText(text.badge, marginValues.l1, marginValues.l2);
          } else {
            ctx.font = '100px hp';
            ctx.textAlign = 'left';
            ctx.fillText(text.share1, marginValues.l6, marginValues.l3);
            ctx.font = '100px hp';
            ctx.textAlign = 'right';
            ctx.fillText(text.share2, marginValues.l1, marginValues.l2);
          }
        }
      },
      renderQrcode(ctx, posterW, posterH, qrCnvas) {
        let srcChannel = '';
        try {
          srcChannel = localStorage.getItem('SRC_CHANNEL') || '';
        } catch (e) {}

        window.QRCode.toCanvas(
          this.$refs.qrcode,
          `https://geek.qq.com/tetris/#/intro?channel=${srcChannel}`,
          {
            width: 200,
            margin: 2,
          },
          (err) => {
            if (err) console.error(err);
            ctx.drawImage(this.$refs.qrcode, 0.77 * posterW, 0.86 * posterH);
            this.imgData = qrCnvas.toDataURL();
          }
        );
      },
    },
  };

  global.Share = Share;
})(window);
