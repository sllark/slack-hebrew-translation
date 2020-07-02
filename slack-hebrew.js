// document.getElementById('msg_input').dir = 'auto';

let oldPathname = window.location.pathname;

window.addEventListener('load', function () {
    const editor = document.querySelector('.ql-editor');
    if (editor)
        editor.dir = 'auto';
    // alert('set');
    log(document);

    document.body.addEventListener("DOMSubtreeModified", domModified);


    var dom_observer_forURL = new MutationObserver(observeURLChange);
    var container = document.documentElement || document.body;
    const config = {childList: true, subtree: true};
    dom_observer_forURL.observe(container, config);


    startTranslation();

});

function observeURLChange(mutationsList) {

    for (let mutation of mutationsList) {
        if (oldPathname !== document.location.pathname) {

            oldPathname = document.location.pathname;
            let pathNameArray = oldPathname.split('/');

            if (pathNameArray.includes('threads'))
                translateThreadScreen();
            else if (pathNameArray.includes('browse-people') || pathNameArray.includes('browse-user-groups'))
                translatePeopleScreen();
            else if (pathNameArray.includes('apps'))
                translateAppsScreen();
            else if (pathNameArray.includes('browse-files'))
                translateFilesScreen();


        }
    }
}

function startTranslation() {

    let slack_kit_list = document.querySelector('.c-virtual_list__scroll_container');

    if (localStorage.getItem(slack_kit_list.className)) {

    } else {

        translateSideBar();
        translateProfileBox();
        translateBottomBanner();
        translateTopNav();
    }

    var dom_observer = new MutationObserver(elementAdded);
    var container = document.documentElement || document.body;
    console.log(container);
    const config = {childList: true, subtree: true};
    dom_observer.observe(container, config);


}

const classesOfDynamicElementContainers = ['ReactModalPortal', 'c-sk-modal_portal'];

function elementAdded(mutationsList) {


    // log('function called');

    for (let mutation of mutationsList) {


        //no element added
        if (mutation.addedNodes.length === 0 || mutation.addedNodes[0].nodeName === '#text')
            continue;

        console.log(mutation);
        // console.log(addedNode);


        if (mutation.target.classList.contains('c-virtual_list__scroll_container')) {
            translateSideBar();
            continue;
        }

        if (mutation.target.classList.contains('p-client--ia-top-nav') ||
            mutation.target.classList.contains('p-client__banners')) {
            translateBottomBanner();
            continue;
        }

        if (mutation.target.classList.contains('p-flexpane__body') ||
            mutation.target.classList.contains('p-ia_member_profile__fields') ||
            mutation.target.classList.contains('p-member_profile_buttons')
        ) {
            translateProfileBox();
            continue;
        }


        if (mutation.target.classList.contains('c-search_autocomplete__suggestion_list')) {
            translateTopNav();
            continue;
        }
        if (mutation.target.classList.contains('p-browse_page_controls__total')) {
            translateSearchBarandOptions();
            continue;
        }

        if (mutation.target.classList.contains('c-search_filter_section')) {
            translateSearchFilters();
            continue;
        }


        let addedNode = mutation.addedNodes[0] || {classList: []};

        //elements other than these elements were added
        if (!(mutation.target.classList.contains('ReactModalPortal') ||
            mutation.target.classList.contains('c-sk-modal_portal') ||
            addedNode.classList.toString().indexOf('c-submenu__container') > -1 ||
            mutation.target.classList.contains('c-tabs__tab_panel')
        ))
            continue;


        if (mutation.target.classList.contains('ReactModalPortal'))
            translateModalPortal();


        // console.log("%cReactModalPortal ADDED", 'font-size: 40px; color: green', mutation);


        //Sub menus of ReactModalPortal
        if (mutation.addedNodes[0].classList.contains('c-submenu__container'))
            translateModalPortalSubMenus();


        if (mutation.target.classList.contains('c-sk-modal_portal'))
            translatePrefPortal()


        if (mutation.target.classList.contains('c-tabs__tab_panel'))
            translateCTabPanel();

        // console.log("%cMutation", 'font-size: 40px; color: green', document.querySelector('.' + mutation.target.classList[0]));


        // if (mutation.type === 'childList') {
        //     log('A child node has been added.');
        // } else if (mutation.type === 'attributes') {
        //     log('The ' + mutation.attributeName + ' attribute was modified.');
        // }
    }


}

