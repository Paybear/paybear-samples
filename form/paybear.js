(function() {
    this.Paybear = function () {

        if (window.paybear instanceof Paybear) {
            paybear.destroy();
            window.paybear = undefined;
        }

        this.state = {
            checkStatusInterval: null,
            interval: null,
            selected: 0,
            isConfirming: false,
            html: null,
        };

        var defaults = {
            timer: 15 * 60,
        };

        this.options = defaults;
        this.coinsBlock = document.querySelector('.PayBear__Icons');
        this.paymentBlock = document.querySelector('.Payment');
        this.paymentHeader = document.querySelector('.Payment__header');
        this.paymentHeaderTimer = document.querySelector('.Payment__header__timer');
        this.paymentHeaderTitle = document.querySelector('.Payment__header__title');
        this.paymentHeaderHelper = document.querySelector('.Payment__header__helper');

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        var requiredOptions = [
            'currencies',
            'statusUrl',
            'fiatValue',
        ];

        var options = this.options;
        requiredOptions.forEach(function (option) {
            if (typeof options[option] === 'undefined') {
                throw new Error(
                    option + ' is undefined'
                );
            }
        });

        var that = this;
        this.resizeListener = function () {
            paybearResizeFont(that.options.currencies[that.state.selected]['address']);
        };

        paybearInit.call(this);
    };

    Paybear.prototype.destroy = function () {
        var that = this;
        var state = that.state;
        var appContainer = document.querySelector('.PayBear-app');

        appContainer.style.display = 'none';

        if (state.html) {
            appContainer.innerHTML = state.html;
        }

        window.removeEventListener('resize', this.resizeListener, true);

        clearInterval(state.interval);
        clearInterval(state.checkStatusInterval);
    };

    this.PaybearModal = function (target) {
        this.state = {
            isShown: false
        };

        this.modal = target;
    };

    PaybearModal.prototype.show = function () {
        var that = this;

        that.state.isShown = true;

        var event = document.createEvent('HTMLEvents');
        event.initEvent('show', true, true);
        event.eventName = 'show';
        that.modal.dispatchEvent(event);

        paybearUpdate.call(that);
    };

    PaybearModal.prototype.hide = function () {
        var that = this;

        that.state.isShown = false;

        var event = document.createEvent('HTMLEvents');
        event.initEvent('hide', true, true);
        event.eventName = 'hide';
        that.modal.dispatchEvent(event);

        if (typeof paybear !== 'undefined') {
            paybear.destroy();
        }

        paybearUpdate.call(that);
    };

    function paybearUpdate() {
        var that = this;
        var openedModalClass = 'PayBearModal--open';
        var openedModalBodyClass = 'PayBearModal__Body--open';

        if (that.state.isShown) {
            that.modal.classList.add(openedModalClass);
            document.body.classList.add(openedModalBodyClass);
        } else {
            that.modal.classList.remove(openedModalClass);
            document.body.classList.remove(openedModalBodyClass);
        }
    }


    function paybearInit() {
        var that = this;
        var options = that.options;
        var state = that.state;
        var appContainer = document.querySelector('.PayBear-app');

        state.html = appContainer.innerHTML;

        appContainer.removeAttribute('style');

        if (typeof payBearFontLoaded === 'undefined') {
            loadGoogleFont();
        }

        document.querySelector('.PayBear__Nav__price span').textContent = options.fiatValue.toFixed(2);
        document.querySelector('.PayBear__Nav__arrow').addEventListener('click', function (e) {
            e.preventDefault();
            paybearBack.call(that);
        });

        if (options.currencies.length > 1) {
            fillCoins.call(that);
        } else {
            paybearPaymentStart.call(that);
        }
    }

    function fillCoins() {
        var that = this;
        var coinsContainer = document.querySelector('.PayBear__Icons');
        coinsContainer.innerHTML = '';

        that.options.currencies.map(function (item, index) {
            var classNames = ['PayBear__Item'];
            var coin = document.createElement('div');
            coin.setAttribute('role', 'button');
            coin.setAttribute('tabindex', 0);
            coin.classList = classNames.join(' ');
            coin.onclick = function (e) {
                e.preventDefault();
                that.state.selected = index;
                paybearPaymentStart.call(that);
            };

            coin.innerHTML = '<div class="PayBear__Item__icon">\n' +
                '<img src="' + item.icon + '" alt="' + item.title + '"></div>\n' +
                '<div class="PayBear__Item__code">' + item.code + '</div>\n' +
                '<div class="PayBear__Item__name">' + item.title + '</div>\n' +
                '<div class="PayBear__Item__val">' + item.rate + '</div>';

            coinsContainer.appendChild(coin);
        });
    }

    function paybearPaymentStart() {
        var that = this;
        var state = that.state;
        var options = that.options;

        that.coinsBlock.style.display = 'none';
        that.paymentBlock.removeAttribute('style');

        var selectedCoin = options.currencies[state.selected];
        var rate = selectedCoin.rate;
        var code = selectedCoin.code;
        document.querySelector('.Payment__header__helper').textContent = 'Rate Locked in At 1 ' + code + ' = $' + rate + ' USD';

        // timer
        that.paymentHeaderTimer.textContent = formatTimer(options.timer);
        state.interval = setInterval(function() {
            var timer = options.timer - 1;
            if (timer < 1) {
                that.paymentHeader.classList.add('Payment__header--red');
                that.paymentHeaderTitle.textContent = 'Payment Window Expired';
                that.paymentHeaderHelper.style.display = 'none';

                paybearPaymentExpired.call(that);

            } else if (timer < 60) {
                that.paymentHeader.classList.add('Payment__header--red');
                that.paymentHeaderTitle.textContent = 'Window Expiring Soon';
                that.paymentHeaderHelper.style.display = 'none';
            }
            if (timer >= 0) {
                options.timer = timer;
                that.paymentHeaderTimer.textContent = formatTimer(timer);
            } else {
                clearInterval(state.interval);
                clearInterval(state.checkStatusInterval);
            }
        }, 1000);

        // coin icon
        var icon = document.querySelector('.Payment__value__icon img');
        icon.setAttribute('src', selectedCoin.icon);
        icon.setAttribute('alt', selectedCoin.title);

        // coin value
        var value = document.querySelector('.Payment__value__coins');
        value.textContent = selectedCoin.coinsValue;

        // copy value btn
        var copy = document.querySelector('.Payment__value__copy');
        copy.addEventListener('click', copyValue);
        value.addEventListener('click', copyValue);
        function copyValue() {
            paybearCopyToClipboard(selectedCoin.coinsValue);
            var tooltip = document.querySelector('.Payment__value__tooltip');
            tooltip.classList.add('Payment__value__tooltip--visible');
            tooltip.addEventListener('transitionend', function tooltipTransition() {
                this.classList.remove('Payment__value__tooltip--visible');
                this.removeEventListener('transitionend', tooltipTransition, false);
            });
        }

        // qr code
        var qr = document.querySelector('.Payment__qr img');
        if (selectedCoin.walletLink) {
            qr.setAttribute('src', 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + encodeURIComponent(selectedCoin.walletLink));
        } else {
            qr.setAttribute('src', 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + encodeURIComponent(selectedCoin.address));
        }

        document.querySelector('.Payment__address--second code').textContent = selectedCoin.address;

        // wallet btn
        var walletBtn = document.querySelector('.P-wallet-btn');
        if (selectedCoin.metamask && typeof web3 !== 'undefined' && web3.eth.accounts.length) {
            console.log('metamask detected');
            var metamaskBtnText = 'Pay with MetaMask';
            walletBtn.textContent = metamaskBtnText;
            walletBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('metamask invoked');
                var btn = this;
                btn.setAttribute('disabled', true);
                btn.textContent = 'Loading';
                web3.eth.sendTransaction({
                    from: web3.eth.accounts[0],
                    to: selectedCoin.address,
                    value: web3.toWei(+selectedCoin.coinsValue)
                }, function(err, data) {
                    btn.removeAttribute('disabled');
                    btn.textContent = metamaskBtnText;
                    if(err) {
                        console.log('metamask error');
                    } else {
                        console.log(data);
                        //success
                        paybearPaymentConfirming.call(that, 0);
                    }
                });
            });
        } else if (selectedCoin.walletLink) {
            walletBtn.setAttribute('href', selectedCoin.walletLink);
        } else {
            walletBtn.style.display = 'none';
        }

        paybearResizeFont(selectedCoin.address);
        window.addEventListener('resize', this.resizeListener, true);

        // copy address btn
        document.querySelector('.Payment__address__text').textContent = 'Send ' + selectedCoin.coinsValue + ' ' + selectedCoin.code + ' to this Address';
        var copyAddress = document.querySelector('.P-btn-copy-address');
        var copiedBox = document.querySelector('.Payment__copied__box');
        copyAddress.addEventListener('click', function () {
            paybearCopyToClipboard(selectedCoin.address);
            copiedBox.querySelector('.Payment__address code').textContent = selectedCoin.address;
            copiedBox.style.display = 'block';
            copiedBox.querySelector('button').addEventListener('click', function copiedBoxButtonHandler() {
                copiedBox.style.display = 'none';
                this.removeEventListener('click', copiedBoxButtonHandler, false);
            });
            copiedBox.querySelectorAll('.Payment__copied__helper__side')[0].querySelector('code').textContent = selectedCoin.address.slice(0, 3);
            copiedBox.querySelectorAll('.Payment__copied__helper__side')[1].querySelector('code').textContent = selectedCoin.address.slice(-3);
        });

        // tabs
        var tabs = document.querySelectorAll('.P-Tabs__Tab');
        var tabPanels = document.querySelectorAll('.P-Tabs__Tab-panel');
        tabs[0].addEventListener('click', function (e) {
            this.parentNode.classList.remove('P-Tabs__Tab-list--second');
            tabs[1].classList.remove('P-Tabs__Tab--selected');
            this.classList.add('P-Tabs__Tab--selected');
            tabPanels[1].classList.remove('P-Tabs__Tab-panel--selected');
            tabPanels[0].classList.add('P-Tabs__Tab-panel--selected');
        });
        tabs[1].addEventListener('click', function (e) {
            this.parentNode.classList.add('P-Tabs__Tab-list--second');
            tabs[0].classList.remove('P-Tabs__Tab--selected');
            this.classList.add('P-Tabs__Tab--selected');
            tabPanels[0].classList.remove('P-Tabs__Tab-panel--selected');
            tabPanels[1].classList.add('P-Tabs__Tab-panel--selected');
        });

        state.checkStatusInterval = setInterval(function () {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.responseText) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        clearInterval(state.checkStatusInterval);
                        paybearPaymentConfirmed.call(that, response.redirect_url);
                    }

                    if (response.confirmations !== undefined) {
                        paybearPaymentConfirming.call(that, response.confirmations);
                    }
                }
            };
            xhr.open('GET', options.statusUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        }, 10000);
    }

    function paybearPaymentExpired() {
        var that = this;
        var state = that.state;
        clearInterval(state.interval);
        clearInterval(state.checkStatusInterval);
        var paymentExpired = document.querySelector('.Payment__expired');
        var paymentStart = document.querySelector('.Payment__start');
        paymentStart.style.display = 'none';
        paymentExpired.removeAttribute('style');

        // helper
        var showPaymentHelper = paymentExpired.querySelector('.Payment__helper');
        var paymentHelper = document.querySelector('.Payment__expired-helper');
        var paymentHelperBtn = document.querySelector('.Payment__expired-helper button');
        showPaymentHelper.addEventListener('click', function () {
            paymentExpired.style.display = 'none';
            paymentHelper.removeAttribute('style');
        });
        paymentHelperBtn.addEventListener('click', function () {
            paymentExpired.removeAttribute('style');
            paymentHelper.style.display = 'none';
        });

        paymentExpired.querySelector('.P-btn').addEventListener('click', function (e) {
            e.preventDefault();
            paybearBack.call(that);
        });
    }

    function paybearPaymentConfirming(confirmations) {
        var that = this;
        var options = that.options;
        var state = that.state;
        var isConfirming = state.isConfirming;
        var selectedCoin = options.currencies[state.selected];

        if (!isConfirming) {
            that.paymentHeader.classList.remove('Payment__header--red');
            window.removeEventListener('resize', that.resizeListener, true);
            clearInterval(state.interval);

            var timer = 0;
            that.paymentHeaderTimer.textContent = formatTimer(timer);
            this.state.interval = setInterval(function () {
                ++timer;
                that.paymentHeaderTimer.textContent = formatTimer(timer);
            }, 1000);

            var paymentStart = document.querySelector('.Payment__start');
            var paymentConfirming = document.querySelector('.Payment__confirming');
            paymentStart.style.display = 'none';
            paymentConfirming.removeAttribute('style');

            // helper
            var showPaymentHelper = paymentConfirming.querySelector('.Payment__helper');
            var paymentHelper = document.querySelector('.Payment__confirming-helper');
            var paymentHelperBtn = document.querySelector('.Payment__confirming-helper button');
            showPaymentHelper.addEventListener('click', function () {
                var blockExplorer = options.currencies[state.selected].blockExplorer;
                paymentConfirming.style.display = 'none';
                paymentHelper.removeAttribute('style');
                if (blockExplorer) {
                    paymentHelper.querySelector('.block-explorer-li').style.display = 'block';
                    paymentHelper.querySelector('.P-block-explorer').setAttribute('href', blockExplorer);
                }

            });
            paymentHelperBtn.addEventListener('click', function () {
                paymentConfirming.removeAttribute('style');
                paymentHelper.style.display = 'none';
            });

            //header
            that.paymentHeaderTitle.textContent = 'Confirming Payment';

            document.querySelector('.P-confirmations')
                .innerHTML = 'Your payment will be finalized' +
                ' after <strong class="P-confirmations">' + selectedCoin.confirmations +'</strong> ' +
                (selectedCoin.confirmations === 1 ? 'confirmation' : 'confirmations') +
                ' on the network.';
            paymentConfirming.querySelector('.P-btn').addEventListener('click', function (e) {
                e.preventDefault();
                paybearBack.call(that);
            });
        }

        that.paymentHeaderHelper.textContent = confirmations + ' / ' + selectedCoin.confirmations + (selectedCoin.confirmations === 1 ? ' Confirmation' : ' Confirmations');
        document.querySelector('.Confirming__icon').classList.value = 'Confirming__icon' + (selectedCoin.confirmations < 4 ? ' Confirming__icon--small' : '') + (selectedCoin.confirmations > 4 ? ' Confirming__icon--full' : '');
        document.querySelector('.Confirming__icon svg').classList.value = 'Confirming__pic Confirming__pic--' + confirmations;
        this.state.isConfirming = true;
    }

    function paybearPaymentConfirmed(redirect) {
        var that = this;
        var state = that.state;
        var options = that.options;
        var selectedCoin = options.currencies[state.selected];
        clearInterval(state.interval);
        clearInterval(state.checkStatusInterval);

        var paymentConfirming = document.querySelector('.Payment__confirming');
        var paymentConfirmed = document.querySelector('.Payment__confirmed');
        paymentConfirming.style.display = 'none';
        paymentConfirmed.removeAttribute('style');

        //header
        that.paymentHeader.classList.remove('Payment__header--red');
        that.paymentHeader.classList.add('Payment__header--green');
        that.paymentHeaderTitle.textContent = 'Payment Confimed';
        that.paymentHeaderHelper.textContent = selectedCoin.confirmations + ' Confirmations found';
        that.paymentHeaderTimer.style.display = 'none';
        document.querySelector('.Payment__header__check').style.display = 'block';

        if (options.redirectTo) {
            paymentConfirmed.querySelector('.P-btn').setAttribute('href', options.redirectTo);
        } else {
            paymentConfirmed.querySelector('.P-btn').addEventListener('click', function (e) {
                e.preventDefault();
                paybearBack.call(that);
            });
        }

        if (options.redirectTo) {
            redirect = options.redirectTo;
        }

        setTimeout(function () {
            window.location.href = redirect;
            if (redirect.indexOf(window.location.href) > -1) {
                window.location.reload();
            }
        }, 5000);

    }

    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    function formatTimer(timer) {
        var minutes = parseInt(timer / 60, 10);
        var seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }

    function paybearCopyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData('Text', text);
        } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            var textarea = document.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
            textarea.style.fontSize = '62px';
            document.querySelector('.PayBear-app').appendChild(textarea);

            if (navigator.userAgent.match(/ipad|iphone/i)) {

                var editable = textarea.contentEditable;
                var readOnly = textarea.readOnly;

                textarea.contentEditable = true;
                textarea.readOnly = false;

                var range = document.createRange();
                range.selectNodeContents(textarea);

                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                textarea.setSelectionRange(0, 999999);
                textarea.contentEditable = editable;
                textarea.readOnly = readOnly;

            } else {
                textarea.select();
            }

            try {
                return document.execCommand('copy');  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
                return false;
            } finally {
                document.querySelector('.PayBear-app').removeChild(textarea);
            }
        }
    }

    function loadGoogleFont() {
        window.payBearFontLoaded = true;
        WebFontConfig = {
            google: {
                families: ['Overpass:300,400,600,700']
            }
        };

        (function(d) {
            var wf = d.createElement('script'), s = d.scripts[0];
            wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
            wf.async = true;
            s.parentNode.insertBefore(wf, s);
        })(document);
    }

    function paybearBack() {
        if (this.options.onBackClick) {
            this.options.onBackClick();
        } else if (typeof window.paybearModalPlugin !== 'undefined') {
            window.paybearModalPlugin.hide();
        } else if (typeof window.paybear !== 'undefined') {
            window.paybear.destroy();
        }
    }

    function paybearResizeFont(address) {
        var addressContainerWidth = document.querySelector('.Payment__address').clientWidth;
        var addressCode = document.querySelector('.Payment__address code');
        // detecting computed letter width + offset
        addressCode.innerHTML = '<span>A</span>';
        var addressCodeSpan = addressCode.querySelector('span');
        addressCodeSpan.style.display = 'inline-block';
        var letterWidth = parseFloat(window.getComputedStyle(addressCodeSpan, null).width);
        addressCode.innerHTML = '';
        letterWidth = letterWidth + (letterWidth * 0.06);
        // computing font-size
        var addressLength = address.split('').length;
        var addressLetterWidth = addressContainerWidth / addressLength;
        var currentFontSize = parseInt(window.getComputedStyle(addressCode, null).fontSize);
        var fontSize = Math.ceil(addressLetterWidth * currentFontSize / letterWidth);
        addressCode.style.fontSize = (fontSize > 52 ? 52 : fontSize) + 'px';

        addressCode.textContent = address;

        document.querySelectorAll('.Payment__address code').forEach(function (item) {
            item.style.fontSize = (fontSize > 52 ? 52 : fontSize) + 'px';
        });
    }

}());

