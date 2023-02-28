var onOpenModal = function (modal, trigger) {
};

var onCloseModal = function (modal, trigger) {
};

function openModal(e, modalId) {
    var modalWindow = document.getElementById(modalId);
    if (onOpenModal instanceof Function) {
        onOpenModal(modalWindow, e.target);
    }
    modalWindow.classList ? modalWindow.classList.add('open') : modalWindow.className += ' ' + 'open';
}

function closeModal(e, modalId) {
    var modalWindow = document.getElementById(modalId);
    if (onCloseModal instanceof Function) {
        onCloseModal(modalWindow, e.target);
    }
    modalWindow.classList ? modalWindow.classList.remove('open')
        : modalWindow.className = modalWindow.className
            .replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
/* This script supports IE9+ */
(function () {



    /* Opening modal window function */
    function openModalEvent() {
        /* Get trigger element */
        var modalTrigger = document.getElementsByClassName('modal-trigger');

        /* Set onclick event handler for all trigger elements */
        for (var i = 0; i < modalTrigger.length; i++) {
            modalTrigger[i].onclick = function () {
                var target = this.getAttribute('href').substr(1);
                var modalWindow = document.getElementById(target);
                if (onOpenModal instanceof Function) {
                    onOpenModal(modalWindow, this);
                }
                modalWindow.classList ? modalWindow.classList.add('open') : modalWindow.className += ' ' + 'open';
            }
        }
    }

    function closeModalEvent() {
        /* Get close button */
        var closeButton = document.getElementsByClassName('modal-close');
        var closeOverlay = document.getElementsByClassName('modal-overlay');

        /* Set onclick event handler for close buttons */
        for (var i = 0; i < closeButton.length; i++) {
            closeButton[i].onclick = function () {
                var modalWindow = this.parentNode.parentNode;
                if (onCloseModal instanceof Function) {
                    onCloseModal(modalWindow, this);
                }
                modalWindow.classList ? modalWindow.classList.remove('open') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }

        /* Set onclick event handler for modal overlay */
        for (var i = 0; i < closeOverlay.length; i++) {
            closeOverlay[i].onclick = function () {
                var modalWindow = this.parentNode;

                modalWindow.classList ? modalWindow.classList.remove('open') : modalWindow.className = modalWindow.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }

    }

    /* Handling domready event IE9+ */
    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
            console.log('DOMContentLoaded');
        }
    }

    /* Triggering modal window function after dom ready */
    ready(openModalEvent);
    ready(closeModalEvent);
}());