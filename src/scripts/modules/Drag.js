if (docQ('.js-drag')) {
    window.addEventListener('DOMContentLoaded', () => {
        const dragContainers = [...document.querySelectorAll('.o-draggable')];
    
        if (dragContainers.length > 0) {
            for (let dragContainer of dragContainers) {
                const handles = [...dragContainer.querySelectorAll('.drag-handle')];
                const el = dragContainer.querySelector('.drag-item').tagName.toLowerCase();
                const shadow = document.createElement(el);
                const delta = 10;
    
                shadow.classList.add('drag-shadow');
    
                let item; // item currently being dragged
                let siblings; // siblings of item
                let height; // height of item
                let dragTop; // top offset of drag container
                let top; // top position in pixels of item
                let bottom; // bottom position in pixels of item
                let prevPos; // top position at previous drag event
    
                // Drag Start Event
                const dragStart = event => {
                    // prevent default dragging bahavior
                    event.preventDefault();
                    // set variables for use in this and other drag functions
                    item = event.target.closest('.drag-item');
                    siblings = [...dragContainer.querySelectorAll('.drag-item')].filter(
                        sib => sib != item
                    );
                    height = item.offsetHeight;
                    dragTop = dragContainer.getBoundingClientRect().top;
                    top = event.pageY - window.pageYOffset - dragTop - height / 2;
                    prevPos = top;
    
                    // set shadow to hight of dragged item and put it in the place of the dragged item
                    shadow.style.height = height + 'px';
                    item.insertAdjacentElement('beforebegin', shadow);
    
                    // set dragged item to dragging state
                    item.style.top = top + 'px';
                    item.classList.add('is-dragging');
    
                    // add event listeners for drag move && drag end
                    window.addEventListener('mousemove', dragMove);
                    window.addEventListener('mouseup', dragEnd);
                    window.addEventListener('touchmove', dragMove, { passive: false });
                    window.addEventListener('touchend', dragEnd);
                };
    
                // Drag Move Event
                const dragMove = event => {
                    // prevent window scrolling on touch devices
                    event.preventDefault();
                    // set variables for use in this function
                    dragTop = dragContainer.getBoundingClientRect().top;
                    item.style.top = top + 'px';
                    top = event.pageY - window.pageYOffset - dragTop - height / 2;
                    bottom = top + height;
    
                    // check if item is on top of any of its siblings and move the shadow to the correct place
                    for (let sib of siblings) {
                        // if dragging down
                        if (top > prevPos + delta) {
                            if (
                                bottom >= sib.offsetTop + delta &&
                                bottom < sib.offsetTop + sib.offsetHeight
                            ) {
                                flip(sib, 'afterend');
                            }
                        } else if (top < prevPos - delta) {
                            // if dragging up
                            if (
                                top >= sib.offsetTop + delta &&
                                top < sib.offsetTop + sib.offsetHeight
                            ) {
                                flip(sib, 'beforebegin');
                            }
                        }
                    }
    
                    // log previous mouse position (to tell if you moved up or down)
                    if (Math.abs(prevPos - top) > delta) {
                        prevPos = top;
                    }
                };
    
                // Drag End Event
                const dragEnd = event => {
                    // remove dragging state from dragged item
                    item.style.removeProperty('top');
                    item.classList.remove('is-dragging');
    
                    // insert dragged item in place of shadow and remove shadow
                    shadow.insertAdjacentElement('beforebegin', item);
                    shadow.parentNode.removeChild(shadow);
    
                    window.removeEventListener('mousemove', dragMove);
                    window.removeEventListener('mouseup', dragEnd);
                    window.removeEventListener('touchmove', dragMove);
                    window.removeEventListener('touchend', dragEnd);
                    orderNums();
                };
    
                const flip = (sib, position) => {
                    let first;
                    let last;
                    let change;
                    
                    first = sib.offsetTop;
                    sib.insertAdjacentElement(position, shadow);
                    last = sib.offsetTop;
                    change = first - last;
    
                    sib.style.transform = 'translateY(' + change + 'px)';
                    setTimeout(() => {
                        sib.style.transition = '0.25s ease-in-out';
                        sib.style.transform = 'translateY(0px)';
                    }, 50)
    
                    setTimeout(() => {
                        sib.style.removeProperty('transition');
                        sib.style.removeProperty('transform');
                    }, 300)
                };
    
                // set initial drag event for all of the handles
                for (let handle of handles) {
                    handle.addEventListener('mousedown', dragStart);
                    handle.addEventListener('touchstart', dragStart);
                }

                // Our Scripts

                function orderNums() {
                    const dragItems = dragContainer.querySelectorAll('.drag-item');
                    $.each(dragItems, (i, obj) => {
                        const numeral = obj.querySelector('.numeral');
                        const dropDown = obj.querySelector('[data-list]');
                        numeral.innerText = (i + 1) + '.';
                        dropDown.name = dropDown.dataset.list + '_' + i;
                    });
                }
            }
        }
    });
}