function paybearForm(button, url, modal) {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        if (modal) {
            window.paybearModalPlugin = new PaybearModal();
            paybearModalPlugin.show();

            modal.addEventListener('hide', function handleModalHide() {
                this.removeEventListener('hide', handleModalHide);
            });
        }

        beforeSend();

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            try {
                document.querySelector('.PayBear-spinner').style.display = 'none';
                window.paybear = new Paybear(JSON.parse(xhr.responseText));
            } catch (e) {
                console.error(e);
                handleError();
            }
        };
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = function () {
            handleError();
        };
        xhr.send();
    });

    function beforeSend() {
        document.querySelector('.PayBear-spinner').removeAttribute('style');
        document.querySelector('.PayBear-app').style.display = 'none';
        document.querySelector('.PayBear-app-error').style.display = 'none';
    }

    function handleError() {
        document.querySelector('.PayBear-spinner').style.display = 'none';
        document.querySelector('.PayBear-app').style.display = 'none';
        if (modal) {
            document.querySelector('.PayBear-app-error').style.display = 'block';
            document.querySelector('.PayBearModal__Content').addEventListener('click', function errorClose() {
                window.paybearModalPlugin.hide();
                this.removeEventListener('click', errorClose, false);
            }, false);
        } else {
            document.querySelector('.PayBear-app-error').removeAttribute('style');
        }
    }
}