const cTabPanelClasses = ['h2',
    'h3',
    'h4',
    '.c-hint',
    '.c-alert__message span',
    '.p-prefs_modal__message_example__message_body span',
    '.p-channel_sidebar__custom_sections_copy_header__heading__text',
    '.p-channel_sidebar__custom_sections_create_button',
    '.p-prefs_modal__message_example__message_body span',
    '.p-prefs_modal__ia_radio__title'];


function translateCTabPanel() {

    let elements;

    cTabPanelClasses.forEach(className => {
        elements = document.querySelectorAll('.c-tabs__tab_panel ' + className);

        elements.forEach(ele => {
            ele.innerHTML = 'Translate this text';
        })

    })

    elements = document.querySelectorAll('.c-tabs__tab_panel p');
    elements.forEach(ele => {
        if (ele.children.length > 0) {
            ele.childNodes.forEach(innerEle => {
                if (innerEle.nodeType === 3)
                    innerEle.nodeValue = "translate the text";
                else
                    innerEle.innerHTML = "translate the inner elemnt";
            })
        } else {
            ele.innerHTML = "translate the text";
        }
    })


    elements = document.querySelectorAll('.c-tabs__tab_panel .c-label__text');
    elements.forEach(ele => {

        if (ele.children.length > 0) {
            ele.childNodes.forEach(innerEle => {

                if (innerEle.nodeType === 3)
                    innerEle.nodeValue = "translate this text";
                else {

                    if (innerEle.tagName.toLowerCase() === 'strong') {
                        innerEle.childNodes.forEach(strongInnerEle => {
                            if (strongInnerEle.nodeType === 3)
                                strongInnerEle.nodeValue = 'Translate stong text';
                        })
                    }

                    if (innerEle.tagName.toLowerCase() === 'span')
                        innerEle.innerHTML = "translate this text";
                }


            })
        } else {
            ele.innerHTML = "translate the text";
        }

    })

    elements = document.querySelectorAll('.c-legend');
    replaceTextNodes(elements);

    elements = document.querySelectorAll('.c-radiogroup .margin_top_50');
    replaceTextNodes(elements);

    elements = document.querySelectorAll('.c-button.c-button--primary.c-button--medium.margin_bottom_100');
    replaceTextNodes(elements);

    elements = document.querySelectorAll('a.c-link.float_right');
    replaceTextNodes(elements);

}


function replaceTextNodesAndDirectChildText(elements) {
    elements.forEach(ele => {
        ele.childNodes.forEach(innerEle => {

            if (innerEle.nodeType === 1)
                innerEle.innerHTML = "translate this text";

            if (innerEle.nodeType === 3)
                innerEle.nodeValue = "translate this text";
        })
    })

}


function replaceTextNodes(elements) {
    elements.forEach(ele => {
        ele.childNodes.forEach(innerEle => {

            if (innerEle.nodeType === 3)
                innerEle.nodeValue = "translate this text";
        })
    })

}


function translateSideBar() {


    let sidebarOptionElements = document.querySelectorAll('.p-channel_sidebar__name');

    log(sidebarOptionElements[0]);
    sidebarOptionElements.forEach(ele => {
        if (ele.parentElement.dataset['qaChannelSidebarChannel'] !== "true" && ele.children.length === 0) {
            log(ele.innerHTML);
            applyTranslation(ele);
        }
    })

    let featButtons = document.querySelectorAll('.p-channel_sidebar__section_heading_label.p-channel_sidebar__section_heading_label--clickable')
    replaceTextNodes(featButtons);


    let pageDrawerBtn = document.querySelectorAll('.p-channel_sidebar__section_heading.p-channel_sidebar__section-heading--pages-drawer');
    replaceTextNodes(pageDrawerBtn);

}


