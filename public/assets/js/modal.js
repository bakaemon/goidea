
/**
 * 
 * @param {*} queryTarget 
 * @param {ModalOptions} options 
 */
var Modal = (function (queryTarget, options = {
    get: {
        url,
        overwrite: true
    },
    onOpen,
    onClose,
    title,
    header,
    body,
    footer

}) {
    var target;
    if (queryTarget instanceof HTMLElement) {
        target = queryTarget;
    } else if (typeof queryTarget === 'string') {
        target = document.querySelector(queryTarget);
    }
    var modal = document.createElement('div');
    modal.classList.add('modal');
    var overlay = document.createElement('div')
    overlay.classList.add('modal-overlay');
    overlay.addEventListener('click', function () {
        console.log('overlay clicked');
        instance.close();
    });
    modal.appendChild(overlay);
    var closeBtn = document.createElement('button');
    closeBtn.classList.add('modal-close');
    closeBtn.innerHTML = '&#10005;';
    var modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    modalContainer.appendChild(closeBtn);
    closeBtn.addEventListener('click', function () {
        console.log('close clicked');
        instance.close();
    });
    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    var modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    var modalTitle = document.createElement('h2');
    modalTitle.classList.add('modal-title');
    modalHeader.appendChild(modalTitle);
    var modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    var modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);


    modalContainer.appendChild(modalContent);
    modal.appendChild(modalContainer);
    target.appendChild(modal);
    var instance = {
        on: function (event, callback) {
            switch (event) {
                case 'open':
                    this.onOpen = callback;
                    break;
                case 'close':
                    this.onClose = callback;
                    break;
                default:
                    break;
            }
        },
        title: '',
        header: '',
        body: '',
        footer: '',
        onOpen: null,
        onClose: null,
        open: async function () {
            modal = document.querySelector('.modal'); // update modal reference
            if (options.get.url) {
                modal.querySelector('.modal-body').innerHTML = '<div class="loader"></div>';
                var res = await fetch(options.get.url);
                var html = await res.text();
                modal.querySelector('.modal-body').innerHTML = '';
                if (options.get.overwrite) {
                    modal.querySelector('.modal-body').innerHTML = html;
                } else {
                    modal.querySelector('.modal-body').innerHTML += html;
                }          
            }

            if (this.title) {
                modal.querySelector('.modal-title').innerHTML = this.title;
            }
            if (this.header) {
                modal.querySelector('.modal-header').innerHTML = this.header;
            }
            if (this.body) {
                modal.querySelector('.modal-body').innerHTML = this.body;
            }
            if (this.footer) {
                modal.querySelector('.modal-footer').innerHTML = this.footer;
            }
            if (this.onOpen && typeof this.onOpen === 'function') {
                this.onOpen(modal);
            }
           
            modal.classList ? modal.classList.add('open') : modal.className += ' ' + 'open';
        },
        close: function () {
            modal = document.querySelector('.modal'); // update modal reference
            if (this.oneClose && typeof this.onClose === 'function') {
                this.onClose(modal);
            }
            modal.classList ? modal.classList.remove('open')
                : modal.className = modal.className
                    .replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },

        clear: function () {
            modal = document.querySelector('.modal'); // update modal reference
            modal.querySelector('.modal-title').innerHTML = '';
            modal.querySelector('.modal-header').innerHTML = '';
            modal.querySelector('.modal-body').innerHTML = '';
            modal.querySelector('.modal-footer').innerHTML = '';
        }
    }

    if (options.title) {
        instance.title = options.title;
    }
    if (options.header) {
        instance.header = options.header;
    }
    if (options.body) {
        instance.body = options.body;
    }
    if (options.footer) {
        instance.footer = options.footer;
    }
    if (options.onOpen) {
        instance.onOpen = options.onOpen;
    }
    if (options.onClose) {
        instance.onClose = options.onClose;
    }

    return instance;


});