function paybearForm(button, url, modal) {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        if (modal) {
            window.paybearModalPlugin = new PaybearModal(modal);
            paybearModalPlugin.show();

            modal.addEventListener('hide', function handleModalHide() {
                this.removeEventListener('hide', handleModalHide);
            });
        }

        beforeSend();

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            try {
                document.querySelector('.PayBear-spinner').style.display = 'none';
                window.paybear = new Paybear(JSON.parse(xhr.responseText));
            } catch (e) {
                console.error(e);
                handleError();
            }
        };
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = function () {
            handleError();
        };
        xhr.send();
    });

    function beforeSend() {
        document.querySelector('.PayBear-spinner').removeAttribute('style');
        document.querySelector('.PayBear-app').style.display = 'none';
        document.querySelector('.PayBear-app-error').style.display = 'none';
    }

    function handleError() {
        document.querySelector('.PayBear-spinner').style.display = 'none';
        document.querySelector('.PayBear-app').style.display = 'none';
        if (modal) {
            document.querySelector('.PayBear-app-error').style.display = 'block';
            document.querySelector('.PayBearModal__Content').addEventListener('click', function errorClose() {
                window.paybearModalPlugin.hide();
                this.removeEventListener('click', errorClose, false);
            }, false);
        } else {
            document.querySelector('.PayBear-app-error').removeAttribute('style');
        }
    }
}