function translateProfileBox() {
    replaceTextNodes(document.querySelectorAll('.p-flexpane__title_container'));
    replaceTextNodes(document.querySelectorAll('.p-ia__channel_details__action_label'));
    replaceTextNodes(document.querySelectorAll('.p-member_profile_field__label'));
}


function translateBottomBanner() {

    replaceTextNodesAndDirectChildText(document.querySelectorAll('.c-banner__text'));
}


function translateModalPortal() {

    let elements = document.querySelectorAll('.c-menu_item__label');

    elements.forEach(ele => {
        ele.innerHTML = 'translate this text';
    })

    let presenceLabel = document.querySelector('.p-ia__main_menu__user__presence_label');
    if (presenceLabel)
        presenceLabel.innerText = 'innerText';//change

    let presenceLabelBtn = document.querySelector('.p-ia__main_menu__user__presence_button');
    if (presenceLabelBtn)
        presenceLabelBtn.innerHTML = 'translate';//change innerText


    let statusBtn = document.querySelector('.p-ia__main_menu__custom_status_button');
    if (statusBtn) {
        let statusBtnChild = statusBtn.children[0];
        statusBtn.innerHTML = 'translate status Btn';
        statusBtn.prepend(statusBtnChild);
    }

    let pauseNotificationBtn = document.querySelector('.p-ia__main_menu__dnd_label');
    if (pauseNotificationBtn)
        pauseNotificationBtn.innerHTML = 'translate';

    let dropDownOptionsFromPrefs = document.querySelectorAll('.c-select_options_list__option_label');
    dropDownOptionsFromPrefs.forEach(ele => {
        ele.innerHTML = 'translate this text';
    })

    let dropDownOptionsPrevFromPrefs = document.querySelectorAll('.c-select_button__content');
    dropDownOptionsPrevFromPrefs.forEach(ele => {
        ele.innerHTML = 'translate this text';
    })

    let smallPopups = document.querySelectorAll('.c-popover__content div');
    replaceTextNodes(smallPopups);

    // log(document.querySelectorAll('.ReactModalPortal .c-search_autocomplete__header_label_text'));

    if (document.querySelectorAll('.ReactModalPortal .c-search_autocomplete__header_label_text').length > 0)
        translateTopNav();

}

function translateModalPortalSubMenus() {

    let elements = document.querySelectorAll('.c-submenu__container .c-menu_item__label');
    elements.forEach(ele => {
        ele.innerHTML = 'translate this text';
    })

    let pauseNotiStatusElements = document.querySelectorAll('.p-dnd_menu__header_status *');

    pauseNotiStatusElements.forEach(ele => {
        if (ele.children.length === 0)
            ele.innerHTML = 'translate this text';
    })

    let subMenuHeader = document.querySelectorAll('.c-menu_item__header')
    subMenuHeader.forEach(ele => {
        ele.innerHTML = 'translate this text';
    })


}


function translatePrefPortal() {

    console.log("%cPORTAL ADDED", 'font-size: 40px; color: green', document.querySelector('.' + mutation.target.classList[0]));

    let portalHeading = document.querySelector('.c-sk-modal_title_bar__text h1');
    portalHeading.innerHTML = 'Translate heading Text';

    let menuBtns = document.querySelectorAll('.p-prefs_dialog__menu.c-tabs__tab_menu button');
    menuBtns.forEach(btn => {
        btn.children[1].innerHTML = 'Translate Btn';
    })


    translateCTabPanel();

}


function translateTopNav() {
    replaceTextNodes(document.querySelectorAll('.p-top_nav__search__text'));
    replaceTextNodes(document.querySelectorAll('.c-search_autocomplete__header_label_text'));

}


function translateThreadScreen() {

    translatePageHeader();
    // translateSearchBarandOptions();

}

function translatePeopleScreen() {
    translatePageHeader();
    // translateSearchBarandOptions();

}

