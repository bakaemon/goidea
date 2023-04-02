class Transition {
    
    constructor(selector, options) {
        this.element = document.querySelector(selector);
        this.transition = document.querySelector('.spinner-overlay');
        this.options = options;
    }

    start() {

        this.element.classList.add('off');
        this.transition.style.display = 'block';
    }

    end() {

        this.element.classList.remove('off');
        this.transition.style.display = 'none';
    }

}