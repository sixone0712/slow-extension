(function () {
  'use strict';

  if (!location.pathname.startsWith('/main.act')) return;
  if (localStorage.getItem('slowEnabled') === 'false') return;

  var _open = window.open;
  var _submit = HTMLFormElement.prototype.submit;
  var lastForm = null;
  var formSubmitted = false;

  window.open = function (url, target, features) {
    if (target && target.startsWith('POPUP_CHAT')) {
      return openChatInOverlay(target);
    }
    return _open.call(this, url, target, features);
  };

  // form.submit 인터셉트: form 저장용
  HTMLFormElement.prototype.submit = function () {
    if (this.target && this.target.startsWith('POPUP_CHAT')) {
      lastForm = this;
      formSubmitted = true;
    }
    return _submit.call(this);
  };

  // 채팅 아이템 클릭 감지: fallback으로 재오픈
  document.addEventListener(
    'click',
    function (e) {
      var li = e.target.closest('#chattingUl > li');
      if (!li) return;

      formSubmitted = false;

      setTimeout(function () {
        if (!formSubmitted && lastForm) {
          var host = document.getElementById('slow-host');
          if (host) host.remove();
          var target = lastForm.target || 'POPUP_CHAT_FALLBACK';
          openChatInOverlay(target);
          if (!document.contains(lastForm)) {
            document.body.appendChild(lastForm);
          }
          lastForm.target = target;
          _submit.call(lastForm);
          lastForm.remove();
        }
      }, 0);
    },
    true,
  );

  function openChatInOverlay(target) {
    var existing = document.getElementById('slow-host');
    if (existing) existing.remove();

    var host = document.createElement('div');
    host.id = 'slow-host';
    var shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML =
      '<style>' +
      '@keyframes slide-in { from { transform:translateX(100%); } to { transform:translateX(0); } }' +
      ':host { position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; }' +
      '.overlay { width:100%; height:100%; background:#fff; display:flex; flex-direction:column; animation:slide-in 0.3s ease-in; user-select:none; }' +
      '.header { height:40px; background:#f5f5f5; display:flex; align-items:center; padding:0 12px; ' +
      'cursor:pointer; flex-shrink:0; font-size:14px; border-bottom:1px solid #e0e0e0; user-select:none; }' +
      '.header:hover { background:#eee; }' +
      '.back-icon { margin-right:8px; }' +
      'iframe { flex:1; border:none; width:100%; }' +
      '</style>' +
      '<div class="overlay">' +
      '<div class="header">' +
      '<span class="back-icon">\u2190</span> \uB4A4\uB85C' +
      '</div>' +
      '<iframe name="' + target + '"></iframe>' +
      '</div>';

    shadow.querySelector('.header').addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      host.remove();
    });

    host.addEventListener('click', function (e) { e.stopPropagation(); });
    host.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    host.addEventListener('mouseup', function (e) { e.stopPropagation(); });

    document.body.appendChild(host);

    var iframe = shadow.querySelector('iframe');
    iframe.addEventListener('load', function () {
      try {
        iframe.contentDocument.addEventListener(
          'keydown',
          function (e) {
            if (e.key === 'Escape') {
              e.stopImmediatePropagation();
              e.preventDefault();
              host.remove();
            }
          },
          true,
        );
        iframe.contentWindow.close = function () {
          host.remove();
        };
      } catch (err) {}
    });

    return iframe.contentWindow;
  }

  document.addEventListener(
    'keydown',
    function (e) {
      if (e.key === 'Escape') {
        var host = document.getElementById('slow-host');
        if (host) {
          e.stopImmediatePropagation();
          e.preventDefault();
          host.remove();
        }
      }
    },
    true,
  );

})();