function translateAppsScreen() {
    translatePageHeader();
    // translateSearchBarandOptions();


}

function translateFilesScreen() {
    translatePageHeader();
    // translateSearchBarandOptions();


}

function translatePageHeader() {

    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__title'));
    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__button_text'));
    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__primary_button'));

    document.querySelectorAll('.c-filter_input input').forEach(input => {
        input.attributes.placeholder.value = 'translate this input text';
    })


}


function translateSearchBarandOptions() {
    //tab buttons
    replaceTextNodes(document.querySelectorAll('.p-browse_page_tabs .c-tabs__tab_menu button span'));

    //members total Count
    replaceTextNodes(document.querySelectorAll('.p-browse_page_controls__total span'));

    //side option btns
    replaceTextNodes(document.querySelectorAll('.p-browse_page_controls__button'))

}


function translateSearchFilters() {

    let classes = ['.c-search_filter_section h3', '.p-search_filter__checkbox_label', '.p-search_filter__option_label',
        '.p-search_filter__from_name', '.p-search_filter__more_link', '.p-search_filter__more_link']

    classes.forEach(className => {
        replaceTextNodes(document.querySelectorAll(className));
    })


}

//
// function applyTranslation(element) {
//
//
//     element.style.direction='rlt';
//     element.style.textAlign='left';
//
//     let to=setTimeout(()=>{
//         log('ret');
//         element.innerHTML='translated text in timeout';
//         clearTimeout(to);
//     },1000);
//
// }


// Abstract API request function
function applyTranslation(element, isInnerText = false) {


    let text = isInnerText ? element.innerText : element.innerHTML;


    if (getItem(text)) {
        setText(element, getItem(text),isInnerText);
        log('set from storage')

    } else {
        const apiKey = "AIzaSyCFjoW9v4GzLrUbt9LG29Lt3hY0u9ZuShM";
        let url = "https://www.googleapis.com/language/translate/v2/";
        url += "?key=" + apiKey;
        url += "&q=" + encodeURI(text);
        url += "&target=he";
        url += "&source=en";

        log('made request')

        fetch(url, {
            method: 'GET',
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        })
            .then(response => response.json())
            .then(resp => {
                let transText=resp.data.translations[0].translatedText;

                setText(element,transText,isInnerText);
                setItem(text,transText);
            })

    }


}


function getItem(text) {
    return localStorage.getItem(text+'yys');
}

function setItem(text,transText) {
    localStorage.setItem(text+'yys',transText);
}

function setText(element, transText,isInnerText) {

    element.style.direction = 'rlt';
    element.style.textAlign = 'left';

    if (isInnerText)
        element.innerText = transText;
    else
        element.innerHTML = transText;
}


// ======================= Works with messages ===================================
function elementShouldBeRTL(element) {
    return /[א-ת]/.test(element.innerHTML);
}


function alreadyApplied(element) {
    return element.children.length === 1 && (
        element.children[0].tagName === "P" || element.children[0].tagName === "p");
}

function applyTo(element) {
    element.innerHTML = '<p style="direction: rtl; text-align: left; margin: 0;">' + element.innerHTML + '</p>';
    for (var i in element.children[0].children) {
        var child = element.children[0].children[i];
        if (!(child.style instanceof CSSStyleDeclaration))
            continue;
        child.style.textAlign = "initial";
    }
}

function setDirections() {
    var contents = document.getElementsByClassName('c-message__body');
    for (var i in contents) {
        var element = contents[i];
        if (!elementShouldBeRTL(element))
            continue;
        if (alreadyApplied(element))
            continue;
        applyTo(element);
    }
}

function domModified() {
    console.log('modify')
    document.body.removeEventListener('DOMSubtreeModified', domModified);
    setTimeout(function () { // debouce modifications
        setDirections();
        document.body.addEventListener('DOMSubtreeModified', domModified);
    }, 500);
}

// ===============================================================================


function log(mes) {

    console.log("%cExt", 'font-size: 40px; color: green', mes);

}