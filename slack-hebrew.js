const reg = /[\u0590-\u05fe]/i;
let oldPathname = window.location.pathname;

window.addEventListener('load', function () {

    //uncomment these two lines to get all stored data and data will be displayed in the page, copy it from there and add it at the bottom of the script in variable named "data" and remove any errors( caused because of some characters of hebrew lang) from this added data. After that comment these two lines again
    // extractLocalStorage();
    // return;

    if (!localStorage.getItem('setLocalStorageFromDataddd'))
        setLocalStorageFromData();


    let dom_observer_forURL = new MutationObserver(observeURLChange);
    let container = document.documentElement || document.body;
    const config = {childList: true, subtree: true};
    dom_observer_forURL.observe(container, config);

    addHebrewSuptForMsgSecAndAlignment();
    startTranslation();

});


function observeURLChange(mutationsList) {

    for (let mutation of mutationsList) {
        if (oldPathname !== document.location.pathname) {

            oldPathname = document.location.pathname;
            let pathNameArray = oldPathname.split('/');

            let slackMainAppPages = ['threads', 'browse-people', 'browse-user-groups', 'apps', 'browse-files', 'browse-channels', 'drafts']

            slackMainAppPages.forEach(page => {
                if (pathNameArray.includes(page)) {
                    translatePageScreen();
                }
            })

        }
    }
}

function startTranslation() {


    // Main App
    translateSideBar();
    translateProfileBox();
    translateBottomBanner();
    translateTopNav();
    translatePageScreen();
    translateNewMessage();


    //Admin Section
    translateAdminPages();

    var dom_observer = new MutationObserver(elementAdded);
    var container = document.documentElement || document.body;
    const config = {childList: true, subtree: true};
    dom_observer.observe(container, config);

}

function elementAdded(mutationsList) {

    let pathNameArray = oldPathname.split('/');

    for (let mutation of mutationsList) {


        //no element added or only text is added
        if (mutation.addedNodes.length === 0 || mutation.addedNodes[0].nodeName === '#text') {

            if (mutation.target.classList.contains('p-ia__view_header__subtitle')) { //page header sub-heading
                replaceTextNodes(document.querySelectorAll('.p-ia__view_header__subtitle'));
            }

            continue;
        }


        log(mutation);


        if (mutation.target.classList.contains('p-app_launcher__list_container')) {
            replaceTextNodesIncludingChildtext('.p-app_launcher__grid');
        }
        else if (pathNameArray.includes('workspace-settings')) {
            translateAdminPageBasicStr();
        }
        else if (mutation.target.classList.contains('p-admin_invites__page')) {
            translateAdminPages();
        }
        else if (mutation.addedNodes[0].classList.contains('p-admin_table_wrapper--contents')) {
            replaceTextNodesIncludingChildtext('.c-table_view_row_header > div', true);
            replaceTextNodesIncludingChildtext('.p-admin_table-wrapper__header_container');
        }
        else if (mutation.target.classList.contains('p-admin_member_table__list')) {
            replaceTextNodesIncludingChildtext('.p-admin_member_table__member_type', true);
            replaceTextNodesIncludingChildtext('.p-admin_member_table_row_item--status', true);
            replaceTextNodesIncludingChildtext('.p-admin_member_table_row_item--authentication', true);
        }
        else if (mutation.target.classList.contains('ql-editor')) {
            inputEditorAdded();
        }
        else if (mutation.target.classList.contains('ReactVirtualized__Grid__innerScrollContainer')) {
            replaceTextNodesIncludingChildtext('#' + mutation.addedNodes[0].id);      //input editor Shortcut Menu Options
        }
        else if (mutation.target.classList.contains('p-channel_details_section') ||
            mutation.target.classList.contains('p-channel_details_section__content')) {
            translateChannelMsgSect();
        }
        else if (mutation.target.classList.contains('p-message_pane__top_banners')) {
            replaceTextNodesIncludingChildtext('.p-message_pane__search_tip_banner', true);
        }
        else if (mutation.target.classList.contains('p-workspace__primary_view_body') ||
            mutation.target.classList.contains('p-workspace__primary_view_contents')) {
            if (mutation.addedNodes[0].classList.contains('c-empty_state'))
                translateEmptyPage();
            else
                translateNewMessage();
        }
        else if (mutation.target.classList.contains('p-workspace-layout')
            && mutation.addedNodes[0].classList.contains('p-workspace__secondary_view')) {
            replaceTextNodes(document.querySelectorAll('.p-flexpane__title_container'));
        }
        else if (mutation.target.classList.contains('p-ia__view_header__button') ||
            mutation.target.classList.contains('p-classic_nav__model__title__info')) {//messages area header detail button and info text
            replaceTextNodes(document.querySelectorAll('.p-ia__view_header__button_text'));
            replaceTextNodes(document.querySelectorAll('.p-classic_nav__model__title__info__topic__content'));
        }
        else if (mutation.target.classList.contains('c-virtual_list__scroll_container')) {

            if (mutation.addedNodes[0].classList.contains('c-virtual_list__sticky_container')) { //Date box over message
                replaceTextNodesIncludingChildtext('[id="' + mutation.addedNodes[0].childNodes[0].id + '"]', true);
            }
            else if (mutation.addedNodes[0].classList.contains('c-virtual_list__item')) { //All messages and Channel Header & Slack Sidebar Items

                let addedEle = document.querySelector("[id='" + mutation.addedNodes[0].id + "']");

                if (mutation.addedNodes[0].classList.contains('p-channel_sidebar__static_list__item')) {
                    translateSideBar();
                }
                else if (mutation.addedNodes[0].childNodes[0].classList.contains('p-message_pane__foreword')) { //Channel Header

                    let ele = document.querySelector('.p-message_pane__foreword__description').lastElementChild;
                    //channel descripp-activity_page__item__headertion edit button
                    // console.log('ele123',ele);
                    if (ele !== null)
                        replaceTextNodes(ele.querySelectorAll('button'));
                    //channel buttons
                    replaceTextNodesIncludingChildtext('.p-message_pane__foreword__buttons');
                }
                else if (addedEle &&
                    document.querySelectorAll('.c-timestamp span').length > 0) {

                    //Replay time of the message in a thread
                    if (addedEle.querySelectorAll('.c-message_kit__thread_message').length > 0)
                        replaceTextNodes(document.querySelector("[id='" + mutation.addedNodes[0].id + "']").querySelectorAll('.c-timestamp span'));
                }

                translateChnlMessageEngWords(mutation);
                translatePageContent();

            }

        }
        else if (mutation.target.classList.contains('p-message_pane__foreword__buttons')) { //Channel Header action buttons
            replaceTextNodesIncludingChildtext('.p-message_pane__foreword__buttons');
        }
        else if (mutation.target.classList.contains('p-channel_sidebar__list')) { //side bar unread button
            replaceTextNodes(document.querySelectorAll('.p-channel_sidebar__banner--unreads'))
        }
        else if (mutation.target.classList.contains('c-search_autocomplete__suggestion_list')) {

            replaceTextNodes(document.querySelectorAll('.ql-placeholder'));
            replaceTextNodes(document.querySelectorAll('.c-search_autocomplete__header_label_text'));

        }
        else if (mutation.target.classList.contains('p-client--ia-top-nav') ||
            mutation.target.classList.contains('p-client__banners')) {
            translateBottomBanner();
        }
        else if (mutation.target.classList.contains('p-flexpane__body') ||
            mutation.target.classList.contains('p-ia_member_profile__fields') ||
            mutation.target.classList.contains('p-member_profile_buttons')) {
            //log('added saved');
            translateProfileBox();

        }
        else if (mutation.addedNodes[0].classList.contains('c-search__container') ||
            mutation.target.classList.contains('c-search') ||
            mutation.target.classList.contains('c-search__main')
        ) {
            translateEmptyPage();
            translateSearchFilters();

        }
        else if (mutation.target.classList.contains('c-tabs__tab')) {
            replaceTextNodes(document.querySelectorAll('.c-search__container button.c-tabs__tab > span'));
        }
        else if (mutation.target.classList.contains('p-browse_page_controls__total')) {
            translatePageHeader();
            translateSearchBarAndOptions();
        }
        else if (mutation.target.classList.contains('p-browse_page_controls__expander')) {
            replaceTextNodes(document.querySelectorAll('.p-browse_page_controls__reset_button'))
        }
        else if (
            mutation.target.classList.contains('p-browse_page_results') ||
            mutation.target.classList.contains('p-app_launcher__measure_container') ||
            mutation.target.classList.contains('p-ia__view_header')) {
            translateEmptyPage();
            translateNewMessage();

            if (mutation.addedNodes[0].classList.contains('p-bp__list_container')) {

                translatePageContent();
            }
        }
        else if (mutation.addedNodes[0].classList.contains('p-activity_page__list')) {
            translatePageContent();

        }
        else if (mutation.target.classList.contains('c-search_filter_section')) {
            translateSearchFilters();
        }
        else if (mutation.target.classList.contains('p-wb_app'))             //workflow-builder page
        {
            replaceTextNodesIncludingChildtext('.p-wb_app');
        }
        else if (mutation.target.classList.contains('ReactModalPortal')) {

            if (mutation.target.querySelectorAll('.c-search__input_and_close').length === 0) {
                replaceTextNodes(mutation.target.querySelectorAll('*'));
                document.querySelectorAll('.p-shortcuts_menu_search_input').forEach(input => {
                    applyTranslation(input, false, true);
                })
                // replaceTextNodesIncludingChildtext('.ReactModalPortal');
            } else {
                translateSearchResultModal();
            }
        }
        else if (mutation.target.classList.contains('ReactModal__Content')) {

            if (mutation.target.querySelectorAll('.c-search__input_and_close').length === 0) {
                replaceTextNodes(mutation.target.querySelectorAll('*'));
                // translateModalPortal();
            } else {
                translateSearchResultModal();
            }
        }
        else if (mutation.target.classList.contains('c-select_options_list')) { //Input Editor=> shoruct => Search=> empty Result

            replaceTextNodesAndDirectChildText(document.querySelectorAll('.p-shortcuts_menu__empty'));
        }
        else if (mutation.addedNodes[0].classList.contains('c-submenu__container')) {//Sub menus of ReactModalPortal
            replaceTextNodesIncludingChildtext('.c-submenu__container');
        }
        else if (mutation.target.classList.contains('c-sk-modal_portal')) {           // translateModalPortalSubMenus();
            replaceTextNodesIncludingChildtext('.c-sk-modal_portal');         // translatePrefPortal()
        }
        else if (mutation.target.classList.contains('c-sk-modal_content_section') && mutation.addedNodes[0].classList.contains('p-select_invite_type__option')){
            // translateModalPortalSubMenus();
            replaceTextNodesIncludingChildtext('.p-select_invite_type__option');         // translate "Invite People" => "Single-Channel Guests" button
        }

        else if (mutation.target.classList.contains('c-tabs__tab_panel')) {
            replaceTextNodesIncludingChildtext('.c-tabs__tab_panel');
        }

        else if (mutation.target.parentNode !== null) {
            try {
                if (mutation.target.parentNode.parentNode.parentNode !== null) {// check if parent.parent is not HTML document
                    if (mutation.target.parentNode.parentNode.classList.contains('p-threads_flexpane'))
                        replaceTextNodes(document.querySelectorAll('.p-threads_flexpane .c-timestamp span'));
                }
            } catch (e) {
                console.log(e)
            }

        }

    }
}


//========== Functions selecting different sections of the site and forwarding them for translation ====================

function translateSideBar() {


    log('translating sidebar');

    let sidebarOptionElements = document.querySelectorAll('.p-channel_sidebar__name');

    sidebarOptionElements.forEach(ele => {
        if (ele.parentElement.dataset['qaChannelSidebarChannel'] !== "true" && ele.children.length === 0) {
            // log(ele.innerHTML);
            applyTranslation(ele);
        }

        ele.classList.add('mr-10');
        ele.parentElement.style.display = 'flex';
        ele.parentElement.style.flexDirection = 'row-reverse';
    })

    let featButtons = document.querySelectorAll('.p-channel_sidebar__section_heading_label.p-channel_sidebar__section_heading_label--clickable')
    replaceTextNodesAndDirectChildText(featButtons);


    let pageDrawerBtn = document.querySelectorAll('.p-channel_sidebar__section_heading.p-channel_sidebar__section-heading--pages-drawer');
    replaceTextNodes(pageDrawerBtn);

    replaceTextNodes(document.querySelectorAll('.p-channel_sidebar__banner--unreads'));//unread button


}

function translateProfileBox() {

    log('translateProfileBox()');

    let classes = ['.p-flexpane__title_container', '.p-ia__channel_details__action_label', '.p-member_profile_field__label', '.p-channel_details_section__title-content', '.p-channel_details_about__heading',
        '.p-channel_details_about__empty',
        '.p-channel_details_about__blurb_edit',
        '.p-channel_details__header__created',
        '.p-channel_details__shared_files__empty', '.p-member_profile_field__interactable']


    classes.forEach(className => {
        replaceTextNodes(document.querySelectorAll(className));
    })

    replaceTextNodesAndDirectChildText(document.querySelectorAll('.p-pinned_items__empty_list'));
    replaceTextNodesAndDirectChildText(document.querySelectorAll('.c-empty_state'));


}

function translateBottomBanner() {

    log('translateBottomBanner()');
    replaceTextNodesAndDirectChildText(document.querySelectorAll('.c-banner__text'));
}

function translateTopNav() {

    log('translateTopNav()');
    let searchBar = document.querySelector('.p-top_nav__search__text');
    let searchBarText;


    // var observerSearchBar = new MutationObserver(function (mutations) {
    //     mutations.forEach(function (mutation) {
    //         searchBarText=searchBar.innerHTML;
    //         searchBarText=searchBarText.replace(/Search/,"לחפש");
    //         searchBar.innerHTML=searchBarText;
    //     });
    // });
    //
    // let searchBarArea=document.querySelector('.p-top_nav__search');
    // var config = {characterData: true, subtree: true};
    // observerSearchBar.observe(searchBar, config);


    if (searchBar) {
        searchBarText = searchBar.innerHTML;
        searchBarText = searchBarText.replace(/Search/, "לחפש");
        searchBar.innerHTML = searchBarText;

    }

    // replaceTextNodes(document.querySelectorAll('.p-top_nav__search__text'));
    replaceTextNodes(document.querySelectorAll('.ql-placeholder'));
    replaceTextNodes(document.querySelectorAll('.c-search_autocomplete__header_label_text'));

}

function translatePageScreen() {

    log('translatePageScreen()');
    translatePageHeader();
    translateEmptyPage();
    translateSearchFilters()
    translateSearchBarAndOptions();

    replaceTextNodesIncludingChildtext('.p-browse_page_education_card__content'); // cards with information

}


function translateChannelMsgSect() {
    //channel side options
    log('translateChannelMsgSect()');
    if (document.querySelectorAll('.p-channel_details_section__content ul').length > 0) {
        replaceTextNodesIncludingChildtext('.p-channel_details_section__content', false, ':not(ul)');
    } else if (document.querySelectorAll('.p-channel_details_section__content .c-pillow_file_container').length > 0) {
        replaceTextNodesIncludingChildtext('.p-channel_details_section__content .p-channel_details__shared_files__more');
    } else {
        replaceTextNodesIncludingChildtext('.p-channel_details_section__content');
    }

    replaceTextNodes(document.querySelectorAll('.c-message_list__day_divider__label__pill'), true)

    // log('dewe');
    // log(document.querySelectorAll('.c-message_list__day_divider__label__pill'))

    //text input editor bottom text
    replaceTextNodes(document.querySelectorAll('.p-notification_bar__formatting'));
    replaceTextNodes(document.querySelectorAll('.p-notification_bar__send'));
    replaceTextNodes(document.querySelectorAll('.p-notification_bar__return'));
    replaceTextNodesIncludingChildtext('span.p-notification_bar__formatting');


    //chanel thread reply day translation
    replaceTextNodes(document.querySelectorAll('.p-threads_flexpane .c-timestamp span'));

}

function translatePageHeader() {

    log('translatePageHeader()');
    // log('translatePageHeader');
    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__title'));
    replaceTextNodes(document.querySelectorAll('.p-classic_nav__model__title__info__topic__edit')); //channel info edit button

    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__button_text'));
    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__primary_button'));

    replaceTextNodesIncludingChildtext('.p-ia__view_header__subtitle')


    document.querySelectorAll('.c-filter_input input').forEach(input => {
        applyTranslation(input, false, true);
    })

}

function translateNewMessage() {
    translatePageHeader();
    log('translateNewMessage()');

    replaceTextNodes(document.querySelectorAll('.p-composer_page__destination_prefix'));
    replaceTextNodes(document.querySelectorAll('.ql-placeholder'));

    document.querySelectorAll('.c-multi_select_input__input.c-multi_select_input__input--initial').forEach(input => {
        applyTranslation(input, false, true);
    })
}


function translateSearchBarAndOptions() {
    //tab buttons
    log('translateSearchBarAndOptions()');
    replaceTextNodes(document.querySelectorAll('.p-browse_page_tabs .c-tabs__tab_menu button span'));

    //members total Count
    replaceTextNodes(document.querySelectorAll('.p-browse_page_controls__total span'));

    //side option btns
    replaceTextNodes(document.querySelectorAll('.p-browse_page_controls__button'));


}

function translateSearchFilters() {

    log('translateSearchFilters()');
    let classes = ['.c-search_filter_section h3', '.c-search_filter_section__title', '.p-search_filter__checkbox_label', '.p-search_filter__option_label',
        '.p-search_filter__from_name', '.p-search_filter__more_link', '.p-search_filter__more_link', '.p-browse_page_controls__reset_button', '.c-select_button__content', '.p-search_filter__date_label', '.c-search__container h4', '.c-search__container button.c-tabs__tab > span', '.c-search__section_header--compact']

    classes.forEach(className => {
        replaceTextNodes(document.querySelectorAll(className));
    })

    replaceTextNodesIncludingChildtext('.c-search__extras');


}

function translateEmptyPage() {

    log('translateEmptyPage()');

    let classes = ['.c-empty_state__title', '.c-empty_state__description', '.c-empty_state__secondary_action a',
        '.p-browse_page_results__empty p', '.p-app_launcher__no_results p', '.p-search_filter__more_link', '.c-empty_state__action', '.c-empty_state__action button']

    // replaceTextNodes(document.querySelectorAll(className));

    classes.forEach(className => {
        replaceTextNodes(document.querySelectorAll(className));
    })

    replaceTextNodesAndDirectChildText(document.querySelectorAll('.p-app_launcher__no_results span'))
}


function translatePageContent() {

    log('translatePageContent()');

    replaceTextNodesIncludingChildtext('.c-medium_channel_entity__joined_status');
    replaceTextNodes(document.querySelectorAll('.browse_page_channel_leave_button'));
    replaceTextNodes(document.querySelectorAll('.c-button.c-button--medium'));
    replaceTextNodes(document.querySelectorAll('.p-activity_page__item__header'));
    replaceTextNodes(document.querySelectorAll('.c-timestamp__label'));



}


function translateAdminPages() {

    log('translateAdminPages()');

    let pathNameArray = oldPathname.split('/');

    if (pathNameArray.includes('workflow-builder'))
        replaceTextNodesIncludingChildtext('.p-wb_app');


    if (pathNameArray.includes('manage')) {
        replaceTextNodesIncludingChildtext('.apps_nav');
        replaceTextNodesIncludingChildtext('#page_contents');
    }


    if (pathNameArray.includes('logs')) {

        replaceTextNodesIncludingChildtext('#site_nav_contents');
        replaceTextNodesIncludingChildtext('.headroom');
        replaceTextNodes(document.querySelectorAll('#page_contents > a'));
        replaceTextNodes(document.querySelectorAll('#page_contents > h1'), true);
        replaceTextNodesAndDirectChildText(document.querySelectorAll('#page_contents > p'));
        replaceTextNodesIncludingChildtext('#page_contents > div');

        return;
    }

    if (pathNameArray.includes('admin')) {
        translateAdminPageBasicStr();
        replaceTextNodesIncludingChildtext('.c-table_view_row_item_value');
        replaceTextNodesIncludingChildtext('.c-table_view_row_header > div', true);
        replaceTextNodesIncludingChildtext('.p-admin_table-wrapper__header_container');
    }

    let adminPages = ['home', 'settings', 'notifications', 'stats', 'customize', 'workspace-settings', 'invites'];

    for (let i = 0; i < adminPages.length; i++) {

        if (pathNameArray.includes(adminPages[i])) {
            translateAdminPageBasicStr();
            break;
        }
    }

}

function translateAdminPageBasicStr() {

    log('translateAdminPageBasicStr()');
    replaceTextNodesIncludingChildtext('#site_nav_contents');
    replaceTextNodesIncludingChildtext('.headroom');
    replaceTextNodesIncludingChildtext('#page_contents');
}


function translateSearchResultModal() {

    log('translateSearchResultModal()');
    console.log(document.querySelectorAll('.c-search_autocomplete__guided_search_container'))
    replaceTextNodes(document.querySelectorAll('.c-search__input_box__clear'));
    replaceTextNodes(document.querySelectorAll('.ql-placeholder'));
    replaceTextNodes(document.querySelectorAll('.c-search_autocomplete__header_label_text'));
    replaceTextNodesIncludingChildtext('.c-search_autocomplete__guided_search_container');
    replaceTextNodes(document.querySelectorAll('.c-search__section_header--compact'));
    translateSearchFilters();
    replaceTextNodes(document.querySelectorAll('.c-search__container h4'));
    replaceTextNodes(document.querySelectorAll('.c-search__container button.c-tabs__tab > span'));
    translateTopNav();
}


function translateChnlMessageEngWords(mutation) {

    log('translateChnlMessageEngWords()');

    let addedMessage = document.querySelector("[id='" + mutation.addedNodes[0].id + "']");

    if (addedMessage === null) return;

    let classes = ['.c-message__reply_count', '.c-message__reply_bar_description span', '.c-message__body--automated', '.c-message_kit__labels__text', '.c-message__edited_label', '.c-label__text']


    let elements;
    classes.forEach(className => {
        elements = addedMessage.querySelectorAll(className);
        if (elements.length > 0)
            replaceTextNodes(elements);
    })

}

//======================================================================================================================


//==========================================function Translating and storing Words======================================
// Abstract API request function
function applyTranslation(element, nodeValue = false, isInput = false, isCenter = false) {


    let text = nodeValue ? element.nodeValue : element.innerHTML;

    if (isInput)
        text = element.attributes.placeholder.value;


    if (text.replace(/ /g, '').length <= 0 || text.search(/[a-zA-Z]/g) < 0) return;


    if (getItem(text) !== null) {
        // log('set from storage');
        setText(element, getItem(text), nodeValue, isInput, isCenter);

    } else {
        const apiKey = "ADD_API_KEY_OF_Cloud_Translation_API";
        let url = "https://www.googleapis.com/language/translate/v2/";
        url += "?source=en";
        url += "&target=he";
        url += "&key=" + apiKey;
        url += "&q=" + encodeURI(text);

        //log('made request');
        //log(text);
        // log(text.indexOf(' '));

        if (getItem(text) !== null) {
            setText(element, getItem(text), nodeValue, isInput, isCenter);
            return;
        }

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


                let transText = resp.data.translations[0].translatedText;

                //log('sending request: ');
                //log(text);
                // log(getItem(text));

                setText(element, transText, nodeValue, isInput, isCenter);
                setItem(text, transText);
            }).catch(err => console.log(err));

    }


}


function getItem(text) {
    return localStorage.getItem(text + 'yys');
}

function setItem(text, transText) {

    text = decodeHTMLEntities(text);
    transText = decodeHTMLEntities(transText);

    text = text.replace(/[\n\r]/g, "");
    transText = transText.replace(/[\n\r]/g, "");

    localStorage.setItem(text + 'yys', transText);

    // log('setting')
    // log( localStorage.getItem(text + 'yys'))

}

const decodeHTMLEntities = (() => {
    const textArea = document.createElement('textarea');
    return (message) => {
        // log('decoding');
        textArea.innerHTML = message;
        return textArea.value;
    };
})();


function setText(element, transText, nodeValue, isInput, isCenter = false) {

    transText = decodeHTMLEntities(transText);

    if (isInput) {
        element.attributes.placeholder.value = transText;
        return
    }

    if (element && nodeValue) {
        element.parentElement.style.direction = 'rtl';
        element.parentElement.parentElement.style.direction = 'rtl';
        element.nodeValue = transText;

        if (!isCenter) {
            element.parentElement.style.textAlign = 'right';
            element.parentElement.parentElement.style.textAlign = 'right';
        } else {
            element.parentElement.style.textAlign = 'center';
            element.parentElement.parentElement.style.textAlign = 'center';
        }

    } else if (element && !nodeValue) {
        element.style.direction = 'rtl';
        element.innerHTML = transText;


        if (!isCenter) {
            element.style.textAlign = 'right';
        } else {
            element.style.textAlign = 'center';
        }
    }


}


//======================================================================================================================

//=========================================Helper Functions=============================================================

function addHebrewSuptForMsgSecAndAlignment() {


    let css = '.c-virtual_list__item .p-rich_text_block, .c-focus_manage_list__item .p-rich_text_block, .c-focus_manage_list__item .c-search_message__body ,.addedHebrewSupport, .c-message_kit__gutp-workspace__primary_view_bodyter{direction: rtl;text-align: right;}.mr-10{margin-right:10px;margin-left:auto}.p-workspace-layout{direction: rtl;}.c-scrollbar__hider{right:0!important}.c-message_kit__gutter__left{margin-right: 0!important;margin-left: 15px;}.p-message_input{direction: ltr!important;}.p-workspace__input.p-message_input,.ql-composer-sticky{direction: ltr;}.p-message_input_field.ql-container{direction: rtl;}.p-app_launcher__app_card__icon{margin-left:10px}.p-resizer{display: none;}.c-message__actions{right: unset !important;left: 17px !important;}.c-message_actions__group{direction: ltr;}.p-rich_text_list li:before{margin-left: 0!important}.p-member_profile_name__link--with_pronouns,.p-member_profile_name__text {padding-left: 12px;}.p-classic_nav__model__title__info__topic__edit{margin-right: 12px;}';


    let head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);
    style.appendChild(document.createTextNode(css));


    let inputP = document.querySelectorAll('.ql-editor p')[0];

    if (!inputP) return;

    let text = inputP.innerHTML;


    if (text.search(reg) >= 0) {
        inputP.classList.add('addedHebrewSupport');
        document.querySelector('.ql-editor').classList.add('addedHebrewSupport');
        inputEditorAdded();
    }
    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__button_text'));
    replaceTextNodes(document.querySelectorAll('.p-classic_nav__model__title__info__topic__content'));
    translateChannelMsgSect();
}


function replaceTextNodesAndDirectChildText(elements) {
    elements.forEach(ele => {
        ele.childNodes.forEach(innerEle => {

            if (innerEle.nodeType === 1)
                applyTranslation(innerEle);

            if (innerEle.nodeType === 3)
                applyTranslation(innerEle, true);
        })
    })
}


function replaceTextNodes(elements, isCenter = false) {
    elements.forEach(ele => {
        ele.childNodes.forEach(innerEle => {
            if (innerEle.nodeType === 3)
                applyTranslation(innerEle, true, false, isCenter);
        })
    })
}


function replaceTextNodesIncludingChildtext(selector, isCenter = false, notSelect = '') {

    let allChild = document.querySelectorAll(selector + ' *' + notSelect);


    allChild.forEach(ele => {
        ele.childNodes.forEach(innerEle => {
            if (innerEle.nodeType === 3) {
                applyTranslation(innerEle, true, false, isCenter);
            }

        })
    })
}


function inputEditorAdded() {

    replaceTextNodes(document.querySelectorAll('.p-ia__view_header__button_text'));
    replaceTextNodes(document.querySelectorAll('.p-classic_nav__model__title__info__topic__content'));


    let inputP = document.querySelector('.ql-editor p');
    let qlEditor = document.querySelector('.ql-editor');

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {

            let text = mutation.target.nodeValue;


            if (text.search(reg) >= 0) {

                inputP.classList.add('addedHebrewSupport');
                qlEditor.classList.add('addedHebrewSupport');


            } else {
                inputP.classList.remove('addedHebrewSupport');
                qlEditor.classList.remove('addedHebrewSupport');
            }


        });
    });

    var config = {characterData: true, subtree: true};
    observer.observe(inputP, config);


    // inputP.addEventListener('change',()=>log('text added'))


    //text input editor bottom text
    replaceTextNodes(document.querySelectorAll('.p-notification_bar__formatting'));
    replaceTextNodes(document.querySelectorAll('.p-notification_bar__send'));
    replaceTextNodes(document.querySelectorAll('.p-notification_bar__return'));
    replaceTextNodesIncludingChildtext('span.p-notification_bar__formatting');

}

//======================================================================================================================


//===========================================Unused functions right now=================================================
function translateModalPortal() {

    let elements = document.querySelectorAll('.c-menu_item__label');
    elements.forEach(ele => {
        applyTranslation(ele)
    })

    let presenceLabel = document.querySelector('.p-ia__main_menu__user__presence_label');
    if (presenceLabel)
        applyTranslation(presenceLabel)

    let presenceLabelBtn = document.querySelector('.p-ia__main_menu__user__presence_button');
    if (presenceLabelBtn)
        applyTranslation(presenceLabelBtn)


    let statusBtn = document.querySelectorAll('.p-ia__main_menu__custom_status_button');
    replaceTextNodes(statusBtn)

    let pauseNotificationBtn = document.querySelectorAll('.p-ia__main_menu__dnd_label');
    replaceTextNodes(pauseNotificationBtn)


    let dropDownOptionsFromPrefs = document.querySelectorAll('.c-select_options_list__option_label');
    dropDownOptionsFromPrefs.forEach(ele => {
        applyTranslation(ele)
    })

    let dropDownOptionsPrevFromPrefs = document.querySelectorAll('.c-select_button__content');
    dropDownOptionsPrevFromPrefs.forEach(ele => {
        applyTranslation(ele)
    })

    let smallPopups = document.querySelectorAll('.c-popover__content>div');
    replaceTextNodes(smallPopups);

    // log(document.querySelectorAll('.ReactModalPortal .c-search_autocomplete__header_label_text'));

    if (document.querySelectorAll('.ReactModalPortal .c-search_autocomplete__header_label_text').length > 0)
        translateTopNav();


    translateEmptyPage();
    replaceTextNodes(document.querySelectorAll('.c-search__container h4'));
    replaceTextNodes(document.querySelectorAll('.c-search__container button.c-tabs__tab > span'));


}

function translateModalPortalSubMenus() {

    let elements = document.querySelectorAll('.c-submenu__container .c-menu_item__label');
    elements.forEach(ele => {
        applyTranslation(ele)
    })

    let pauseNotiStatusElements = document.querySelectorAll('.p-dnd_menu__header_status *');

    pauseNotiStatusElements.forEach(ele => {
        if (ele.children.length === 0)
            applyTranslation(ele)
    })

    let subMenuHeader = document.querySelectorAll('.c-menu_item__header')
    subMenuHeader.forEach(ele => {
        applyTranslation(ele)
    })


}


function translatePrefPortal() {


    let portalHeading = document.querySelector('.c-sk-modal_title_bar__text h1');
    applyTranslation(portalHeading)

    let menuBtns = document.querySelectorAll('.p-prefs_dialog__menu.c-tabs__tab_menu button');
    menuBtns.forEach(btn => {
        applyTranslation(btn.children[1])
    })


    translateCTabPanel();

}


function translateCTabPanel() {

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


    let elements;

    cTabPanelClasses.forEach(className => {
        elements = document.querySelectorAll('.c-tabs__tab_panel ' + className);
        elements.forEach(ele => {
            applyTranslation(ele)
        })

    })

    elements = document.querySelectorAll('.c-tabs__tab_panel p');
    elements.forEach(ele => {
        if (ele.children.length > 0) {
            ele.childNodes.forEach(innerEle => {
                if (innerEle.nodeType === 3)
                    applyTranslation(innerEle, true)
                else
                    applyTranslation(innerEle)
            })
        } else {
            applyTranslation(ele)
        }
    })


    elements = document.querySelectorAll('.c-tabs__tab_panel .c-label__text');
    elements.forEach(ele => {

        if (ele.children.length > 0) {
            ele.childNodes.forEach(innerEle => {

                if (innerEle.nodeType === 3) {
                    applyTranslation(innerEle, true)

                } else {

                    if (innerEle.tagName.toLowerCase() === 'strong') {
                        innerEle.childNodes.forEach(strongInnerEle => {
                            if (strongInnerEle.nodeType === 3)
                                applyTranslation(strongInnerEle, true)
                        })
                    }

                    if (innerEle.tagName.toLowerCase() === 'span')
                        applyTranslation(innerEle)
                }


            })
        } else {
            applyTranslation(ele);
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

//======================================================================================================================

function getLocalKeyBack(key) {
    return key.replace(/\\'/g, "'");
}


function getLocalKey(key) {
    key = key.replace(/"/g, '\\"');
    // key = key.replace(/“/g, '\\“');
    key = key.replace(/[\n\r]/g, "");

    return key;
}

function setLocalStorageFromData() {

    //log('setting local storgae data');

    localStorage.setItem('setLocalStorageFromDataddd', true)
    let key, value;
    data.forEach(entity => {
        let key = Object.keys(entity)[0];
        let value = entity[key];
        localStorage.setItem(key, value)
    })
}

function getLocalStorageKey(key) {

    key = localStorage.getItem(key);
    key = key.replace(/"/g, '\\"');
    key = key.replace(/“/g, '\\“');
    key = key.replace(/[\n\r]/g, "");

    return key;

}


function extractLocalStorage() {

    let out = document.querySelector('body');
    out.innerHTML = '';
    setTimeout(()=>{
        console.log('started extracting');

        out.innerHTML += "[<br>"
        Object.keys(localStorage).forEach(key => {
            if (key.indexOf('yys') >= 0) {
                out.innerHTML += '{"' + getLocalKey(key) + '":"' + getLocalStorageKey(key) + '"},<br>'
                // out.innerHTML += "{'" + getLocalKey(key) + "':'" + localStorage.getItem(key) + "'},<br>"
            }
        })

        out.innerHTML += "<br>]"


        console.log('finished extracting');

    },600)

}


function log(mes) {
    console.log("%cExt", 'font-size: 40px; color: green', mes);
}


let data = [
    {"Search: appyys":"חיפוש: אפליקציה"},
    {"Use commas to separate each keyword. Keywords are not case sensitive.yys":"השתמש בפסיקים כדי להפריד בין כל מילת מפתח. מילות מפתח אינן תלויות רישיות."},
    {"Open Agorayys":"פתח את אגורה"},
    {"02:18yys":"02:18"},
    {"לפרטים נוספים, אוyys":"לפרטים נוספים, או"},
    {" אֲנָשִׁים yys":"אֲנָשִׁים"},
    {"6:40 AMyys":"6:40 בבוקר"},
    {"12:27 AMyys":"00:27"},
    {"2:25 PMyys":"02:25"},
    {"Call Avinoam Holzeryys":"חייגו לאבינועם הולצר"},
    {"Choose whether to show unread or all conversations for each section from the sidebar.yys":"בחר אם להציג לא נקראו או את כל השיחות עבור כל קטע מהסרגל הצד."},
    {"Sunday, July 12thyys":"ראשון, 12 ביולי"},
    {"Thursday, September 24thyys":"יום חמישי, 24 בספטמבר"},
    {"Notificationsyys":"התראות"},
    {"אנחנו תמיד עובדים כדי לשפר את Slack, ואנחנו נשמח את המחשבות שלך.yys":"אנחנו תמיד עובדים כדי לשפר את Slack, ואנחנו יכולים לנשום את המחשבות שלך."},
    {"Tuesday, September 15thyys":"יום שלישי, 15 בספטמבר"},
    {" edited 9 days agoyys":"נערך לפני 9 ימים"},
    {"11:14 AMyys":"11:14"},
    {"Yesterday at 4:37:20 AMyys":"אתמול בשעה 4:37:20 בבוקר"},
    {"14yys":"14"},
    {"joined #כללי.yys":"הצטרף"},
    {"3 related resultsyys":"3 תוצאות קשורות"},
    {"1 replyyys":"תשובה אחת"},
    {"Strikethroughyys":"דרך דרומית"},
    {" לכל אלו שכן ניתקו הסאמוויקס Q2 לידיעתכם ע\"י בלוטוס יש אינטרנטyys":"לכל אלה שכן ניתקו הסאמוויקס Q2 לידיעתכם עילי בלוטוס יש אינטרנט"},
    {"Create a new workspaceyys":"צור סביבת עבודה חדשה"},
    {"Friday, June 26thyys":"יום שישי, 26 ביוני"},
    {"—yys":"-"},
    {"Capture decisionyys":"החלטת לכידה"},
    {"A way to triage requestsyys":"דרך לשלוש בקשות"},
    {"3:09 PMyys":"15:09"},
    {"Mute all sounds from Slackyys":"השתק את כל הצלילים של Slack"},
    {"Invite Peopleyys":"להזמין אנשים"},
    {"Sunday, June 21styys":"ראשון, 21 ביוני"},
    {"Section optionsyys":"אפשרויות סעיף"},
    {"Jul 2nd at 9:01:14 AMyys":"2 ביולי בשעה 9:01:14 בבוקר"},
    {"Also send to yys":"שלח גם אל"},
    {"רכז אזוריyys":"רכז אזורי"},
    {"Keyboard shortcutsyys":"קיצורי דרך במקלדת"},
    {"Slack Developer Tools (Legacy)yys":"כלים למפתחים רפויים (Legacy)"},
    {"אייל שועבי, Avinoam Holzer, and שניר סרוסיyys":"אייל שועבי, אבינועם הולצר, ושני סר סרוסי"},
    {"< 1 minute agoyys":"לפני דקה"},
    {"Jul 2nd at 10:16 AMyys":"2 ביולי בשעה 10:16"},
    {"2:29 PMyys":"02:29"},
    {"4:25 PMyys":"16:25"},
    {"Set my status to “yys":"הגדר את הסטטוס שלי ל \""},
    {"download_20200525_231631.jpgyys":"download_20200525_231631.jpg"},
    {"5:17 AMyys":"05:17"},
    {"יצטרף אוטומטיתyys":"יצטרף אוטומטית"},
    {"Accessible and clearyys":"נגיש וברור"},
    {"Friday, December 11thyys":"יום שישי 11 בדצמבר"},
    {"16 days agoyys":"לפני 16 יום"},
    {"December 1st, 2019yys":"1 בדצמבר, 2019"},
    {"30yys":"30"},
    {"Change notificationsyys":"שנה התראות"},
    {"Recent searchesyys":"חיפושים אחרונים"},
    {"65 repliesyys":"65 תשובות"},
    {"Invite Guestsyys":"הזמן אורחים"},
    {"10:41 PMyys":"10:41 אחר הצהריים"},
    {"Call עקיבא שטרןyys":"חייג עקיבא שטרן"},
    {"Bulleted listyys":"רשימת תבליטים"},
    {"Wednesday, September 16thyys":"יום רביעי, 16 בספטמבר"},
    {"Set statusyys":"הגדר סטטוס"},
    {"Search: helloyys":"חיפוש: שלום"},
    {"Search: safyys":"חיפוש: saf"},
    {"4:58 AMyys":"04:58"},
    {"2:02 PMyys":"14:02"},
    {"12:08 AMyys":"12:08 בבוקר"},
    {"Tuesday, October 20thyys":"יום שלישי, 20 באוקטובר"},
    {"Oldest channelyys":"הערוץ הישן ביותר"},
    {"Last reply 23 days agoyys":"תשובה אחרונה לפני 23 יום"},
    {"4:33 AMyys":"04:33"},
    {"יתכן שתרצה לנסות להשתמש במילות מפתח שונות, לבדוק אם יש לך שגיאות הקלדה או להתאים את המסננים שלך.yys":"לנסות להשתמש במילות מפתח שונות, לבדוק אם יש לך שגיאות הקלדה או להתאים את המסננים שלך."},
    {"Last reply 3 months agoyys":"תשובה אחרונה לפני 3 חודשים"},
    {"Learn about threadsyys":"למדו על האשכולות"},
    {"set the channel description: עזרה, רעיונות ותמיכה בסלאקyys":"קבע את תיאור הערוץ: עזרה, רעיונות ותמיכה בסלאק"},
    {"sdf'yys":"sdf '"},
    {"Jun 21st at 8:13 AMyys":"21 ביוני בשעה 8:13 בבוקר"},
    {"joined #יעוץ.yys":"הצטרף"},
    {"youyys":"אתה"},
    {"אברהם ישעיהו זריצקיyys":"אברהם ישעיהו זריצקי"},
    {"אליעד שמעוןyys":"אליעד שמעון"},
    {"15yys":"15"},
    {"Threadsyys":"אשכולות"},
    {"12:54 AMyys":"12:54"},
    {"was added to #עזרה_הדדית by yys":"נוסף ל"},
    {", you can automatically send a message when someone reacts to a conversation with a specific emoji.yys":", אתה יכול לשלוח הודעה באופן אוטומטי כאשר מישהו מגיב לשיחה עם אמוג'י ספציפי."},
    {"Friday, June 12thyys":"יום שישי, 12 ביוני"},
    {"Terminalyys":"מָסוֹף"},
    {"image.pngyys":"image.png"},
    {". yys":"."},
    {"All DMsyys":"כל מכשירי ה- DM"},
    {"Dark and dramaticyys":"אפל ודרמטי"},
    {"If you'd like access to Workflow Builder, try reaching out to your workspace or organization admin.yys":"אם אתה מעוניין בגישה ל Builder Flow, נסה לפנות לסביבת העבודה או למנהל הארגון שלך."},
    {"joined #אנדרואיד.yys":"הצטרף"},
    {"Recentyys":"לאחרונה"},
    {"רחל דרבקיןyys":"רחל דרבקין"},
    {"IMG_20200617_201950.jpgyys":"IMG_20200617_201950.jpg"},
    {"Search optionsyys":"אפשרויות חיפוש"},
    {"7:24 PMyys":"19:24"},
    {"Set yourself yys":"תכין את עצמך"},
    {"הוותיק ביותרyys":"הוותיק ביותר"},
    {"Type the name of a channel or peopleyys":"הקלד את שם הערוץ או האנשים"},
    {"סלאקyys":"סלאק"},
    {"User Groups are collections of individual membersyys":"קבוצות משתמשים הן אוספים של חברים בודדים"},
    {"joined #עזרה_הדדית along with yys":"הצטרף"},
    {"IMG_0811.JPGyys":"IMG_0811.JPG"},
    {"Jun 30th at 2:06 PMyys":"30 ביוני בשעה 14:06"},
    {"4:04 AMyys":"04:04"},
    {"הוראות תכנת אאוטנט.pdfyys":"הוראות תכנת אאוטנט. Pdf"},
    {"Clean and minimalyys":"נקי ומינימלי"},
    {"Create an eventyys":"צור אירוע"},
    {"לְסַנֵןyys":"לְסַנֵן"},
    {"Press Ctrl Shift L to find or create a channelyys":"לחץ על Ctrl Shift L כדי למצוא או ליצור ערוץ"},
    {"1:16 PMyys":"13:16"},
    {"30 minutesyys":"30 דקות"},
    {"9:06 AMyys":"9:06 בבוקר"},
    {"Add anotheryys":"להוסיף עוד"},
    {"Last reply 27 days agoyys":"תשובה אחרונה לפני 27 יום"},
    {"What’s newyys":"מה חדש"},
    {"10:57 PMyys":"10:57"},
    {" will automatically join yys":"יצטרף אוטומטית"},
    {"10:29 AMyys":"10:29"},
    {"1 houryys":"1 שעה"},
    {"כדי להפוך את ההזמנות שלך לאישיות יותר.yys":"כדי להפוך את ההזמנות שלך לאישיות יותר."},
    {"3:41 PMyys":"03:41"},
    {"4:11 PMyys":"16:11"},
    {"סביבת העבודה שלך נמצאת כרגע ב- Slackyys":"בסביבת העבודה שלך"},
    {"8:08 AMyys":"8:08 בבוקר"},
    {"Wednesday, October 21styys":"יום רביעי, 21 באוקטובר"},
    {"left #אנדרואיד.yys":"שמאלה"},
    {"3:58 AMyys":"03:58"},
    {"קנון 800D יש הוראות?yys":"קנון 800 ד יש הוראות?"},
    {"ערוצים שלא נקראו בלבדyys":"ערוצים שלא נקראו בלבד"},
    {"Sunday, September 6thyys":"יום ראשון, 6 בספטמבר"},
    {"Enable Desktop Notificationsyys":"אפשר התראות בשולחן העבודה"},
    {"Search all across Slackyys":"חפש בכל רחבי Slack"},
    {"אם כבר יש לך סטטוס, Slack לא ישנה אותו.yys":"אם כבר יש לך סטטוס, רפוי לא ישנה אותו."},
    {"You’re set to away.yys":"אתה מוכן לצאת ."},
    {"Emailyys":"אימייל"},
    {"12 repliesyys":"12 תשובות"},
    {"Delete messageyys":"למחוק הודעה"},
    {"Last reply 25 days agoyys":"תשובה אחרונה לפני 25 יום"},
    {"5+ messagesyys":"5 הודעות"},
    {"3:51 PMyys":"15:51"},
    {"או אפילו להפעיל מחדש את הדפדפןyys":"או אפילו להפעיל מחדש את הדפדפן"},
    {"Search: heyys":"חיפוש: הוא"},
    {"Fewest membersyys":"החברים הכי מעטים"},
    {"דניאל פוחוביץyys":"דניאל פוחוביץ"},
    {"You can improve the way you use Slack by learning our yys":"אתה יכול לשפר את אופן השימוש שלך ב- Slack על ידי למידת שלנו"},
    {"Yesterdayyys":"אתמול"},
    {"No results for “yys":"אין תוצאות עבור \""},
    {"Troubleshootingyys":"פתרון תקלות"},
    {"Emoji reactionyys":"תגובת אמוג'י"},
    {"קודיםyys":"קודים"},
    {"Message AbdulRehmanyys":"הודעה AbdulRehman"},
    {"Direct Messagesyys":"הודעות ישירות"},
    {"כל סוג האפליקציותyys":"כל סוג האפליקציות"},
    {"Jun 10th at 1:29:33 PMyys":"10 ביוני בשעה 1:29:33"},
    {"@channel mentionsyys":"@channel מזכיר"},
    {"1:21 PMyys":"1:21 אחר הצהריים"},
    {"2:51 PMyys":"14:51"},
    {"Last reply 28 days agoyys":"תשובה אחרונה לפני 28 יום"},
    {"13 repliesyys":"13 תשובות"},
    {"(window.webpackJsonp=window.webpackJsonp||[]).push([[167],{nF6r:function(n,w,o){}},[[\"nF6r\",1]]])yys":"(windows.webpackJsonp = windows.webpackJsonp || []). לדחוף ([[167], {nF6r: פונקציה (n, w, o) {}}, [[\"nF6r\", 1]]])"},
    {"Jump to a specific dateyys":"קפוץ לתאריך ספציפי"},
    {"added an integration to this channel: yys":"הוסיף אינטגרציה לערוץ זה:"},
    {"Themesyys":"ערכות נושא"},
    {"לחץ על Ctrl Shift K כדי למצוא או ליצור הודעה ישירה. לחץ על מחק כדי להסיר הודעה ישירה מהסרגל הצדyys":"לחץ על Ctrl Shift K כדי למצוא או לקרוא הודעה ישירה. לחץ על מחק כדי לכתוב הודעה ישירה מהסרגל לצד"},
    {"Thursday, August 13thyys":"יום חמישי, 13 באוגוסט"},
    {"אייל שועבי, Avinoam Holzer, שניר סרוסי, AbdulRehman, רבקה כהן, יהודה חבה, and עקיבא שטרןyys":"אייל שועבי, אבינועם הולצר, שניר סרוסי, עבדול רהמן, רבקה כהן, יהודה חבה, ועקיבא שטרן"},
    {"11 months agoyys":"לפני 11 חודשים"},
    {"Jun 24th at 5:45:38 AMyys":"24 ביוני בשעה 05:45:38"},
    {"Monday, August 17thyys":"יום שני, 17 באוגוסט"},
    {"1:18 PMyys":"1:18 אחר הצהריים"},
    {"11 channelsyys":"11 ערוצים"},
    {"Yesterday at 2:45 PMyys":"אתמול בשעה 2:45 אחר הצהריים"},
    {"using Slackyys":"באמצעות Slack"},
    {"Call שמואל כהןyys":"התקשרו לשמואל כהן"},
    {"5:45 AMyys":"05:45"},
    {"03:28yys":"03:28"},
    {"Send messageyys":"לשלוח הודעה"},
    {"1 month agoyys":"לפני חודש"},
    {"helpyys":"עֶזרָה"},
    {"הוסף רבים בבת אחתyys":"הוסף רבים בבת אחת"},
    {"4:38 AMyys":"04:38"},
    {"6:19 AMyys":"6:19 בבוקר"},
    {"Jun 29thyys":"29 ביוני"},
    {"Videosyys":"סרטונים"},
    {"תזכורת לשרשור - יעוץ yys":"תזכורת לשרשור - יעוץ"},
    {"כלליyys":"כללי"},
    {"Check our Help Centeryys":"בדוק את מרכז העזרה שלנו"},
    {"Avinoam Holzeryys":"אבינועם הולצר"},
    {"Jun 29th at 11:50:43 AMyys":"29 ביוני בשעה 11:50:43 בבוקר"},
    {"Animationyys":"אנימציה"},
    {"Your computeryys":"המחשב שלך"},
    {"Create a workflowyys":"צור זרימת עבודה"},
    {"Advancedyys":"מִתקַדֵם"},
    {"Dock to right sideyys":"עגינה לצד ימין"},
    {"set the channel description: תמיכה בתוכנת וידיאוףyys":"קבע את תיאור הערוץ: תמיכה בתוכנת וידיאוף"},
    {"ayys":"א"},
    {"Suyys":"סו"},
    {"Syys":"ס"},
    {"Escyys":"יציאה"},
    {"לנסות להשתמש במילות מפתח שונות, לבדוק אם יש לך שגיאות הקלדה או להתאים את המסננים שלך.yys":"לנסות להשתמש במילות מפתח שונות, לבדוק אם יש לך שגיאות הקלדה או להתאים את המסננים שלך."},
    {"Shared byyys":"שותף על ידי"},
    {"12:31 PMyys":"12:31"},
    {"See packsyys":"ראה חבילות"},
    {"2 messagesyys":"2 הודעות"},
    {"וידיאוףyys":"וידיאוף"},
    {"Ctrl yys":"Ctrl"},
    {"Moyys":"מו"},
    {"הורד את Slack בחינם למכשירים ניידים ושולחן עבודה. המשיכו עם השיחה עם שלנוyys":"הורד את הרפה בחינם למכשירים ניידים ושולחן עבודה. המשיכו עם השיחה עם שלנו"},
    {"Create a custom themeyys":"צור נושא מותאם אישית"},
    {"מייגן אןyys":"מייגן אן"},
    {"3 days agoyys":"לפני 3 ימים"},
    {"Search: sdfyys":"חיפוש: sdf"},
    {"קבוצות משתמשyys":"משותפת משתמש"},
    {"3:53 AMyys":"03:53"},
    {"With this checked use ShiftEnter to send.yys":"בסימון זה השתמש ב- Shift Enter כדי לשלוח."},
    {"@AbdulRehmanyys":"@AbdulRehman"},
    {"4:44 AMyys":"04:44"},
    {"כל יוםyys":"כל יום"},
    {"View newer repliesyys":"הצג תשובות חדשות יותר"},
    {"השהה מכתבyys":"השהה מכתב"},
    {"24+ messagesyys":"24 הודעות"},
    {"All file typesyys":"כל סוגי הקבצים"},
    {"Tuesday, June 2ndyys":"יום שלישי, 2 ביוני"},
    {"Enable spellcheck on your messagesyys":"אפשר בדיקת איות בהודעות שלך"},
    {"Search: asfffyys":"חיפוש: asfff"},
    {"Today at 2:03 AMyys":"היום בשעה 02:03"},
    {"1+ messageyys":"הודעה אחת"},
    {"View member listyys":"צפה ברשימת החברים"},
    {"Google Docsyys":"גוגל מסמכים"},
    {"was added to test by yys":"נוספה למבחן על ידי"},
    {"joined #סלאק along with yys":"הצטרף"},
    {"Hide my channelsyys":"הסתר את הערוצים שלי"},
    {"Search: sl;dyys":"חיפוש: sl; d"},
    {"Last reply 8 days agoyys":"תשובה אחרונה לפני 8 ימים"},
    {"No shortcuts found for \"yys":"לא נמצאו קיצורי דרך עבור \""},
    {"1:07 PMyys":"13:07"},
    {"Last reply 20 days agoyys":"תשובה אחרונה לפני 20 יום"},
    {"6 repliesyys":"6 תשובות"},
    {"5:57 AMyys":"05:57"},
    {"Search: asddyys":"חיפוש: מוזר"},
    {"Productivity & Project Managementyys":"פִּריוֹן"},
    {"Jul 17th at 2:04 AMyys":"17 ביולי בשעה 02:04"},
    {"Wednesday, July 15thyys":"יום רביעי ה- 15 ביולי"},
    {"קבוצת המשתמשים החדשה ביותרyys":"הקבוצה הראשונה החדשה ביותר"},
    {"Saved 18 minutes agoyys":"נשמר לפני 18 דקות"},
    {"21yys":"21"},
    {"Email Addressyys":"כתובת דוא\"ל"},
    {"This collects all the messages you’ve missed in one place.yys":"זה אוסף את כל ההודעות שפספסת במקום אחד."},
    {"Aug 20th at 2:50 AMyys":"20 באוגוסט בשעה 02:50"},
    {"Unread direct messages onlyyys":"לא נקראו הודעות ישירות בלבד"},
    {"1:13 PMyys":"13:13"},
    {"Sunday, July 19thyys":"ראשון, 19 ביולי"},
    {"Search: addyys":"חיפוש: הוסף"},
    {"window.wd.track();const s7=document.createElement(\"script\");s7.onload=function(){window.wd.ok(s7)},s7.onerror=function(){window.wd.err(s7)},s7.src=window.wd.cdn+\"client-boot.1ae5cd0.min.js?cacheKey=gantry-1593705949\",s7.defer=!0,s7.crossOrigin=\"anonymous\",document.getElementsByTagName(\"head\")[0].appendChild(s7)yys":"windows.wd.track (); const s7 = document.createElement (\"סקריפט\"); s7.onload = פונקציה () {windows.wd.ok (s7)}, s7.onerror = פונקציה () {windows.wd. err (s7)}, s7.src = windows.wd.cdn \"client-boot.1ae5cd0.min.js? cacheKey = gantry-1593705949\", s7.defer =! 0, s7.crossOrigin = \"אנונימי\", מסמך. getElementsByTagName (\"ראש\") [0] .appendChild (s7)"},
    {"Find in #יעוץyys":"נמצא ב"},
    {"IMG_20200617_201917.jpgyys":"IMG_20200617_201917.jpg"},
    {"יונתן אסרףyys":"יונתן אסרף"},
    {"3:08 AMyys":"03:08"},
    {"The last message you sent will be selected and in editing modeyys":"ההודעה האחרונה ששלחת תיבחר ובמצב עריכה"},
    {"Last reply 29 days agoyys":"תשובה אחרונה לפני 29 יום"},
    {"membersyys":"חברים"},
    {"Show images and files uploaded to Slackyys":"הצג תמונות וקבצים שהועלו ל- Slack"},
    {"Jun 13th at 3:00:13 PMyys":"13 ביוני בשעה 15:00:13"},
    {"Sunday, November 8thyys":"יום ראשון, 8 בנובמבר"},
    {"19 repliesyys":"19 תשובות"},
    {"Jun 4th at 1:07 PMyys":"4 ביוני בשעה 13:07"},
    {"3:45 AMyys":"03:45"},
    {"Also, your team admin must approve an app before it can be installed. yys":"כמו כן, מנהל הצוות שלך צריך לאשר אפליקציה לפני שניתן יהיה להתקין אותה."},
    {"And that’s just the beginning. To view the full list of keyboard shortcuts, just press yys":"וזו רק ההתחלה. לצפייה ברשימה המלאה של קיצורי מקשים, לחץ על"},
    {"Set Upyys":"להכין"},
    {"Key conversationsyys":"שיחות מפתח"},
    {"Share channelyys":"שתף ערוץ"},
    {"Cyys":"ג"},
    {"Learn moreyys":"למד עוד"},
    {"נציג באלעדyys":"נציג באלעד"},
    {"Most recentyys":"הכי עדכני"},
    {"בבקשה בחר אפשרותyys":"בבקשה בחר אפשרות"},
    {"All app typesyys":"כל סוגי האפליקציות"},
    {"2:47 PMyys":"02:47"},
    {"אבי מלאךyys":"אבי מלאך"},
    {"1:20 PMyys":"1:20 אחר הצהריים"},
    {"Tuesday, July 21styys":"יום שלישי, 21 ביולי"},
    {"Tuesday, August 25thyys":"יום שלישי, 25 באוגוסט"},
    {"Message דניאל פוחוביץyys":"הודעה דניאל פוחוביץ"},
    {"was added to #קודים by yys":"נוסף ל"},
    {"12:33 PMyys":"12:33"},
    {"Wednesday, July 8thyys":"יום רביעי, 8 ביולי"},
    {"Hide deactivated user groupsyys":"הסתר קבוצות משתמשים שהושבתו"},
    {"Edit Profileyys":"ערוך פרופיל"},
    {"Dec 18th, 2019 at 12:06:58 AMyys":"18 בדצמבר, 2019 בשעה 12:06:58"},
    {"Tuesday, March 3rdyys":"יום שלישי, 3 במרץ"},
    {"חיפוש: aoyys":"חיפוש: ao"},
    {"Wednesday, June 10thyys":"יום רביעי ה- 10 ביוני"},
    {" for iOS, Android, Mac, Windows and Linux.yys":"עבור iOS, Android, Mac, Windows ו- Linux."},
    {"asdkkkkkkkkk '' '' '' ''yys":"asdkkkkkkkkk '' '' '' '"},
    {"הוראות לקנון M50yys":"הוראות לקנון M50"},
    {"12:38 AMyys":"12:38"},
    {"קנון EOS M100 כרטיס וייפי נמצא בצד של המצלמה בלי צורך לפרק המצלמהyys":"קנון EOS M100 כרטיס וייפי נמצא בצד של המצלמה בלי צורך לפרק המצלמה"},
    {"Jun 17th at 10:26 AMyys":"17 ביוני בשעה 10:26"},
    {"Oldest user groupyys":"קבוצת המשתמשים הישנה ביותר"},
    {"Profile photoyys":"תמונת פרופיל"},
    {"8:09 AMyys":"8:09 בבוקר"},
    {"Jump yys":"קְפִיצָה"},
    {"Sorted scientificallyyys":"ממוינת מדעית"},
    {":-1::skin-tone-2:yys":": -1 :: עור גוון -2:"},
    {"7 repliesyys":"7 תשובות"},
    {"If you already have a status set, Slack won’t change it.yys":"אם כבר יש לך סטטוס, Slack לא ישנה אותו."},
    {"Here’s an example:yys":"להלן דוגמא:"},
    {"New messageyys":"הודעה חדשה"},
    {"כשאני לא פעיל בשולחן העבודה ...yys":"כשאני לא פעיל בשולחן העבודה ..."},
    {"הזמן אנשים לאאוטנט ...yys":"הזמן אנשים לאאוטנט ..."},
    {"- יתכן שהבעיה נמצאת בסוף.yys":"- יתכן שהבעיה הקוד בסוף."},
    {"יהושע יוסוביץyys":"יהושע יוסוביץ"},
    {"IMG_4302.JPGyys":"IMG_4302.JPG"},
    {", and yys":", ו"},
    {"עבדולרמןyys":"עבדולרמן"},
    {"יהודה חבהyys":"יהודה חבה"},
    {"Today at 3:57 PMyys":"היום בשעה 15:57"},
    {" קבצים yys":"קבצים"},
    {"In 1 houryys":"בעוד שעה"},
    {"שתף קישור להזמנהyys":"שתף קישור להזמנה"},
    {"30 דקותyys":"30 דקות"},
    {"Show one-click emoji on messagesyys":"הראה אמוג'י בלחיצה אחת בהודעות"},
    {"Jun 3rdyys":"3 ביוני"},
    {"4:37 AMyys":"04:37"},
    {"If you’d like an easy way to get back to Slack whenever you need to, yys":"אם תרצה דרך קלה לחזור לסלאק בכל פעם שתצטרך,"},
    {"Boldyys":"נוֹעָז"},
    {"סוג אפליקציהyys":"סוג אפליקציה"},
    {"בקשת קודyys":"בקשת קוד"},
    {"Tuesday, June 30thyys":"יום שלישי, 30 ביוני"},
    {"No draftsyys":"אין טיוטות"},
    {"Search: assyys":"חיפוש: ass"},
    {"1:44 PMyys":"1:44 אחר הצהריים"},
    {"Only search my channelsyys":"חפש בערוצים שלי בלבד"},
    {"Channel Sidebaryys":"סרגל הצד הערוץ"},
    {"ערוך פרופילyys":"ערוך פרופיל"},
    {"A to Zyys":"א עד ת"},
    {"Every dayyys":"כל יום"},
    {"2:14 PMyys":"02:14"},
    {"More actionsyys":"יותר פעולות"},
    {"9:46 AMyys":"9:46 בבוקר"},
    {"שעתייםyys":"שעתיים"},
    {"Invite Single-Channel Guestsyys":"הזמן אורחים עם ערוץ יחיד"},
    {"10:56 PMyys":"10:56"},
    {"Mark a message unreadyys":"סמן הודעה שלא נקראה"},
    {"Learn about threadsyys":"למדו על האשכולות"},
    {"hereyys":"פה"},
    {"Jun 18th at 10:35 AMyys":"18 ביוני בשעה 10:35"},
    {"הסתר אפליקציות ובוטיםyys":"הסתר אפליקציות ובוטים"},
    {"set the channel description: עזרה הדדית בנושאים שלא קשורים לאאונטyys":"קבע את תיאור הערוץ: עזרה הדדית בנושאים שלא קשורים לאאונט"},
    {"Taking a look…yys":"מסתכל…"},
    {"Today at 10:32 PMyys":"היום בשעה 10:32"},
    {"Postsyys":"פוסטים"},
    {"שלח לי מדי פעם הצעות לערוצים דרך Slackbotyys":"שלח לי מדי פעם הצעות לערוצים דרך Slackbot"},
    {"Jul 1styys":"1 ביולי"},
    {"(אתה)yys":"(אתה)"},
    {"Sound & appearanceyys":"נשמע"},
    {"Share file…yys":"שתף קובץ ..."},
    {"3 hours agoyys":"לפני 3 שעות"},
    {"Click to downloadyys":"לחץ להורדה"},
    {"Activeyys":"פָּעִיל"},
    {"View threadyys":"צפה בשרשור"},
    {"Adminsyys":"מנהלים"},
    {"sdkyys":"sdk"},
    {"2 repliesyys":"2 תשובות"},
    {"תוכנת-אאוטנטyys":"תוכנת-אאוטנט"},
    {"set the channel topic: נושאים שונים הקשורים לאאוטנט, אינטרנט וטכנולוגיהyys":"הגדר את נושא הערוץ: נושאים שונים הקשורים לאאוטנט, אינטרנט וטכנולוגיה"},
    {"29 days agoyys":"לפני 29 יום"},
    {"1:24 PMyys":"1:24 אחר הצהריים"},
    {"Full & display namesyys":"מלא"},
    {"מָחָרyys":"מָחָר"},
    {"השהה התראותyys":"השהה מכתב"},
    {"3:41 AMyys":"03:41"},
    {"Saved 8 minutes agoyys":"נשמר לפני 8 דקות"},
    {"https://slack.com/intl/en-il/downloads/windowsyys":"https://slack.com/intl/en-il/downloads/windows"},
    {" left.yys":"שמאלה."},
    {"אוֹyys":"אוֹ"},
    {"Hide formattingyys":"הסתר את העיצוב"},
    {"Surely that’s around here somewhere…yys":"בטח זה כאן איפשהו ..."},
    {"Search: asffyys":"חיפוש: אסף"},
    {"Tritanopiayys":"Tritanopia"},
    {"-yys":"-"},
    {"7+ messagesyys":"7 הודעות"},
    {"Workflow creation and publishing has been turned off. You cannot create or update existing workflows.yys":"יצירה ופרסום של זרימת עבודה בוטלה. אינך יכול ליצור או לעדכן תזרימי עבודה קיימים."},
    {"Also, yys":"גַם,"},
    {"Saved 3 minutes agoyys":"נשמר לפני 3 דקות"},
    {"אאוטנטyys":"אאוטנט"},
    {"6:38 AMyys":"6:38 בבוקר"},
    {"Share this messageyys":"שתף הודעה זו"},
    {"לחץ על Ctrl Shift L כדי למצוא או ליצור ערוץyys":"לחץ על Ctrl Shift כדי למצוא או ליצור ערוץ"},
    {"23yys":"23"},
    {"Saved 1 minute agoyys":"נשמר לפני דקה"},
    {"למדו על האשכולותyys":"למדו על האשכולות"},
    {"joined #תוכנת-אאוטנט along with yys":"הצטרף"},
    {"Slackyys":"רָפוּי"},
    {"3:54 AMyys":"03:54"},
    {"image (1).pngyys":"תמונה (1) .png"},
    {"Presentationsyys":"מצגות"},
    {"Upload a Fileyys":"לעלות קובץ"},
    {"8:58 PMyys":"20:58"},
    {"Message שמואל כהןyys":"הודעה שמואל כהן"},
    {"Byys":"ב"},
    {"Star channelyys":"ערוץ כוכב"},
    {"Skin Toneyys":"גוון עור"},
    {"Tomorrowyys":"מָחָר"},
    {"What’s this channel about?yys":"על מה הערוץ הזה?"},
    {"Use the left, right, up and down arrow keys to navigate the emoji search results.yys":"השתמש במקשי החצים שמאלה, ימינה, למעלה ולמטה כדי לנווט בתוצאות החיפוש של אמוג'י."},
    {"Owner of אאוטנטyys":"הבעלים של אאוטנט"},
    {"More unreadsyys":"עוד לא נקראו"},
    {"27 days agoyys":"לפני 27 יום"},
    {"18 repliesyys":"18 תשובות"},
    {"?yys":"?"},
    {"This could be your first name, or a nickname — however you’d like people to refer to you in Slack.yys":"זה יכול להיות שמך הפרטי, או כינוי - עם זאת תרצה שאנשים יפנו אליך בסלאק."},
    {"Send me occasional channel suggestions via Slackbotyys":"שלח לי מדי פעם הצעות לערוצים דרך Slackbot"},
    {"11:50 AMyys":"11:50 בבוקר"},
    {"1:36 PMyys":"1:36 אחר הצהריים"},
    {"Sunday, August 9thyys":"יום ראשון, 9 באוגוסט"},
    {"Kyys":"ק"},
    {"12:46 AMyys":"12:46"},
    {"12:33 AMyys":"12:33"},
    {"Snippetsyys":"קטעי טקסט"},
    {"4 othersyys":"4 אחרים"},
    {"יש הוראות ניתוק לטאבלט וינדוס Lanpaq ?yys":"יש הוראות ניתוק לטאבלט וינדוס לנפק?"},
    {" עצמךyys":"עצמך"},
    {"Toolsyys":"כלים"},
    {"User Groupsyys":"קבוצות משתמש"},
    {"3yys":"3"},
    {"Created on September 23, 2019yys":"נוצר ב- 23 בספטמבר 2019"},
    {"Add a file from…yys":"הוסף קובץ מ- ..."},
    {"2:32 AMyys":"02:32"},
    {"Administrationyys":"מִנהָל"},
    {"Settingsyys":"הגדרות"},
    {"Nov 8th at 11:12 PMyys":"8 בנובמבר בשעה 23:12"},
    {"preferencesyys":"העדפות"},
    {"ערוצי ברירת מחדלyys":"ערוצי ברירת מחדל"},
    {"Start me at the newest message, but leave unseen messages unreadyys":"התחל אותי בהודעה החדשה ביותר, אבל השאר הודעות לא נראות שלא נקראו"},
    {" edited 23 days agoyys":"נערך לפני 23 יום"},
    {"הזמן חבריםyys":"הזמן חברים"},
    {"Set yourself awayyys":"הרחק את עצמך"},
    {"3:48 AMyys":"03:48"},
    {"New channel memberyys":"חבר ערוץ חדש"},
    {"Pinned by yys":"מוצמד על ידי"},
    {"Display the jumbo versions of emoji (up to 23 at a time!) in messages without text.yys":"הצג את גרסאות הג'מבו של אמוג'י (עד 23 בכל פעם!) בהודעות ללא טקסט."},
    {"2:22 PMyys":"02:22"},
    {"Saved 4 minutes agoyys":"נשמר לפני 4 דקות"},
    {"16yys":"16"},
    {":wait:yys":":לַחֲכוֹת:"},
    {"הפעל צליל בעת קבלת הודעהyys":"הפעל צליל בעת קבלת הודעה"},
    {"window.wd.track();const s2=document.createElement(\"script\");s2.onload=function(){window.wd.ok(s2)},s2.onerror=function(){window.wd.err(s2)},s2.src=window.wd.cdn+\"gantry-vendors-client.2252ad7.min.js?cacheKey=gantry-1593705949\",s2.defer=!0,s2.crossOrigin=\"anonymous\",document.getElementsByTagName(\"head\")[0].appendChild(s2)yys":"windows.wd.track (); const s2 = document.createElement (\"סקריפט\"); s2.onload = פונקציה () {windows.wd.ok (s2)}, s2.onerror = פונקציה () {windows.wd. err (s2)}, s2.src = windows.wd.cdn \"gantry-vendors-client.2252ad7.min.js? cacheKey = gantry-1593705949\", s2.defer =! 0, s2.crossOrigin = \"אנונימי\", document.getElementsByTagName (\"ראש\") [0] .appendChild (s2)"},
    {"Mentions & reactionsyys":"אזכורים"},
    {"All channel typesyys":"כל סוגי הערוצים"},
    {"מיין: הכי חדשyys":"שלי: הכי חדש"},
    {"חפש לפי שם קובץ או מילת מפתחyys":"חפש לפי שם קובץ או מילת מפתח"},
    {"Financeyys":"לְמַמֵן"},
    {"Call דניאל פוחוביץyys":"התקשר לדניאל פוחוביץ"},
    {"Show lessyys":"הראי פחות"},
    {"Slack uses your time zone to send summary and notification emails, for times in your activity feeds, and for reminders.yys":"Slack משתמש באזור הזמן שלך כדי לשלוח דוא\"ל סיכום והודעות, לזמנים בעדכוני הפעילות שלך ולתזכורות."},
    {"הודעות ישירותyys":"הודעות ישירות"},
    {"11:25 PMyys":"23:25"},
    {"Newest user groupyys":"קבוצת המשתמשים החדשה ביותר"},
    {"A status update for the teamyys":"עדכון סטטוס לצוות"},
    {"8 days agoyys":"לפני 8 ימים"},
    {"שותף פנימהyys":"שותף פנימה"},
    {"Customize this list in your yys":"התאם אישית את הרשימה הזו שלך"},
    {"ערוצים.yys":"ערוצים."},
    {"שלח התראות למכשירים הניידים שלי:yys":"שלח הודעה למכשירים הניידים שלי:"},
    {"Historyyys":"הִיסטוֹרִיָה"},
    {"Jumpyys":"קְפִיצָה"},
    {"11:04 AMyys":"11:04"},
    {"צמצם את החיפוש שלךyys":"צמצם את החיפוש שלך"},
    {"Choco Mintyys":"מנטה שוקו"},
    {" to…yys":"ל…"},
    {"Spellcheckyys":"בדיקת איות"},
    {"8 repliesyys":"8 תשובות"},
    {"Deactivated accountyys":"חשבון מושבת"},
    {"589yys":"589"},
    {"כליםyys":"כלים"},
    {"חשבונות אורח יפוגו ביום 23:59 ביום האחרון. אנו נשלח לך הודעה יומיים לפני תזכורת.yys":"חשבונות אורח יפוגו ביום 23:59 ביום האחרון. אנו נשלח לך הודעה יומיים לפני תזכורת."},
    {"Share files with your team by adding them to channels and direct messages — or uploading one here.yys":"שתף קבצים עם הצוות שלך על ידי הוספתם לערוצים והודעות ישירות - או העלאת קבצים כאן."},
    {" On a call” when I join a Slack callyys":"בשיחה \"כשאני מצטרף לשיחה רפה"},
    {"Company updatesyys":"עדכוני חברה"},
    {"יוסף חיים אלגרבליyys":"יוסף חיים אלגרבלי"},
    {"Eggplantyys":"חציל"},
    {"8:07 בבוקרyys":"8:07 בבוקר"},
    {"Sunday, June 28thyys":"ראשון, 28 ביוני"},
    {"IMG_0812.JPGyys":"IMG_0812.JPG"},
    {"New messagesyys":"הודעות חדשות"},
    {"Polls, surveys, standups and games in Slack 📊yys":"סקרים, סקרים, סטנדרטים ומשחקים ב- Slack 📊"},
    {"APPyys":"APP"},
    {"Chuwi 8 מישהו ניתק פעם?yys":"Chuwi 8 מישהו ניתק פעם?"},
    {"תאריך משותףyys":"תאריך משותף"},
    {"Friday, June 5thyys":"יום שישי, 5 ביוני"},
    {"Helpyys":"עֶזרָה"},
    {"סרגל צדyys":"סרגל צד"},
    {"2:15 AMyys":"2:15 לפנות בוקר"},
    {"Last reply 6 days agoyys":"תשובה אחרונה לפני 6 ימים"},
    {"3:51 AMyys":"03:51"},
    {"אין תוצאות עבור \"yys":"אין תוצאות עבור"},
    {" created this channel on September 26th, 2019. This is the very beginning of the yys":"יצר ערוץ זה ב- 26 בספטמבר, 2019. זוהי תחילתה של ה-"},
    {"Search by file name or keywordyys":"חפש לפי שם קובץ או מילת מפתח"},
    {"שמואל כהןyys":"שמואל כהן"},
    {"3:28 PMyys":"15:28"},
    {"5:24 AMyys":"05:24"},
    {"3:59 AMyys":"03:59"},
    {"Messageyys":"הוֹדָעָה"},
    {"Want to tinker? Already a pro? Start with a fresh workflow.yys":"רוצים להתעסק? כבר מקצוען? התחל עם זרימת עבודה חדשה."},
    {"התאם אישית אאוטנטyys":"התאם אישית אאוטנט"},
    {"10:40 PMyys":"10:40 אחר הצהריים"},
    {"עצמךyys":"עצמך"},
    {"11:39 AMyys":"11:39"},
    {"Mark a channel as readyys":"סמן ערוץ כנקרא"},
    {"Run Employee Award gameyys":"הפעל משחק פרס עובד"},
    {"Yesterday at 1:17 AMyys":"אתמול בשעה 1:17 בבוקר"},
    {"1:57 AMyys":"01:57"},
    {"נְגִישׁוּתyys":"נְגִישׁוּת"},
    {"Notify me about replies to threads I'm followingyys":"הודע לי על תשובות לנושאים שאני עוקב אחריו"},
    {"Custom responseyys":"תגובה בהתאמה אישית"},
    {"אין תוצאותyys":"אין תוצאות"},
    {"Default Channelsyys":"ערוצי ברירת מחדל"},
    {"תקבל התראות רק בשעות שתבחר. מחוץ לזמנים ההודעות יושהו.yys":"תקבל הודעה רק בשעות שתבחר. מחוץ לזמנים ההודעות יושהו."},
    {"3:10 PMyys":"15:10"},
    {"New email/messageyys":"אימייל / הודעה חדשה"},
    {"Mark all messages as readyys":"סמן את כל ההודעות כנקראו"},
    {"My keywordsyys":"מילות המפתח שלי"},
    {"Last reply 3 days agoyys":"תשובה אחרונה לפני 3 ימים"},
    {"18yys":"18"},
    {"Channel browseryys":"דפדפן הערוץ"},
    {"Ask me lateryys":"שאל אותי אחר כך"},
    {".yys":"."},
    {"ds'df'yys":"ds'df '"},
    {"5:03 AMyys":"5:03 לפנות בוקר"},
    {"Search: qsyys":"חיפוש: qs"},
    {"Lightyys":"אוֹר"},
    {"השתמש בפסיקים כדי להפריד בין כל מילת מפתח. מילות מפתח אינן תלויות רישיות.yys":"השתמש בפסיקים כדי להפריד בין כל מילת מפתח. מילות מפתח אינן תלויות רישיות."},
    {"Ordered listyys":"רשימה מסודרת"},
    {"Showyys":"הופעה"},
    {"MailClarkyys":"MailClark"},
    {"‏‏תוכנה.JPGyys":"תוכנה. JPG"},
    {"set the channel description: תמיכה בכל הקשור לתוכנת אאוטנטyys":"קבע את תיאור הערוץ: תמיכה בכל הקשור לתוכנת אאוטנט"},
    {"Darkyys":"אפל"},
    {"Includes yys":"כולל"},
    {"10:33 AMyys":"10:33"},
    {"חיפוש: apyys":"חיפוש: ap"},
    {"Search: weyys":"חיפוש: אנחנו"},
    {"4:26 AMyys":"04:26"},
    {"Click to view profileyys":"לחץ לצפייה בפרופיל"},
    {"asyys":"כפי ש"},
    {"Allow notifications:yys":"אפשר התראות:"},
    {"Linkyys":"קישור"},
    {"drop us a lineyys":"תוריד לנו שורה"},
    {"No new repliesyys":"אין תשובות חדשות"},
    {"סוג קובץyys":"סוג קובץ"},
    {". It just takes a couple of clicks.yys":". זה פשוט לוקח כמה קליקים."},
    {"Shared inyys":"שותף פנימה"},
    {"אחת לרבע שעהyys":"אחת לרבע שעה"},
    {"1:22 PMyys":"1:22 אחר הצהריים"},
    {"joined #סלאק.yys":"הצטרף"},
    {"Last reply 11 days agoyys":"תשובה אחרונה לפני 11 יום"},
    {"Wednesday, August 12thyys":"יום רביעי, 12 באוגוסט"},
    {"Next weekyys":"שבוע הבא"},
    {"Quick start guideyys":"מדריך להתחלה מהירה"},
    {"New emoji for your team.yys":"אמוג'י חדש לצוות שלך."},
    {"Jun 2ndyys":"2 ביוני"},
    {"About notificationsyys":"על התראות"},
    {"Convert my typed emoticons to emoji, so :D becomes yys":"המיר את סמלי הקלדה שהוקלדו לאימוג'י, כך: D הופך להיות"},
    {"אֲנָשִׁיםyys":"אֲנָשִׁים"},
    {"פתרון תקלותyys":"פתרון תקלות"},
    {"Show channel detailsyys":"הצג פרטי ערוץ"},
    {"Yesterday at 4:37 AMyys":"אתמול בשעה 04:37"},
    {"25yys":"25"},
    {"2:07 PMyys":"14:07"},
    {"Add an appyys":"הוסף אפליקציה"},
    {"Overrides normal behavior in some browsersyys":"גובר על התנהגות רגילה אצל חלק מהדפדפנים"},
    {"Create pollyys":"צור משאל"},
    {"New User Groupyys":"קבוצת משתמשים חדשה"},
    {"Message yyys":"הודעה y"},
    {"11:17 AMyys":"11:17"},
    {"cleared the channel descriptionyys":"מחק את תיאור הערוץ"},
    {"Account typeyys":"סוג החשבון"},
    {"אפשרות נוספתyys":"אפשרות נוספת"},
    {"נח ציטרנבויםyys":"נח ציטרנבוים"},
    {"4:40 AMyys":"04:40"},
    {" mentioned you in yys":"הזכיר אותך ב"},
    {"Documentsyys":"מסמכים"},
    {"joined #ניתוק-פיזי.yys":"הצטרף"},
    {"Search: asdyys":"חיפוש: asd"},
    {"All your appsyys":"כל האפליקציות שלך"},
    {"cleared the channel topicyys":"פינה את נושא הערוץ"},
    {"3:03 PMyys":"15:03"},
    {"Until tomorrowyys":"עד מחר"},
    {"Search: sjdkasjyys":"חיפוש: sjdkasj"},
    {"Reply…yys":"תשובה…"},
    {"4:11 AMyys":"04:11"},
    {"Last reply 15 days agoyys":"תשובה אחרונה לפני 15 יום"},
    {"10 repliesyys":"10 תשובות"},
    {"All Published Workflowsyys":"כל זרימות העבודה שפורסמו"},
    {"Shift Returnyys":"Shift Return"},
    {"asdkkkkkkkkkyys":"asdkkkkkkkkk"},
    {"Tend to your threadsyys":"נטו לחוטים שלכם"},
    {"Saturday, October 17thyys":"יום שבת 17 באוקטובר"},
    {"Upload an Imageyys":"העלה תמונה"},
    {"19yys":"19"},
    {"These guests will only have access to messages and files in specified channels.yys":"לאורחים אלה תהיה גישה רק להודעות ולקבצים בערוצים שצוינו."},
    {"Saved a moment agoyys":"נשמר לפני רגע"},
    {"העדפותyys":"העדפות"},
    {":wave: Hi, I'm @Megyys":":גַל: הי, אני @ מג"},
    {"Thursday, August 20thyys":"יום חמישי, 20 באוגוסט"},
    {"בדוק את הקשר שלךyys":"בדוק את הקשר שלך"},
    {"Jul 12th at 1:20 PMyys":"12 ביולי בשעה 1:20 אחר הצהריים"},
    {"9:51 AMyys":"9:51 בבוקר"},
    {"Jul 7th at 11:16:45 AMyys":"7 ביולי בשעה 11:16:45"},
    {"3:00 PMyys":"3:00 בצהריים"},
    {"Enable notificationsyys":"אפשר התראות"},
    {"2:18 PMyys":"02:18"},
    {"9:13 AMyys":"9:13 בבוקר"},
    {"Discothequeyys":"דִיסקוֹטֶק"},
    {"Move to new sectionyys":"עבור לקטע חדש"},
    {"39 filesyys":"39 קבצים"},
    {"1 messageyys":"הודעה אחת"},
    {"Set a statusyys":"קבע סטטוס"},
    {"4:54 AMyys":"04:54"},
    {"removed an integration from this channel: yys":"הסיר אינטגרציה מערוץ זה:"},
    {"Jump to…yys":"קפוץ אל…"},
    {"1:38 AMyys":"01:38"},
    {"2:45 PMyys":"02:45"},
    {"12:49 PMyys":"12:49"},
    {"Blockquoteyys":"מצערת"},
    {"11 repliesyys":"11 תשובות"},
    {"הוסף ערוץyys":"הוסף ערוץ"},
    {"Exclude these channels from search results:yys":"אל תכלול ערוצים אלה מתוצאות חיפוש:"},
    {"תפקיד בארגוןyys":"תפקיד בארגון"},
    {"Open the Slack AppSlack app logoyys":"פתח את האפליקציה Slack לוגו של אפליקציה רפה"},
    {"הצג תג (yys":"הצג תג ("},
    {"IMG_20200617_232845[1].jpgyys":"IMG_20200617_232845 [1] .jpg"},
    {"Search: askyys":"חיפוש: תשאל"},
    {"מדריך יציאה מוינ ס.pdfyys":"מדריך יציאה מוינ ס. Pdf"},
    {"All your channelsyys":"כל הערוצים שלך"},
    {"הזמינו לערוץyys":"הזמינו לימוץ"},
    {"יואל רוטמןyys":"יואל רוטמן"},
    {"Preferencesyys":"העדפות"},
    {"Create a pollyys":"צור משאל"},
    {"Z to Ayys":"ז עד א"},
    {"Last reply 4 days agoyys":"תשובה אחרונה לפני 4 ימים"},
    {":גַל: הי, אני @ מגyys":": גַל: הי, אני @ מג"},
    {"Shiftyys":"מִשׁמֶרֶת"},
    {"12:23 PMyys":"12:23"},
    {"App Directory Categoriesyys":"קטגוריות ספריית אפליקציות"},
    {"Search: sdyys":"חיפוש: sd"},
    {"3:09 AMyys":"03:09"},
    {"05:37yys":"05:37"},
    {"Spreadsheetsyys":"גיליונות אלקטרוניים"},
    {"A warm welcome for new teammatesyys":"קבלת פנים חמה לחברי הצוות החדשים"},
    {"יעוץyys":"יעוץ"},
    {"Search messages, files, and moreyys":"חפש הודעות, קבצים ועוד"},
    {"Monday, July 27thyys":"יום שני, 27 ביולי"},
    {"Priorityyys":"עדיפות"},
    {"חפש בכל רחבי Slackyys":"רפוי"},
    {"as soon as I'm inactiveyys":"ברגע שאני לא פעיל"},
    {"מאקבוק AIRyys":"מאקבוק AIR"},
    {"Ctrl+/yys":"Ctrl /"},
    {"Ultravioletyys":"אוּלְטרָה סָגוֹל"},
    {"5:42 PMyys":"17:42"},
    {"Copy linkyys":"העתק קישור"},
    {"5:27 AMyys":"05:27"},
    {"See All 37 Membersyys":"ראה את כל 37 החברים"},
    {"Draftyys":"טְיוּטָה"},
    {"Thursday, June 25thyys":"יום חמישי, 25 ביוני"},
    {" joined.yys":"הצטרף."},
    {"Announcementsyys":"הכרזות"},
    {"dsf'yys":"dsf '"},
    {"Search: asddsdfyys":"חיפוש: asddsdf"},
    {"Edit messageyys":"ערוך הודעה"},
    {"Turn offyys":"לכבות"},
    {"yys":""},
    {"אל תפריעyys":"אל תפריע"},
    {"Ctrl+Shift+yys":"Ctrl Shift"},
    {"Resetyys":"אִתחוּל"},
    {"Recent activityyys":"פעילות אחרונה"},
    {"פעם בשעהyys":"פעם בשעה"},
    {"Clearyys":"ברור"},
    {"Search by name or category (e.g. productivity, sales)yys":"חפש לפי שם או קטגוריה (למשל פריון, מכירות)"},
    {"Mark your to-dos or save something for another time. Only you can see your saved items, so use them however you’d like.yys":"סמן את המטלה שלך או שמור משהו בפעם אחרת. רק אתה יכול לראות את הפריטים השמורים שלך, אז השתמש בהם איך שאתה רוצה."},
    {"בצלאל מדרyys":"בצלאל מדר"},
    {"Peopleyys":"אֲנָשִׁים"},
    {"Are you sure you want to delete this draft to yys":"האם אתה בטוח שברצונך למחוק טיוטה זו ל"},
    {"Manage shared channelsyys":"נהל ערוצים משותפים"},
    {"Translateyys":"תרגם"},
    {"Team channels and direct messagesyys":"ערוצי צוות והודעות ישירות"},
    {"Last reply 6 months agoyys":"תשובה אחרונה לפני 6 חודשים"},
    {" created this channel on September 23rd, 2019. This is the very beginning of the yys":"יצר ערוץ זה ב- 23 בספטמבר, 2019. זוהי תחילתה של ה-"},
    {"50 filesyys":"50 קבצים"},
    {"קבוצת המשתמשים הישנה ביותרyys":"קבוצת הספר הישנה ביותר"},
    {"מסיבה כלשהי, Slack לא יכול היה לטעון 😓yys":"מסיבה חדשה, Slack לא יכול היה לטעון 😓"},
    {"Share withyys":"שתף עם"},
    {"Add people to #יעוץyys":"הוסף אנשים ל"},
    {"Alphabeticallyyys":"אלפביתית"},
    {"Page Downyys":"עמוד למטה"},
    {"asddsdfyys":"asddsdf"},
    {"2:17 PMyys":"02:17"},
    {"משה פרעסyys":"משה פרס"},
    {"התאם את הזמןyys":"התאם את הזמן"},
    {"Wednesday, June 3rdyys":"יום רביעי, 3 ביוני"},
    {"הכרזותyys":"הכרזות"},
    {"When typing code with ```, yys":"בעת הקלדת קוד עם `` `,"},
    {"Monday, October 5thyys":"יום שני, 5 באוקטובר"},
    {"שִׂיחָהyys":"שִׂיחָה"},
    {"View pinned itemsyys":"צפה בפריטים מוצמדים"},
    {"4 draftsyys":"4 טיוטות"},
    {"IMG_20200617_232845 [1] .jpgyys":"IMG_20200617_232845 [1] .jpg"},
    {"Sunday, August 30thyys":"יום ראשון, 30 באוגוסט"},
    {"Add a message, if you’d like.yys":"הוסף הודעה, אם תרצה."},
    {"8:53 AMyys":"8:53 בבוקר"},
    {"בסביבת העבודה שלךyys":"בסביבת העבודה שלך"},
    {"Last reply 1 day agoyys":"תשובה אחרונה לפני יום אחד"},
    {"צא מאאוטנטyys":"צא מאאוטנט"},
    {"אליעזר רייטןyys":"אליעזר רייטן"},
    {"Hothyys":"חוה"},
    {"Jun 17th at 10:34 AMyys":"17 ביוני בשעה 10:34"},
    {"Show a badge (yys":"הצג תג ("},
    {"Add workspacesyys":"הוסף סביבות עבודה"},
    {"Jun 15th at 6:29 AMyys":"15 ביוני בשעה 06:29"},
    {"20200618_203509.jpgyys":"20200618_203509.jpg"},
    {"·yys":"·"},
    {"Oldestyys":"הוותיק ביותר"},
    {"asdsfyys":"asdsf"},
    {"פוליyys":"פולי"},
    {"Descriptionyys":"תיאור"},
    {"Teamyys":"קְבוּצָה"},
    {"ניתיק פיזי בטאבלט יכול לפגוע בה gps?yys":"ניתיק פיזי בטאבלט יכול לפגוע בה gps?"},
    {"Search high and lowyys":"חפש גבוה ונמוך"},
    {"Friday, October 2ndyys":"יום שישי, 2 באוקטובר"},
    {"12:24 AMyys":"12:24"},
    {"You’ll be notified about new repliesyys":"תקבלו הודעה על תשובות חדשות"},
    {"Add, edit or reorder fieldsyys":"הוסף, ערוך או סדר מחדש שדות"},
    {"Reactionsyys":"תגובות"},
    {"יעקב מרדכי קריזרyys":"יעקב מרדכי קריזר"},
    {"Search: helyys":"חיפוש: הל"},
    {"\"yys":""},
    {"Screenshot_20200615_232409.jpgyys":"צילום מסך_20200615_232409.jpg"},
    {"Jun 3rd at 2:31 AMyys":"3 ביוני בשעה 2:31 בבוקר"},
    {"Please select an optionyys":"בבקשה בחר אפשרות"},
    {"Open Agora Pollsyys":"סקרי סקר אגורה"},
    {"Channel typeyys":"סוג הערוץ"},
    {"IMG_4303.JPGyys":"IMG_4303.JPG"},
    {"resized_IMG_0849.jpgyys":"שינוי גודל_IMG_0849.jpg"},
    {"Guest accounts will expire on 11:59PM on the last day. We’ll send you a message 2 days prior as a reminder.yys":"חשבונות אורח יפוגו ביום 23:59 ביום האחרון. אנו נשלח לך הודעה יומיים לפני תזכורת."},
    {"13 hours agoyys":"לפני 13 שעות"},
    {"  yys":"  "},
    {"Google Driveyys":"גוגל דרייב"},
    {"Workflow Builderyys":"בונה זרימת עבודה"},
    {"13 days agoyys":"לפני 13 יום"},
    {"We strongly recommend enabling desktop notifications if you'll be using Slack on this computer.yys":"אנו ממליצים בחום להפעיל התראות בשולחן העבודה אם אתה משתמש ב- Slack במחשב זה."},
    {"Search: jkyys":"חיפוש: jk"},
    {"4:39 AMyys":"04:39"},
    {"jkyys":"jk"},
    {"Developer Toolsyys":"כלים למפתחים"},
    {"נחמן האסyys":"נחמן האס"},
    {"Last reply 13 days agoyys":"תשובה אחרונה לפני 13 יום"},
    {"26yys":"26"},
    {"Include a preview of the message in each notification yys":"כלול תצוגה מקדימה של ההודעה בכל הודעה"},
    {"Sortyys":"סוג"},
    {"Call yyys":"התקשר אל y"},
    {"חפש אאוטנטyys":"חפש אאוטנט"},
    {"יותר…yys":"יותר…"},
    {"Last reply today at 4:24 AMyys":"תשובה אחרונה היום בשעה 04:24"},
    {"Appsyys":"אפליקציות"},
    {"Thursday, July 9thyys":"יום חמישי, 9 ביולי"},
    {"Endyys":"סוֹף"},
    {"0yys":"0"},
    {"חיפוש: אyys":"חיפוש: א"},
    {"Saturday, June 6thyys":"שבת, 6 ביוני"},
    {"window.translationMap={\"en-US\":window.wd.cdn+\"gantry-translations_en-US.c30e29876920155bfc04.min.json?cacheKey=gantry-1593705949\",\"en-GB\":window.wd.cdn+\"gantry-translations_en-GB.b8376245eaadf5d80d47.min.json?cacheKey=gantry-1593705949\",\"de-DE\":window.wd.cdn+\"gantry-translations_de-DE.53d82ef26853a51c8f6e.min.json?cacheKey=gantry-1593705949\",\"es-ES\":window.wd.cdn+\"gantry-translations_es-ES.c22920d74b2fecdd74ac.min.json?cacheKey=gantry-1593705949\",\"es-LA\":window.wd.cdn+\"gantry-translations_es-LA.03fa93491b25e09b61b0.min.json?cacheKey=gantry-1593705949\",\"fr-FR\":window.wd.cdn+\"gantry-translations_fr-FR.30288271082f252730a9.min.json?cacheKey=gantry-1593705949\",\"pt-BR\":window.wd.cdn+\"gantry-translations_pt-BR.64491ffcbf28b94b2bf2.min.json?cacheKey=gantry-1593705949\",\"ja-JP\":window.wd.cdn+\"gantry-translations_ja-JP.79904274cd568a30573a.min.json?cacheKey=gantry-1593705949\",\"ko-KR\":window.wd.cdn+\"gantry-translations_ko-KR.37c861388bb99b2e3e7f.min.json?cacheKey=gantry-1593705949\",\"it-IT\":window.wd.cdn+\"gantry-translations_it-IT.53252d06adda77118284.min.json?cacheKey=gantry-1593705949\",\"zh-CN\":window.wd.cdn+\"gantry-translations_zh-CN.53252d06adda77118284.min.json?cacheKey=gantry-1593705949\",\"zh-TW\":window.wd.cdn+\"gantry-translations_zh-TW.53252d06adda77118284.min.json?cacheKey=gantry-1593705949\",\"ru-RU\":window.wd.cdn+\"gantry-translations_ru-RU.53252d06adda77118284.min.json?cacheKey=gantry-1593705949\"},window.performance&&window.performance.timing&&(window.sonic_boot__phase_1__duration=Date.now()-performance.timing.fetchStart,window.sonic_boot__phase_1_5__start=Date.now(),window.performance.mark&&performance.mark(\"start_load\"))yys":"windows.translationMap = {\"en-US\": windows.wd.cdn \"gantry-Translations_en-US.c30e29876920155bfc04.min.json? cacheKey = gantry-1593705949\", \"en-GB\": windows.wd.cdn \"gantry- תרגומים_en-GB.b8376245eaadf5d80d47.min.json? cacheKey = gantry-1593705949 \",\" de-DE \": windows.wd.cdn\" gantry-Translations_de-DE.53d82ef26853a51c8f6e.min.json? cacheKey = gantry-1593705949 \",\" -ES \": windows.wd.cdn\" gantry-Translations_es-ES.c22920d74b2fecdd74ac.min.json? CacheKey = gantry-1593705949 \",\" es-LA \": windows.wd.cdn\" gantry-Translations_es-LA.03fa93491b25e09b61b0.min .json? cacheKey = gantry-1593705949 \",\" fr-FR \": windows.wd.cdn\" gantry-Translations_fr-FR.30288271082f252730a9.min.json? cacheKey = gantry-1593705949 \",\" pt-BR \": windows.wd .cdn \"gantry-Translations_pt-BR.64491ffcbf28b94b2bf2.min.json? cacheKey = gantry-1593705949\", \"ja-JP\": windows.wd.cdn \"gantry-Translations_ja-JP.79904274cd568a30573a.min.json? cacheKey = gantry- 1593705949 \",\" ko-KR \": windows.wd.cdn\" gantry-Translations_ko-KR.37c861388bb99b2e3e7f.min.json? CacheKey = gantry-1593705949 \",\" it-IT \": חלון .wd.cdn \"gantry-Translations_it-IT.53252d06adda77118284.min.json? cacheKey = gantry-1593705949\", \"zh-CN\": windows.wd.cdn \"gantry-Translations_zh-CN.53252d06adda77118284.min.json? cacheKey = gantry-1593705949 \",\" zh-TW \": windows.wd.cdn\" gantry-Translations_zh-TW.53252d06adda77118284.min.json? cacheKey = gantry-1593705949 \",\" ru-RU \": windows.wd.cdn\" gantry- Translations_ru-RU.53252d06adda77118284.min.json? cacheKey = gantry-1593705949 \"}, windows.performance"},
    {"Search by name, role or teamyys":"חפש לפי שם, תפקיד או צוות"},
    {"Create calendar eventsyys":"צור אירועי לוח שנה"},
    {"We strongly recommend enabling notifications so that you'll know when important activity happens in your Slack workspace.yys":"אנו ממליצים בחום להפעיל התראות כדי שתדע מתי מתרחשת פעילות חשובה בסביבת העבודה שלך."},
    {"Hide apps and botsyys":"הסתר אפליקציות ובוטים"},
    {" to search this channelyys":"לחפש בערוץ זה"},
    {"אביyys":"אבי"},
    {"12yys":"12"},
    {"5:20 AMyys":"05:20"},
    {"(אופציונאלי)yys":"(אופציונאלי)"},
    {"Thursday, October 15thyys":"יום חמישי, 15 באוקטובר"},
    {"Type the name of a personyys":"הקלד את שם האדם"},
    {"2:57 PMyys":"14:57"},
    {" קבוצות משתמש yys":"משותפת משתמש"},
    {"הראי פחותyys":"הראי פחות"},
    {"קבוצת משתמשים חדשהyys":"קבוצת משתמשים חדשה"},
    {"Saturday, October 24thyys":"יום שבת 24 באוקטובר"},
    {"Returnyys":"לַחֲזוֹר"},
    {"Aboutyys":"על אודות"},
    {"כל סוגי האפליקציותyys":"כל סוג האפליקציות"},
    {"Last reply 1 month agoyys":"תשובה אחרונה לפני חודש"},
    {"40 filesyys":"40 קבצים"},
    {"Delete draft?yys":"למחוק טיוטה?"},
    {"Add Emojiyys":"הוסף אמוג'י"},
    {"Search for files, for people, for half-remembered fragments of conversationyys":"חפש קבצים, עבור אנשים, עבור קטעי שיחה שזכרו למחצה"},
    {"31yys":"31"},
    {"Get an invite link to shareyys":"קבל קישור להזמנה לשיתוף"},
    {"22 repliesyys":"22 תשובות"},
    {"I just reviewed it and ready to provide feedbackyys":"רק בדקתי את זה ומוכן לתת משוב"},
    {"Jun 22nd at 3:28 PMyys":"22 ביוני בשעה 15:28"},
    {"9:28 AMyys":"9:28 בבוקר"},
    {"Add descriptionyys":"הוסף תיאור"},
    {"toyys":"ל"},
    {"1:38 PMyys":"13:38"},
    {"תקבל עזרהyys":"תקבל עזרה"},
    {"Jun 17th at 9:46 AMyys":"17 ביוני בשעה 9:46 בבוקר"},
    {"Automate your everyday tasks with workflows. You can also check out some yys":"אוטומציה של המשימות היומיומיות שלך באמצעות תזרימי עבודה. אתה יכול גם לבדוק כמה"},
    {"Ask if I want to toggle my away status when I log in after having set myself awayyys":"שאל אם אני רוצה להחליף את הסטטוס הלאומי כשאני נכנס לחשבון לאחר שהסגרתי את עצמי"},
    {"Wednesday, June 17thyys":"יום רביעי ה- 17 ביוני"},
    {"12:28 PMyys":"12:28"},
    {"@everyoneyys":"@כל אחד"},
    {"Show…yys":"הופעה…"},
    {"2:08 PMyys":"14:08"},
    {"יועץyys":"יועץ"},
    {"Pause notificationsyys":"השהה התראות"},
    {"Create Sectionyys":"צור קטע"},
    {"Language & regionyys":"שפה"},
    {"2:34 PMyys":"02:34"},
    {"asdf אני עוד בשלב למידה...yys":"asdf אני עוד בתוך למידה ..."},
    {"אפליקציותyys":"אפליקציות"},
    {"11:35 AMyys":"11:35"},
    {"Pin to הכרזותyys":"הצמד ל הכרזות"},
    {" starts the Quick Switcheryys":"מפעיל את המהפך המהיר"},
    {"11:35 PMyys":"23:35"},
    {"Testyys":"מִבְחָן"},
    {"להוסיף עודyys":"להוסיף עוד"},
    {" key and click on it.yys":"מקש ולחץ עליו."},
    {"NEWyys":"חָדָשׁ"},
    {"12:48 AMyys":"12:48"},
    {"45 repliesyys":"45 תשובות"},
    {"Xyys":"איקס"},
    {"Languageyys":"שפה"},
    {"Search: helpyys":"חיפוש: עזרה"},
    {"11:36 AMyys":"11:36"},
    {"36 חבריםyys":"36 חברים"},
    {"was added to #סלאק by yys":"נוסף ל"},
    {"Workspace Adminyys":"מנהל סביבת עבודה"},
    {"4:22 AMyys":"04:22"},
    {"Mark unreadyys":"סמן כלא נקרא"},
    {"אתה מוכן לyys":"אתה מוכן ל"},
    {"Search: jyys":"חיפוש: j"},
    {"Search: aoyys":"חיפוש: ao"},
    {"4:15 AMyys":"4:15 לפנות בוקר"},
    {"Pin to channelyys":"הצמד לערוץ"},
    {"Scheduled date & timeyys":"תאריך מתוזמן"},
    {"או שהתקשרה למיבצר? skdjkasjdyys":"או שהתקשרה למיבצר? skdjkasjd"},
    {"Last reply today at 2:00 AMyys":"תשובה אחרונה היום בשעה 2:00 לפנות בוקר"},
    {"What do you want to search for today?yys":"מה אתה רוצה לחפש היום?"},
    {"סוג החשבוןyys":"סוג החשבון"},
    {"Add Peopleyys":"הוסף אנשים"},
    {"Browse channelsyys":"עיין בערוצים"},
    {"(optional)yys":"(אופציונאלי)"},
    {"הזמן אורחיםyys":"הזמן אורחים"},
    {"Yesterday at 12:46:43 AMyys":"אתמול בשעה 12:46:43 בבוקר"},
    {"Share message…yys":"שתף הודעה ..."},
    {"IMG_20200617_230318[1].jpgyys":"IMG_20200617_230318 [1] .jpg"},
    {"Jun 17thyys":"17 ביוני"},
    {"See past invitesyys":"ראה הזמנת עבר"},
    {"5 repliesyys":"5 תשובות"},
    {"When writing a message, press yys":"בעת כתיבת הודעה, לחץ על"},
    {" to navigateyys":"לנווט"},
    {"‏‏לכידה1.JPGyys":"לכידה 1. JPG"},
    {"Additional optionsyys":"אפשרויות נוספות"},
    {"5:37 AMyys":"05:37"},
    {"Scientificallyyys":"מדעית"},
    {"האשכולות שאתה מעורב בהם ייאספו כאן.yys":"האשכולות שאתה מעורב בו ייאספו כאן."},
    {"Jun 23rdyys":"23 ביוני"},
    {"ברגע שאני לא פעילyys":"זה שאני לא פעיל"},
    {"Workflowyys":"זרימת עבודה"},
    {"מילות המפתח שליyys":"מילות המפתח שלי"},
    {"12 days agoyys":"לפני 12 יום"},
    {"Search: ASDyys":"חיפוש: ASD"},
    {"Multi-Channel Guests see a partial directory and can only access messages and files from selected channels.yys":"אורחים רב-ערוציים רואים ספרייה חלקית ויכולים לגשת רק להודעות וקבצים מערוצים שנבחרו."},
    {"שניר סרוסיyys":"שניר סרוסי"},
    {"Your workspace is currently on Slack's yys":"סביבת העבודה שלך נמצאת כרגע ב- Slack"},
    {"7 apps in אאוטנטyys":"7 אפליקציות באאוטנט"},
    {"Accessibilityyys":"נְגִישׁוּת"},
    {"Manage user groupsyys":"נהל קבוצות משתמשים"},
    {"Expensiveyys":"יָקָר"},
    {"Messagesyys":"הודעות"},
    {"Jul 17th at 1:49:23 AMyys":"17 ביולי בשעה 1:49:23 בבוקר"},
    {"Slack marks a channel read as soon as you view it. You can change this if you’d like.yys":"Slack מסמן ערוץ שנקרא ברגע שאתה צופה בו. אתה יכול לשנות את זה אם תרצה."},
    {"יהודית ויזלyys":"יהודית ויזל"},
    {"Jun 11th at 12:56:03 AMyys":"11 ביוני בשעה 12:56:03 בבוקר"},
    {"Search by team name, project or departmentyys":"חפש לפי שם הצוות, הפרויקט או המחלקה"},
    {"Turn question into pollyys":"הפוך את השאלה לסקר"},
    {"Monday, August 31styys":"יום שני, 31 באוגוסט"},
    {"עבור iOS, Android, Mac, Windows ו- Linux.yys":"עבור iOS, Android, Mac, Windows ו- Linux."},
    {"משותפת משתמשyys":"משותפת משתמש"},
    {"IMG_0810.JPGyys":"IMG_0810.JPG"},
    {"Friday, June 19thyys":"יום שישי, 19 ביוני"},
    {"Filteryys":"לְסַנֵן"},
    {"Add reaction...yys":"הוסף תגובה ..."},
    {"17yys":"17"},
    {"יותרyys":"יותר"},
    {"ניסיונותyys":"ניסיונות"},
    {"window.wd.track();const s3=document.createElement(\"script\");s3.onload=function(){window.wd.ok(s3)},s3.onerror=function(){window.wd.err(s3)},s3.src=window.wd.cdn+\"gantry-shared.47a059b.min.js?cacheKey=gantry-1593705949\",s3.defer=!0,s3.crossOrigin=\"anonymous\",document.getElementsByTagName(\"head\")[0].appendChild(s3)yys":"windows.wd.track (); const s3 = document.createElement (\"סקריפט\"); s3.onload = פונקציה () {windows.wd.ok (s3)}, s3.onerror = פונקציה () {windows.wd. err (s3)}, s3.src = windows.wd.cdn \"gantry-shared.47a059b.min.js? cacheKey = gantry-1593705949\", s3.defer =! 0, s3.crossOrigin = \"אנונימי\", מסמך. getElementsByTagName (\"ראש\") [0] .appendChild (s3)"},
    {"Jun 6th at 2:10 PMyys":"6 ביוני בשעה 14:10"},
    {"Choose this if you’d like your reply to post in the channel, tooyys":"בחר בזה אם תרצה שהתשובה שלך לפרסום בערוץ"},
    {" אשכולות yys":"אשכולות"},
    {"Mention someoneyys":"הזכיר מישהו"},
    {"Search: ASDDyys":"חיפוש: ASDD"},
    {"Get helpyys":"תקבל עזרה"},
    {"44 repliesyys":"44 תשובות"},
    {"Nocturneyys":"לֵילִית"},
    {"You can upload any important email to Slack by forwarding it to a unique email address. Slackbot will deliver the email, and you can keep it private or share it with your team.yys":"תוכל להעלות כל דוא\"ל חשוב לסל\"ק על ידי העברתו לכתובת דוא\"ל ייחודית. Slackbot יעביר את הדוא\"ל ותוכל לשמור עליו פרטי או לשתף אותו עם הצוות שלך."},
    {"Standard Planyys":"תוכנית סטנדרטית"},
    {"Simple Pollyys":"סקר פשוט"},
    {" by selecting “Mark unread” from the message's menu. Or simply hold down the yys":"על ידי בחירת \"סמן שלא נקראה\" מתפריט ההודעה. או פשוט לחץ על"},
    {" to Slack's servers.yys":"לשרתים של Slack."},
    {"Last reply 7 days agoyys":"תשובה אחרונה לפני 7 ימים"},
    {")yys":")"},
    {") in my channel list when someone uses one of my keywords:yys":") ברשימת הערוצים שלי כאשר מישהו משתמש באחת ממילות המפתח שלי:"},
    {"helloyys":"שלום"},
    {"Search: weryys":"חיפוש: wer"},
    {"Input optionsyys":"אפשרויות קלט"},
    {"Delve into your archives, seize upon the answers. Rejoice.yys":"התעמק בארכיונים שלך, נצל את התשובות. לִשְׂמוֹחַ."},
    {"set the channel topic: אופיס םרוץ ברשתyys":"הגדר את נושא הערוץ: אופיס םרוץ ברשת"},
    {"(window.webpackJsonp=window.webpackJsonp||[]).push([[173],{LMhI:function(n,w,o){}},[[\"LMhI\",1]]])yys":"(windows.webpackJsonp = windows.webpackJsonp || []). לדחוף ([[173], {LMhI: פונקציה (n, w, o) {}}, [[\"LMhI\", 1]]])"},
    {"deleteyys":"לִמְחוֹק"},
    {"Colorsyys":"צבעים"},
    {"Compose a new messageyys":"כתוב הודעה חדשה"},
    {"6yys":"6"},
    {"צפה בפרופילyys":"צפה בפרופיל"},
    {"Jump to dateyys":"קפצו לתאריך"},
    {"המותאם אישית…yys":"עובדאם אישית ..."},
    {"9yys":"9"},
    {"Created on June 3, 2020yys":"נוצר ב- 3 ביוני 2020"},
    {"Invite people to אאוטנטyys":"הזמן אנשים לאאוטנט"},
    {"Tuesday, August 11thyys":"יום שלישי, 11 באוגוסט"},
    {" that people will get as soon as they join your channel.yys":"שאנשים יקבלו ברגע שהם יצטרפו לערוץ שלך."},
    {"View in channelyys":"צפו בערוץ"},
    {"לכל אלה שכן ניתקו הסאמוויקס Q2 לידיעתכם עילי בלוטוס יש אינטרנטyys":"לכל אלה שכן ניתקו הסאמוויקס Q2 לידיעתכם עילי בלוטוס יש אינטרנט"},
    {"Here are a few things to try:yys":"להלן מספר דברים שכדאי לנסות:"},
    {"Copy nameyys":"העתק שם"},
    {"סרגל הצד הערוץyys":"סרגל צד הערוץ"},
    {" (optional)yys":"(אופציונאלי)"},
    {"https://videotron.tmtx.ca/en.htmlyys":"https://videotron.tmtx.ca/en.html"},
    {"Reload Slackyys":"טען מחדש רפיון"},
    {"Slack needs your permission to yys":"Slack זקוק לאישורך שלך"},
    {"61 filesyys":"61 קבצים"},
    {"11:24 PMyys":"11:24 אחר הצהריים"},
    {"Todayyys":"היום"},
    {"8yys":"8"},
    {"Create new sectionyys":"צור קטע חדש"},
    {"לוח זמנים להודעותyys":"לוח זמנים להודעות"},
    {"תוכנית סטנדרטיתyys":"תוכנית סטנדרטית"},
    {"escyys":"יציאה"},
    {"1 workflowyys":"זרימת עבודה 1"},
    {"joined #יעוץ along with yys":"הצטרף"},
    {"Analyticsyys":"ניתוח"},
    {"Search: ayys":"חיפוש: א"},
    {"רבקה כהןyys":"רבקה כהן"},
    {"Last reply 5 days agoyys":"תשובה אחרונה לפני 5 ימים"},
    {"שותף על ידיyys":"שותף על ידי"},
    {"Guestsyys":"אורחים"},
    {"Uyys":"U"},
    {"Pin to yys":"הצמד ל"},
    {"No exact matchesyys":"אין התאמות מדויקות"},
    {"No itemsyys":"אין פריטים"},
    {"Jun 7th at 4:37 AMyys":"7 ביוני בשעה 04:37"},
    {"לכבותyys":"לכבות"},
    {"Search for a missing linkyys":"חפש קישור חסר"},
    {" edited 11 days agoyys":"נערך לפני 11 יום"},
    {"What I doyys":"מה שאני עושה"},
    {"Create native and simple polls in Slack.yys":"צור סקרים מקוריים ופשוטים ב- Slack."},
    {"אפשר התראות בשולחן העבודהyys":"אפשר להתכתב בשולחן העבודה"},
    {"ניתיק פיזי בטאבלט יכול לפגוע בהgps?yys":"ניתיק פיזי בטאבלט יכול לפגוע בה gps?"},
    {"הצג שםyys":"הצג שם"},
    {" edited 25 days agoyys":"נערך לפני 25 יום"},
    {"3:01 PMyys":"03:01"},
    {"Dyys":"ד"},
    {"Search by channel name or descriptionyys":"חפש לפי שם הערוץ או תיאורו"},
    {"Created on September 26, 2019yys":"נוצר ב- 26 בספטמבר 2019"},
    {"Attach fileyys":"לצרף קובץ"},
    {"4:17 PMyys":"16:17"},
    {"10:32 AMyys":"10:32"},
    {"התראות שולחן עבודה מושבתות כרגעyys":"הודעה שולחן עבודה מושבתות כרגע"},
    {"הוֹדָעָהyys":"הוֹדָעָה"},
    {"Friday, September 18thyys":"יום שישי, 18 בספטמבר"},
    {"When I mark everything as read:yys":"כשאני מסמן הכל כנקרא:"},
    {"7 months agoyys":"לפני 7 חודשים"},
    {"Tuesday, July 7thyys":"יום שלישי, 7 ביולי"},
    {"Get notifications about Google Drive files within Slackyys":"קבל התראות על קבצי Google Drive בתוך Slack"},
    {"OutnetSoftwares_v2.99.7.zipyys":"OutnetSoftwares_v2.99.7.zip"},
    {"7 new messagesyys":"7 הודעות חדשות"},
    {"12:32 AMyys":"12:32"},
    {"Sort...yys":"סוג..."},
    {"אנדרואידyys":"אנדרואיד"},
    {"1:42 PMyys":"1:42 אחר הצהריים"},
    {"5:22 AMyys":"05:22"},
    {"עזרה_הדדיתyys":"עזרה_הדדית"},
    {" that lets your team give updates on when they’re out of the office, working remotely and more.yys":"מה שמאפשר לצוות שלך לעדכן כשהם מחוץ למשרד, עובדים מרחוק ועוד."},
    {"40 membersyys":"40 חברים"},
    {"Sunday, August 23rdyys":"יום ראשון, 23 באוגוסט"},
    {"Last monthyys":"חודש שעבר"},
    {"Sweet Treatyys":"פינוק מתוק"},
    {"OutnetSoftwares_v_2.99.5.zipyys":"OutnetSoftwares_v_2.99.5.zip"},
    {"Search the Log of All Conversation and Knowledgeyys":"חפש ביומן כל השיחות והידע"},
    {"Search: sdsyys":"חיפוש: sds"},
    {"Onium - הזרק תמיכה עברית לשולחן עבודה רפויyys":"אוניום - הזרק תמיכה עברית לשולחן עבודה רפוי"},
    {"Notifications paused until 8:00 AMyys":"התראות הושהו עד 8:00 בבוקר"},
    {"yonatanyys":"יונתן"},
    {",yys":","},
    {"Notify every online member in this channel.yys":"הודע לכל חבר מקוון בערוץ זה."},
    {"Jun 15thyys":"15 ביוני"},
    {"Edit your profileyys":"ערוך את הפרופיל שלך"},
    {"Shift + Returnyys":"Shift Return"},
    {"Monday, June 29thyys":"יום שני, 29 ביוני"},
    {"Friday, July 17thyys":"יום שישי, 17 ביולי"},
    {"Start typing a message anywhere, then find it here. Re-read, revise, and send whenever you’d like.yys":"התחל להקליד הודעה בכל מקום ואז מצא אותה כאן. קרא מחדש, תעדכן ושליח בכל עת שתרצה."},
    {"Set a time limityys":"קבעו מגבלת זמן"},
    {"Remove from channelyys":"הסר מהערוץ"},
    {"52 repliesyys":"52 תשובות"},
    {"DSDyys":"DSD"},
    {"Jun 17th at 1:29 PMyys":"17 ביוני בשעה 13:29"},
    {"Set time zone automaticallyyys":"הגדר אוטומטית את אזור הזמן"},
    {"Backyys":"חזור"},
    {"Create a spreadsheetyys":"צור גיליון אלקטרוני"},
    {"joined #וידיאוף.yys":"הצטרף"},
    {"Statusyys":"סטָטוּס"},
    {"6:46 AMyys":"6:46 בבוקר"},
    {"Share this channel with people from other companies or teams, and work together right in Slack.yys":"שתפו את הערוץ הזה עם אנשים מחברות או צוותים אחרים ועבדו יחד ממש בסלאק."},
    {"Create a standupyys":"צור סטנדאפ"},
    {"JUMBOMOJIyys":"JUMBOMOJI"},
    {"All typesyys":"כל הסוגים"},
    {"Yesterday at 11:33 AMyys":"אתמול בשעה 11:33"},
    {"2:18 AMyys":"02:18"},
    {"jkj '' 'yys":"jkj '' '"},
    {"eyalyys":"אייל"},
    {"1:04 AMyys":"01:04"},
    {"36 membersyys":"36 חברים"},
    {"Search: hellyys":"חיפוש: לעזאזל"},
    {"2:30 AMyys":"2:30 לפנות בוקר"},
    {"oneyys":"אחד"},
    {"Add channelsyys":"הוסף ערוצים"},
    {"2:56 PMyys":"14:56"},
    {"Saturday, June 20thyys":"שבת, 20 ביוני"},
    {"Just display namesyys":"פשוט להציג שמות"},
    {"Edit your last messageyys":"ערוך את ההודעה האחרונה שלך"},
    {"Fryys":"Fr"},
    {"Share a channelyys":"שתף ערוץ"},
    {"APKyys":"APK"},
    {" or yys":"אוֹ"},
    {"יוסף אלישיבyys":"יוסף אלישיב"},
    {"Gmail, Outlook, Facebook, Twitter — Shared Inbox in Slackyys":"Gmail, Outlook, Facebook, Twitter - תיבת הדואר הנכנס המשותפת ברפיון"},
    {"We’re always working to make Slack better, and we’d love your thoughts.yys":"אנחנו תמיד עובדים כדי לשפר את Slack, ואנחנו נשמח את המחשבות שלך."},
    {"Jun 17th at 10:36 AMyys":"17 ביוני בשעה 10:36"},
    {"7:42 AMyys":"7:42 בבוקר"},
    {"11:06 PMyys":"23:06"},
    {"Date sharedyys":"תאריך משותף"},
    {"Serial Number: C02MK2FBFLCFyys":"מספר סידורי: C02MK2FBFLCF"},
    {"Thursday, August 6thyys":"יום חמישי, 6 באוגוסט"},
    {"Organizationsyys":"ארגונים"},
    {"Newestyys":"החדש ביותר"},
    {"once every 15 minutesyys":"אחת לרבע שעה"},
    {"You’re set to active.yys":"אתה מוגדר לפעיל ."},
    {"Protanopia & Deuteranopiayys":"פרוטנופיה"},
    {"Show conversation detailsyys":"הצג פרטי שיחה"},
    {"9:12 AMyys":"9:12 בבוקר"},
    {"Membersyys":"חברים"},
    {"Set myself a reminderyys":"קבע לעצמי תזכורת"},
    {"Sort all conversations…yys":"מיין את כל השיחות ..."},
    {"from:yys":"מ:"},
    {"10:31 AMyys":"10:31"},
    {"Nicely doneyys":"נעשה באופן יפה"},
    {"Save Changesyys":"שמור שינויים"},
    {"3:25 PMyys":"3:25 אחר הצהריים"},
    {"jkjkjyys":"jkjkj"},
    {"1:50 AMyys":"01:50"},
    {"Ownersyys":"בעלי"},
    {"Search: akyys":"חיפוש: ak"},
    {"Other optionsyys":"אפשרויות אחרות"},
    {"7 messagesyys":"7 הודעות"},
    {"Last reply 2 months agoyys":"תשובה אחרונה לפני חודשיים"},
    {"23 days agoyys":"לפני 23 יום"},
    {" starts a Slack searchyys":"מתחיל חיפוש ברפיון"},
    {"Tuesday, July 14thyys":"יום שלישי, 14 ביולי"},
    {"כל ההודעות הישירות שלךyys":"כל ההודעות הישירות שלך"},
    {":slightly_smiling_face:yys":": מעט_מילינג_משטח:"},
    {" to send)yys":"לשלוח)"},
    {"Removeyys":"לְהַסִיר"},
    {"No items have been pinned yet! Open the context menu on important messages or files and choose yys":"עדיין לא הוצמדו פריטים! פתח את תפריט ההקשר על הודעות או קבצים חשובים ובחר"},
    {"12:43 AMyys":"12:43"},
    {" key.yys":"מַפְתֵחַ."},
    {"דַכָהyys":"דַכָה"},
    {" to make your invites more personal.yys":"כדי להפוך את ההזמנות שלך לאישיות יותר."},
    {"Tipyys":"עֵצָה"},
    {"Full nameyys":"שם מלא"},
    {"Pinnedyys":"מוצמד"},
    {"The text formatting toolbar won’t show in the composer.yys":"סרגל הכלים לעיצוב טקסט לא יופיע במלחין."},
    {"42 membersyys":"42 חברים"},
    {"Open in channelyys":"פתוח בערוץ"},
    {"10:26 AMyys":"10:26"},
    {"3:28 AMyys":"03:28"},
    {"Add reactionyys":"הוסף תגובה"},
    {"Add teammatesyys":"הוסף חברים לקבוצה"},
    {"renamed the channel from “מחסום” to “תוכנת-אאוטנט”yys":"שינה את שמו לערוץ מ\"מחלקת פרסום \"ל\"תוכנת-אאוטנט\""},
    {"Friday, July 3rdyys":"יום שישי, 3 ביולי"},
    {"Description:yys":"תיאור:"},
    {"חפש לפי שם, תפקיד או צוותyys":"חפש לפי שם, תפקיד או צוות"},
    {"שינוי גודל_IMG_0849.jpgyys":"שינוי גודל_ IMG_0849.jpg"},
    {"טען מחדש רפיוןyys":"טען מחדש רפיון"},
    {"AbdulRehmanyys":"עבדולרמן"},
    {"3:59 PMyys":"15:59"},
    {"teamyys":"קְבוּצָה"},
    {"Download Slack for free for mobile devices and desktop. Keep up with the conversation with our yys":"הורד את Slack בחינם למכשירים ניידים ושולחן עבודה. המשיכו עם השיחה עם שלנו"},
    {"Addyys":"לְהוֹסִיף"},
    {"Designyys":"לְעַצֵב"},
    {"edityys":"לַעֲרוֹך"},
    {"שינויyys":"שינוי"},
    {"עדכן את הסטטוס שלךyys":"עדכן את הסטטוס שלך"},
    {"Findyys":"למצוא"},
    {"Shortcutyys":"קיצור"},
    {" for your computer. (It’ll also give you extra control over your notifications.)yys":"למחשב שלך. (זה גם יעניק לך שליטה נוספת על ההתראות שלך.)"},
    {"Tuyys":"טו"},
    {"FullSizeRender.movyys":"FullSizeRender.mov"},
    {"Reply in threadyys":"השב בשרשור"},
    {"אל תפריע ל ...yys":"אל תפריע ל ..."},
    {"sdfyys":"sdf"},
    {"10yys":"10"},
    {"בצלאל המבורגרyys":"בצלאל המבורגר"},
    {"אֲנָשִׁיםyys":"אֲנָשִׁים"},
    {"Undoyys":"לבטל"},
    {"I'm looking for…yys":"אני מחפש…"},
    {"1:31 PMyys":"1:31 אחר הצהריים"},
    {"Importyys":"יְבוּא"},
    {"joined #וידיאוף along with yys":"הצטרף"},
    {"set the channel description: עזרה הדדית בנושאים שלא קשורים לאאוטנטyys":"קבע את תיאור הערוץ: עזרה הדדית בנושאים שלא קשורים לאאוטנט"},
    {"1:56 PMyys":"13:56"},
    {"וודא שתוכנת האבטחה שלך לא חוסמת את Slack.yys":"וודא שתוכנת האבטחה שלך לא חוסמת את הרפוי."},
    {" אפליקציות yys":"אפליקציות"},
    {"31 repliesyys":"31 תשובות"},
    {"Sunday, August 16thyys":"יום ראשון, 16 באוגוסט"},
    {"set the channel description: הכרזות מההנהלהyys":"קבע את תיאור הערוץ: הכרזות מההנהלה"},
    {"Search shortcutsyys":"קיצורי דרך לחיפוש"},
    {"Search because it’s faster than scrollingyys":"חפש מכיוון שזה מהיר יותר מאשר גלילה"},
    {"Wednesday, November 18thyys":"יום רביעי, 18 בנובמבר"},
    {"channelyys":"עָרוּץ"},
    {"29 repliesyys":"29 תשובות"},
    {"2:28 PMyys":"02:28"},
    {"Show yys":"הופעה"},
    {"4:31 AMyys":"04:31"},
    {"Loading history...yys":"טוען היסטוריה ..."},
    {"Start me at the newest message, and mark the channel readyys":"התחל אותי בהודעה החדשה ביותר וסמן את הערוץ כנקרא"},
    {"Tuesday, October 27thyys":"יום שלישי, 27 באוקטובר"},
    {"Keyboard layoutyys":"פריסת המקלדת"},
    {"Do Not Disturbyys":"אל תפריע"},
    {"Unread channels onlyyys":"ערוצים שלא נקראו בלבד"},
    {"התראות הושהו עד 8:00 בבוקרyys":"הודעה הושהו עד 8:00 בבוקר"},
    {"For questions, assistance, and resources on a topicyys":"לשאלות, סיוע ומשאבים בנושא"},
    {"Play a sound when receiving a notificationyys":"הפעל צליל בעת קבלת הודעה"},
    {"4:05 AMyys":"04:05 לפנות בוקר"},
    {"You look nice tonight.yys":"אתה נראה נחמד הלילה."},
    {"Sidebaryys":"סרגל צד"},
    {"Loading…yys":"טעינה…"},
    {"dsf 'yys":"dsf '"},
    {"(window.webpackJsonp=window.webpackJsonp||[]).push([[12],[]])yys":"(windows.webpackJsonp = windows.webpackJsonp || []). לדחוף ([[12], []])"},
    {"More options for #ניתוק-פיזיyys":"אפשרויות נוספות עבור"},
    {"Mark as Readyys":"סמן כנקרא"},
    {"חפש לפי שם או קטגוריה (למשל פריון, מכירות)yys":"חפש לפי שם או קטגוריה (למשל פריון, מכירות)"},
    {" by hitting the yys":"על ידי מכה ב-"},
    {"Jul 2nd at 7:50 AMyys":"2 ביולי בשעה 7:50 בבוקר"},
    {"2:10 PMyys":"14:10"},
    {" to dismissyys":"לבטל"},
    {"Ctrlyys":"Ctrl"},
    {"Otheryys":"אַחֵר"},
    {"Start me where I left off, and mark the channel readyys":"התחל אותי איפה שהפסקתי וסמן את הערוץ כנקרא"},
    {"Monday, June 8thyys":"יום שני 8 ביוני"},
    {"jkj'''yys":"jkj '' '"},
    {"10:00 אחר הצהרייםyys":"10:00 אחר הצהריים"},
    {"Search: asfyys":"חיפוש: ASF"},
    {"When I'm not active on desktop ...yys":"כשאני לא פעיל בשולחן העבודה ..."},
    {"Italicyys":"נטוי"},
    {"משה פרסyys":"משה פרס"},
    {" + yys":""},
    {"You might want to try using different keywords, checking for typos or adjusting your filters.yys":"יתכן שתרצה לנסות להשתמש במילות מפתח שונות, לבדוק אם יש לך שגיאות הקלדה או להתאים את המסננים שלך."},
    {"reacted with :gun:yys":"הגיב עם: אקדח:"},
    {"החדש ביותרyys":"החדש ביותר"},
    {"testyys":"מִבְחָן"},
    {"3:27 PMyys":"3:27 אחר הצהריים"},
    {"11:23 PMyys":"23:23"},
    {"When I view a channel:yys":"כשאני צופה בערוץ:"},
    {"אבי רוזנבלטyys":"אבי רוזנבלט"},
    {"Daily stand-ups & check-insyys":"סטנדאפים יומיים"},
    {"Mark everything as readyys":"סמן הכל כנקרא"},
    {"Enteryys":"להיכנס"},
    {"Moreyys":"יותר"},
    {"Search: dsfyys":"חיפוש: dsf"},
    {"Invite to channelyys":"הזמינו לערוץ"},
    {"Custom…yys":"המותאם אישית…"},
    {"Added to yys":"נוסף ל"},
    {"Inline media & linksyys":"מדיה מוטבעת"},
    {"Add a topicyys":"הוסף נושא"},
    {"Saturday, June 27thyys":"שבת, 27 ביוני"},
    {"Profileyys":"פּרוֹפִיל"},
    {" in the empty message field to:yys":"בשדה ההודעות הריק ל:"},
    {"Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.yys":"ערוצים הם המקום בו הצוות שלך מתקשר. הם הטובים ביותר כאשר הם מסודרים סביב נושא -"},
    {"37 membersyys":"37 חברים"},
    {"More message shortcuts…yys":"קיצורי דרך נוספים להודעות ..."},
    {"Unfollow threadyys":"בטל את ההפתעה"},
    {"When joining a Slack call…yys":"כשמצטרפים לשיחה רפה ..."},
    {"You'll only receive notifications in the hours you choose. Outside of those times, notifications will be paused. yys":"תקבל התראות רק בשעות שתבחר. מחוץ לזמנים ההודעות יושהו."},
    {"Full membersyys":"חברים מלאים"},
    {" channels.yys":"ערוצים."},
    {"Today at 10:32:15 PMyys":"היום בשעה 10:32:15 אחר הצהריים"},
    {"Copy channel nameyys":"העתק את שם הערוץ"},
    {"https://outnethelp.slack.com/archives/C014RFYPC6N/p1591184842001800yys":"https://outnethelp.slack.com/archives/C014RFYPC6N/p1591184842001800"},
    {"3 months agoyys":"לפני 3 חודשים"},
    {"PyPIyys":"PyPI"},
    {"Jun 25thyys":"25 ביוני"},
    {" channel.yys":"עָרוּץ."},
    {"1 day agoyys":"לפני יום אחד"},
    {"יוסף חיים סיתהוןyys":"יוסף חיים סיתהון"},
    {"download the desktop yys":"הורד את שולחן העבודה"},
    {" yys":""},
    {"5:13 AMyys":"05:13"},
    {"New yys":"חָדָשׁ"},
    {"1:32 PMyys":"13:32"},
    {"Sunday, July 26thyys":"יום ראשון 26 ביולי"},
    {"Last reply 24 days agoyys":"תשובה אחרונה לפני 24 יום"},
    {"22yys":"22"},
    {"Search: אפליקציהappyys":"חיפוש: אפליקציית אפליקציה"},
    {"Search: saffyys":"חיפוש: saff"},
    {"13yys":"13"},
    {"9:16 AMyys":"9:16 בבוקר"},
    {"2:36 AMyys":"02:36"},
    {"Open the Slack Appyys":"פתח את האפליקציה Slack"},
    {"https://outnethelp.slack.com/files/URHCZGBFU/F017BA0CDNC/image__1_.pngyys":"https://outnethelp.slack.com/files/URHCZGBFU/F017BA0CDNC/image__1_.png"},
    {"ערוך / הוסףyys":"ערוך / הוסף"},
    {"Sort: A to Zyys":"מיין: א 'עד ת'"},
    {"To start new conversations from Slack, you must first yys":"כדי להתחיל שיחות חדשות מ- Slack, עליך קודם"},
    {"2 messages marked readyys":"2 הודעות שסומנו כנקראו"},
    {"Last reply 4 months agoyys":"תשובה אחרונה לפני 4 חודשים"},
    {"Allow animated images and emojiyys":"אפשר תמונות אנימציה ואמוג'י"},
    {"@ מגyys":"@ מג"},
    {"Sign out of אאוטנטyys":"צא מאאוטנט"},
    {"Thursday, September 3rdyys":"יום חמישי, 3 בספטמבר"},
    {"Wednesday, September 9thyys":"יום רביעי, 9 בספטמבר"},
    {"2 draftsyys":"2 טיוטות"},
    {"21 repliesyys":"21 תשובות"},
    {"reacted with :+1:yys":"הגיב עם: 1:"},
    {"a channel or direct messageyys":"ערוץ או הודעה ישירה"},
    {"Invite people to אאוטנט…yys":"הזמן אנשים לאאוטנט ..."},
    {"For some reason, Slack couldn't load 😓yys":"מסיבה כלשהי, Slack לא יכול היה לטעון 😓"},
    {"Send the messageyys":"שלח את ההודעה"},
    {"פָּעִילyys":"פָּעִיל"},
    {"Do not disturb for…yys":"אל תפריע ל ..."},
    {"Threads you’re involved in will be collected right here.yys":"האשכולות שאתה מעורב בהם ייאספו כאן."},
    {"avimalyys":"אבימלי"},
    {"5:40 PMyys":"17:40"},
    {"1 draftyys":"טיוטה אחת"},
    {"Search: ;;yys":"לחפש: ;;"},
    {"Start a callyys":"התחל שיחה"},
    {"You’re digging in the right placeyys":"אתם חופרים במקום הנכון"},
    {"enable desktop notificationsyys":"הפעל התראות בשולחן העבודה"},
    {"Note: press yys":"הערה: לחץ"},
    {"Jun 10th at 3:58:56 PMyys":"10 ביוני בשעה 15:58:56"},
    {"More options for #אנדרואידyys":"אפשרויות נוספות עבור"},
    {"בחר כיצד ההתראות נראות, נשמעות ומתנהגות.yys":"בחר כיצד ההתראות נראות, נשמע ומתבצע."},
    {"לעלות קובץyys":"לעלות קובץ"},
    {"yyys":"y"},
    {"Make your first workflowyys":"הפוך את זרימת העבודה הראשונה שלך"},
    {"10:32 PMyys":"22:32"},
    {"קבעו מגבלת זמןyys":"קבעו מגבלת זמן"},
    {"1:39 PMyys":"13:39"},
    {"יניב חלהyys":"יניב חלה"},
    {"In 20 minutesyys":"תוך 20 דקות"},
    {"Customize אאוטנטyys":"התאם אישית אאוטנט"},
    {"הגדר סטטוסyys":"הגדר סטטוס"},
    {"Tuesday, October 6thyys":"יום שלישי, 6 באוקטובר"},
    {"עֶזרָהyys":"עֶזרָה"},
    {" to sendyys":"לשלוח"},
    {"10 days agoyys":"לפני 10 ימים"},
    {"2yys":"2"},
    {"Desktop notifications are currently disabledyys":"התראות שולחן עבודה מושבתות כרגע"},
    {"(השבת זאת לפרטיות נוספת)yys":"(השבת זאת לפרטיות נוספת)"},
    {"vbn500yys":"vbn500"},
    {"5:37 PMyys":"17:37"},
    {"Search: assfyys":"חיפוש: assf"},
    {"Show formattingyys":"הצג עיצוב"},
    {"Monday, June 22ndyys":"יום שני, 22 ביוני"},
    {"\" in אאוטנטyys":"באאוטנט"},
    {"1:15 PMyys":"13:15 אחר הצהריים"},
    {"Fyys":"ו"},
    {"Jul 20th at 7:35 AMyys":"20 ביולי בשעה 7:35 בבוקר"},
    {"10:44 AMyys":"10:44"},
    {"1 שעהyys":"1 שעה"},
    {"Last reply 8 hours agoyys":"תשובה אחרונה לפני 8 שעות"},
    {"Search for messages, replies, or even insightful asidesyys":"חפש הודעות, תשובות או אפילו צדדי תובנות"},
    {"More…yys":"יותר…"},
    {"reacted with :outnet:yys":"הגיב עם: outnet:"},
    {"1:37 PMyys":"1:37 אחר הצהריים"},
    {"Edit draftyys":"ערוך טיוטה"},
    {"Create a postyys":"צור פוסט"},
    {"7yys":"ז"},
    {"Monday, November 9thyys":"יום שני 9 בנובמבר"},
    {"More options for #יעוץyys":"אפשרויות נוספות עבור"},
    {"80yys":"80"},
    {"לגבי ADB אכן התכנה מטפלת בזה. רק כתבת yys":"לגבי ADB אכן התוכנה מטפלת בזה. רק כתבת"},
    {"1:42 AMyys":"01:42"},
    {"Thursday, March 5thyys":"יום חמישי, 5 במרץ"},
    {"Jun 30thyys":"30 ביוני"},
    {" to yys":"ל"},
    {"‏‏eru_com.ifit.eru - עותק.ZIPyys":"Eru_com.ifit.eru - עותק. ZIP"},
    {"Search: sayys":"חיפוש: sa"},
    {"In 3 hoursyys":"בעוד 3 שעות"},
    {"Instantly translate text into different languages.yys":"תרגם טקסט באופן מיידי לשפות שונות."},
    {"joined #קודים.yys":"הצטרף"},
    {"יואל פולקוביץyys":"יואל פולקוביץ"},
    {"Changeyys":"שינוי"},
    {"1:10 AMyys":"01:10"},
    {"Allyys":"את כל"},
    {"Tuesday, August 4thyys":"יום שלישי, 4 באוגוסט"},
    {"אשכולותyys":"אשכולות"},
    {"Channelsyys":"ערוצים"},
    {"1:06 PMyys":"13:06"},
    {"הרחק את עצמךyys":"הרחק את עצמך"},
    {"sdf בליyys":"sdf בלי"},
    {"Saveyys":"לשמור"},
    {"Wednesday, July 1styys":"יום רביעי, 1 ביולי"},
    {"Available Appsyys":"אפליקציות זמינות"},
    {"Wednesday, August 19thyys":"יום רביעי, 19 באוגוסט"},
    {"Bright and cheerfulyys":"מואר ועליז"},
    {"See All 36 Membersyys":"ראה את כל 36 החברים"},
    {"Most membersyys":"רוב החברים"},
    {"Move to main pageyys":"עבור לדף הראשי"},
    {"8:33 AMyys":"8:33 בבוקר"},
    {"3:22 AMyys":"03:22"},
    {"אבינועם הולצרyys":"אבינועם הולצר"},
    {"Make privateyys":"להפוך לפרטי"},
    {"קנון EOS M100 כרטיס וייפי נמצא בצד של המצלמה ואין צורך לפרק המצלמהyys":"קנון EOS M100 כרטיס וייפי נמצא בצד של המצלמה בלי צורך לפרק המצלמה"},
    {"תוריד לנו שורהyys":"תוריד לנו מא"},
    {"זמן מקומיyys":"זמן מקומי"},
    {"Create a code or text snippetyys":"צור קוד או קטע טקסט"},
    {"Sunday, July 5thyys":"ראשון, 5 ביולי"},
    {"ינון אהרוניyys":"ינון אהרוני"},
    {"8:07 AMyys":"8:07 בבוקר"},
    {"2 days agoyys":"לפני יומיים"},
    {"3:02 PMyys":"15:02"},
    {"34 filesyys":"34 קבצים"},
    {"Move focus to the message listyys":"העבר מיקוד לרשימת ההודעות"},
    {"3:24 PMyys":"3:24 אחר הצהריים"},
    {"Send notifications to my mobile devices:yys":"שלח התראות למכשירים הניידים שלי:"},
    {"Altyys":"אלט"},
    {"Send Invitationsyys":"לשלוח הזמנות"},
    {"Mentions of your name, along with any of your notification keywords, will always be shown on this screen. You can also choose to show...yys":"אזכורים של שמך, יחד עם אחת ממילות המפתח שלך להודעות, יוצגו תמיד במסך זה. אתה יכול גם לבחור להציג ..."},
    {"Thursday, August 27thyys":"יום חמישי, 27 באוגוסט"},
    {"Customer Support & Communicationyys":"שירות לקוחות"},
    {"הרחק אתyys":"הרחק את"},
    {"Thursday, June 4thyys":"יום חמישי, 4 ביוני"},
    {"Jun 2nd at 2:18:06 PMyys":"2 ביוני בשעה 2:18:06"},
    {"Wednesday, September 2ndyys":"יום רביעי, 2 בספטמבר"},
    {"Sort: Newestyys":"מיין: הכי חדש"},
    {" should not send the message.yys":"לא אמור לשלוח את ההודעה."},
    {"מה הסיבה שלא מנתקים גיימבוי NIDENDO?yys":"מה הסיבה שלא מנתקים גיימבוי NIDENDO?"},
    {" by pressing yys":"על ידי לחיצה"},
    {"Filter your searchyys":"סנן את החיפוש שלך"},
    {"11:52 AMyys":"11:52"},
    {"לחץ על מחק כדי להסיר הודעות מאפליקציה מהסרגל הצדyys":"לחץ על מחק כדי לכתוב הודעות מאפליקציה מהסרגל לצד"},
    {"Search for files, facts, figures, and statsyys":"חפש קבצים, עובדות, נתונים ונתונים סטטיסטיים"},
    {"Sunday, October 25thyys":"יום ראשון, 25 באוקטובר"},
    {"34 קבציםyys":"34 קבצים"},
    {"English (US)yys":"אנגלית ארה\"ב)"},
    {" person to this workspace.yys":"אדם לסביבת עבודה זו."},
    {"Search for comments, asides, eurekas, and moreyys":"חפש הערות, צדדים, אירופיות ועוד"},
    {"Message Avinoam Holzeryys":"הודעה אבינועם הולצר"},
    {"Friday, August 14thyys":"יום שישי, 14 באוגוסט"},
    {"Display color swatches next to hexadecimal valuesyys":"הצגת דוגמיות צבע לצד ערכים הקסדצימליים"},
    {"See new activity in real timeyys":"צפו בפעילות חדשה בזמן אמת"},
    {"appsyys":"אפליקציות"},
    {"מִתקַדֵםyys":"מִתקַדֵם"},
    {"Namesyys":"שמות"},
    {"Poll, vote and decide in Slack channelsyys":"סקר, הצבע והחליט בערוצי Slack"},
    {"24yys":"24"},
    {"1:06 AMyys":"01:06"},
    {"1:14 PMyys":"13:14"},
    {"סקר פשוטyys":"סקר פשוט"},
    {"Leave channelyys":"עזוב את הערוץ"},
    {"outnethelp.slack.comyys":"outnethelp.slack.com"},
    {"4 days agoyys":"לפני 4 ימים"},
    {", along with yys":", ביחד עם"},
    {"Alt yys":"אלט"},
    {"Bananayys":"בננה"},
    {"Create a channelyys":"צור ערוץ"},
    {"View full profileyys":"צפה בפרופיל המלא"},
    {"Tips for getting startedyys":"טיפים לתחילת העבודה"},
    {"Last reply 10 days agoyys":"תשובה אחרונה לפני 10 ימים"},
    {"הזמינו לימוץyys":"הזמינו לימוץ"},
    {"Eyys":"ה"},
    {"6:31 AMyys":"6:31 בבוקר"},
    {"מנתק איזוריyys":"מנתק איזורי"},
    {"askjyys":"askj"},
    {"Monday, December 7thyys":"יום שני, 7 בדצמבר"},
    {"הזמן אורחים עם ערוץ יחידyys":"הזמן אורחים עם ערוץ יחיד"},
    {"80 characters remainingyys":"נותרו 80 תווים"},
    {"anyone on Slackyys":"כל מי שמרפה"},
    {"11:06 AMyys":"11:06"},
    {"4:09 AMyys":"04:09"},
    {"2:02 AMyys":"02:02"},
    {"Create sidebar sectionyys":"צור קטע סרגל צידי"},
    {"App Directoryyys":"מדריך היישומים"},
    {"asdyys":"asd"},
    {" that lets people easily submit requests to your channel.yys":"המאפשרת לאנשים להגיש בקשות בקלות לערוץ שלך."},
    {"Show images and files from linked websitesyys":"הצג תמונות וקבצים מאתרים מקושרים"},
    {"Jul 12th at 10:44 AMyys":"12 ביולי בשעה 10:44 בבוקר"},
    {"5:56 AMyys":"5:56 בבוקר"},
    {"Homeyys":"בית"},
    {"ינון אהרוני, יוסף חיים אלגרבלי, אבי רוזנבלט, אליעזר רייטן, משה אהרוני, יצחק ביטראן, דניאל פוחוביץ, יעקב מרדכי קריזר, יהושע יוסוביץ, נח ציטרנבוים, יואל פולקוביץ, אייל שועבי, אבינעם הולצר, שניר סרוסי, AbdulRehman, רבקה כהן, יהודה חבה, עקיבא שטרן, יהושע גוטסמן, נחמן בוים, שי גור, and שמואל ליכטנשטייןyys":"ינון אהרוני, יוסף חיים אלגרבלי, אבי רוזנבלט, אליעזר רוד, משה אהרוני, יצחק ביטראן, דניאל פוחוביץ, יעקב מרדכי קריזר, יהושע יוסוביץ, נח ציטרנבוים, יואל פולקוביץ, אייל שועבי, אבינעם הולצר, שניר סרוסי, עבודולע יהודה חבה, עקיבא שטרן, יהושע גוטסמן, נחמן בוים, שי גור ושמואל ליכטנשטיין"},
    {"שם: (לא חובה)yys":"שם: (לא חובה)"},
    {"View profileyys":"צפה בפרופיל"},
    {"Feeling great!yys":"הרגשה נהדרת!"},
    {"הצג חשבונות שבוטלוyys":"הצג חשבונות שבוטלו"},
    {"SDKyys":"SDK"},
    {"App typeyys":"סוג אפליקציה"},
    {"לyys":"ל"},
    {"משה אהרוניyys":"משה אהרוני"},
    {"קבציםyys":"קבצים"},
    {"Bring emails into Slackyys":"הכניס מיילים לסל"},
    {"Cancelyys":"לְבַטֵל"},
    {"Yesterday at 2:37 PMyys":"אתמול בשעה 2:37 אחר הצהריים"},
    {"Get more apps with shortcuts yys":"קבל יישומים נוספים עם קיצורי דרך "},
    {"Threadyys":"פְּתִיל"},
    {"IMG_20200617_230318 [1] .jpgyys":"IMG_20200617_230318 [1] .jpg"},
    {"5:58 AMyys":"05:58"},
    {"2:08 AMyys":"02:08"},
    {"5:35 AMyys":"05:35"},
    {"You may want to try using different keywords, checking for typos, or adjusting your filters.yys":"יתכן שתרצה לנסות להשתמש במילות מפתח שונות, לבדוק אם יש לך שגיאות הקלדה או להתאים את המסננים שלך."},
    {"1 minute agoyys":"לפני 1 דקה"},
    {"2:24 PMyys":"02:24"},
    {"Single-Channel Guestsyys":"אורחים חד-ערוציים"},
    {"Edit/addyys":"ערוך / הוסף"},
    {"2:06 AMyys":"02:06"},
    {"Send me email notifications for mentions and direct messagesyys":"שלחו לי התראות דוא\"ל על אזכורים והודעות ישירות"},
    {"10:18 PMyys":"22:18"},
    {"אפשר התראות:yys":"אפשר להתכתב:"},
    {"28 days agoyys":"לפני 28 יום"},
    {"כלול תצוגה מקדימה של ההודעה בכל הודעהyys":"כלול תצוגה מקדימה של ההודעה בכל הודעה"},
    {"Saved 11 minutes agoyys":"נשמר לפני 11 דקות"},
    {"לא נקראו הודעות ישירות בלבדyys":"לא נקראו הודעות ישירות בלבד"},
    {"Jun 14thyys":"14 ביוני"},
    {"All direct messagesyys":"כל ההודעות הישירות"},
    {"כתובת דוא\"לyys":"כתובת דוא"},
    {"17 repliesyys":"17 תשובות"},
    {"All unreadsyys":"הכל לא נקרא"},
    {"December 18th, 2019yys":"18 בדצמבר, 2019"},
    {"List private channels separatelyyys":"ציין ערוצים פרטיים בנפרד"},
    {"Edit sidebaryys":"ערוך את סרגל הצד"},
    {"Search: asfdyys":"חיפוש: asfd"},
    {"Jul 7thyys":"7 ביולי"},
    {"Request invitationsyys":"בקש הזמנות"},
    {"חזורyys":"חזור"},
    {"We're quite sorry about this! Before you try to troubleshoot, please do check yys":"אנו מצטערים על זה! לפני שתנסה לפתור בעיות, אנא בדוק"},
    {"Delete Draftyys":"מחק טיוטה"},
    {"עזרא שרים, יוסף אלישיב, שמואל כהן, Yossi Zahn, אברהם ישעיהו זריצקי, יניב חלה, רחל דרבקין, משרד ראשי, אליעד שמעון, משה פרעס, בצלאל המבורגר, יוסף חיים סיתהון, בצלאל מדר, יואל רוטמן, יונתן אסרף, and נחמן האסyys":"עזרא שרים, יוסף אלישיב, שמואל כהן, יוסי זאן, אברהם ישעיהו זריצקי, יניב חלה, רחל דרבקין, משרד ראשי, אליעד שמעון, משה פרס, בצלאל המבורגר, יוסף חיים סיתהון, בצלאל מדר, יואל רוטמן, יונתן אסרף, ונחמן האסס"},
    {"9:06 PMyys":"21:06"},
    {"Low Priorityyys":"עדיפות נמוכה"},
    {"2 months agoyys":"לפני 2 חודשים"},
    {"Display nameyys":"הצג שם"},
    {"CMYKyys":"CMYK"},
    {"לוחצים על Channelsyys":"לוחצים על ערוצים"},
    {"joined #עזרה_הדדית.yys":"הצטרף"},
    {"9:01 AMyys":"9:01 בבוקר"},
    {"Show moreyys":"להראות יותר"},
    {"(you)yys":"(אתה)"},
    {"Time zoneyys":"אזור זמן"},
    {"A quick way to send infoyys":"דרך מהירה לשלוח מידע"},
    {"Search: asddsdyys":"חיפוש: asddsd"},
    {"Wednesday, October 28thyys":"יום רביעי 28 באוקטובר"},
    {"Search: askjyys":"חיפוש: askj"},
    {"Edit profileyys":"ערוך פרופיל"},
    {"add many at onceyys":"הוסף רבים בבת אחת"},
    {"Monday, July 20thyys":"יום שני, 20 ביולי"},
    {"Saved 2 minutes agoyys":"נשמר לפני 2 דקות"},
    {"Send me occasional surveys via Slackbotyys":"שלח לי מדי פעם סקרים דרך Slackbot"},
    {"Posted in #כלליyys":"פורסם ב"},
    {"Input search. Beep boop.yys":"חיפוש קלט. ביפ בופ."},
    {" yys":" "},
    {"5 messagesyys":"5 הודעות"},
    {"חָדָשׁyys":"חָדָשׁ"},
    {"Newest channelyys":"הערוץ החדש ביותר"},
    {"To:yys":"ל:"},
    {", yys":","},
    {"11:21 PMyys":"23:21"},
    {"החברים הכי מעטיםyys":"החברים הכי מעטים"},
    {"Search: asfffsyys":"חיפוש: אספים"},
    {"דַמקָהyys":"דַכָה"},
    {"Direct messagesyys":"הודעות ישירות"},
    {" to send.yys":"לשלוח."},
    {"11:30 PMyys":"11:30 בלילה"},
    {"Sidebar sectionsyys":"קטעי סרגל צידי"},
    {"Dateyys":"תַאֲרִיך"},
    {"Loading apps...yys":"טוען אפליקציות ..."},
    {"Jul 10th at 3:54 AMyys":"10 ביולי בשעה 3:54 לפנות בוקר"},
    {"Open a direct messageyys":"פתח הודעה ישירה"},
    {"א עד תyys":"א עד ת"},
    {"10:00 PMyys":"10:00 אחר הצהריים"},
    {"Invite Multi-Channel Guestsyys":"הזמן אורחים רב ערוציים"},
    {"1:49 AMyys":"01:49"},
    {"תַאֲרִיךyys":"תַאֲרִיך"},
    {"Get feedback with pollsyys":"קבל משוב עם סקרים"},
    {"Learn more about guestsyys":"למידע נוסף על אורחים"},
    {"Jun 22ndyys":"22 ביוני"},
    {"9:25 AMyys":"9:25 בבוקר"},
    {"Create Workflowyys":"צור זרימת עבודה"},
    {"Tuesday, June 16thyys":"יום שלישי ה- 16 ביוני"},
    {" and yys":"ו"},
    {"לחץ על Ctrl Shift K כדי למצוא או לקרוא הודעה ישירה. לחץ על מחק כדי לכתוב הודעה ישירה מהסרגל לצדyys":"לחץ על Ctrl Shift K כדי למצוא או לקרוא הודעה ישירה. לחץ על מחק כדי לכתוב הודעה ישירה מהסרגל עמוד"},
    {"Workspace settingsyys":"הגדרות סביבת עבודה"},
    {"workflow ideasyys":"רעיונות לזרימת עבודה"},
    {" keys always scroll messagesyys":"מקשים תמיד גוללים הודעות"},
    {"For collaboration on and discussion about a projectyys":"לשיתוף פעולה ודיון על פרויקט"},
    {"Adjust timeyys":"התאם את הזמן"},
    {"@Megyys":"@ מג"},
    {"Your workspace is currently on Slack's Standard Plan. Learn moreyys":"סביבת העבודה שלך נמצאת כרגע בתכנית הסטנדרטית של Slack. למד עוד"},
    {"Share Channelyys":"שתף ערוץ"},
    {"Show times with 24-hour clockyys":"הצג שעות עם שעון 24 שעות"},
    {"Emojiyys":"אמוג'י"},
    {"Oct 5th, 2019yys":"5 באוקטובר, 2019"},
    {"Saved 22 minutes agoyys":"נשמר לפני 22 דקות"},
    {"Filesyys":"קבצים"},
    {"אייל שועביyys":"אייל שועבי"},
    {" to edit your last message, with either option.yys":"כדי לערוך את ההודעה האחרונה שלך, עם אחת מהאפשרויות."},
    {"joined #קודים along with yys":"הצטרף"},
    {"Frequently Usedyys":"לעיתים קרובות בשימוש"},
    {"jkjyys":"jkj"},
    {"Thyys":"ת "},
    {"Search: qsdyys":"חיפוש: qsd"},
    {" Hi, I'm yys":"היי אני"},
    {"Monday, June 15thyys":"יום שני ה- 15 ביוני"},
    {"Sunday, August 2ndyys":"יום ראשון, 2 באוגוסט"},
    {"The very beginningyys":"ההתחלה"},
    {"4:42 AMyys":"04:42"},
    {":handshaking:yys":": לחיצת יד:"},
    {"הודעותyys":"הודעות"},
    {"Organize and group your conversations.yys":"ארגן וקבץ את השיחות שלך."},
    {"Choose the language you’d like to use with Slack.yys":"בחר את השפה בה תרצה להשתמש עם Slack."},
    {"3:07 PMyys":"15:07"},
    {"12:16 AMyys":"12:16"},
    {"Sunday, June 14thyys":"ראשון, 14 ביוני"},
    {"מה חדשyys":"מה חדש"},
    {"Notify everyone in this channel.yys":"הודע לכולם בערוץ זה."},
    {"אפשרויות נוספותyys":"אפשרות נוספת"},
    {"Dec 2nd at 11:35 PMyys":"2 בדצמבר בשעה 23:35"},
    {"Monday, July 13thyys":"יום שני, 13 ביולי"},
    {"Jul 1st at 5:40:57 PMyys":"1 ביולי בשעה 05:40:57"},
    {"Mute my microphoneyys":"השתק את המיקרופון שלי"},
    {"25 repliesyys":"25 תשובות"},
    {"Start a Hot Takeyys":"התחל טייק חם"},
    {"Completedyys":"הושלם"},
    {"Only visible to youyys":"גלוי רק לך"},
    {"2:49 PMyys":"02:49"},
    {"3:47 AMyys":"03:47"},
    {"42yys":"42"},
    {"Invite peopleyys":"להזמין אנשים"},
    {"חבריםyys":"חברים"},
    {"שפהyys":"שפה"},
    {"Choose how notifications look, sound, and behave.yys":"בחר כיצד ההתראות נראות, נשמעות ומתנהגות."},
    {"בדוק את מרכז העזרה שלנוyys":"בדוק את מרכז העזרה שלנו"},
    {"את נראית טוב היום.yys":"את נראית טוב היום."},
    {"פָּעִילyys":"פָּעִיל"},
    {"Slack Developer Toolsyys":"כלים למפתחים רפויים"},
    {"2:05 AMyys":"02:05 לפנות בוקר"},
    {"74+ messagesyys":"74 הודעות"},
    {"Call אבי רוזנבלטyys":"התקשר לאבי רוזנבלט"},
    {"11 othersyys":"11 אחרים"},
    {"Search אאוטנטyys":"חפש אאוטנט"},
    {"https://pypi.org/project/onium/yys":"https://pypi.org/project/onium/"},
    {"Copy Linkyys":"העתק קישור"},
    {"יצחק ביטראןyys":"יצחק ביטראן"},
    {"Search for something. Anything. You have the window open now anyway.yys":"חפש משהו. כל דבר. בכל מקרה יש לך חלון פתוח."},
    {"מספר סידורי: C02MK2FBFLCFyys":"מספר סידורי: C02MK2FBFLCF"},
    {"Format messages with markupyys":"פרמט הודעות באמצעות סימון"},
    {"Reply to threadyys":"תגובה לשרשור"},
    {"Jul 12th at 11:12:51 AMyys":"12 ביולי בשעה 11:12:51"},
    {"סמן כנקראyys":"סמן כנקרא"},
    {"Jun 18thyys":"18 ביוני"},
    {"0 resultsyys":"0 תוצאות"},
    {"12:04 PMyys":"12:04 אחר הצהריים"},
    {"השתק את כל הצלילים של Slackyys":"השתכנע"},
    {"Invite Membersyys":"הזמן חברים"},
    {"Gyys":"ז"},
    {"Send emails to channelyys":"שלח מיילים לערוץ"},
    {"Thursday, June 11thyys":"יום חמישי, 11 ביוני"},
    {"2:50 PMyys":"02:50"},
    {"שִׂיחָהyys":"שִׂיחָה"},
    {"השתמש בהגדרות שונות עבור המכשירים הניידים שליyys":"השתמש בהגדרות שונות עבור המכשירים הניידים שלי"},
    {"Notifications paused until tomorrow at 8:00 AMyys":"התראות הושהו עד מחר בשעה 8:00 בבוקר"},
    {"Name (A to Z)yys":"שם (א 'עד ת')"},
    {"Cleanyys":"לְנַקוֹת"},
    {"Search for whatever; let’s find it togetheryys":"חפש כל מה; בואו נמצא את זה ביחד"},
    {"6:41 AMyys":"6:41 בבוקר"},
    {"Make sure your security software isn't blocking Slack.yys":"וודא שתוכנת האבטחה שלך לא חוסמת את Slack."},
    {"10:11 AMyys":"10:11"},
    {"4:41 AMyys":"04:41"},
    {"replied to a thread:yys":"השיב לשרשור:"},
    {"Customize the look of your workspace. Feeling adventurous? yys":"התאם אישית את מראה סביבת העבודה שלך. מרגיש הרפתקני?"},
    {"הודע לי על תשובות לנושאים שאני עוקב אחריוyys":"הודע לי על תשובות לנושאים שאני עוקב אחריו"},
    {"Keyboardyys":"מקלדת"},
    {"Mark all as readyys":"סמן הכל כנקרא"},
    {"Jun 29th at 10:21 AMyys":"29 ביוני בשעה 10:21"},
    {"Sales & Marketingyys":"מכירות"},
    {"הוספות.pdfyys":"הוספות. Pdf"},
    {"8:45 AMyys":"8:45 בבוקר"},
    {"Search: asddsyys":"חיפוש: ASDDS"},
    {"10:16 AMyys":"10:16"},
    {"קנון M50 מישהו ניתק פעם?yys":"קנון M50 מישהו ניתק פעם?"},
    {" to help you get started.yys":"כדי לעזור לך להתחיל."},
    {"51 filesyys":"51 קבצים"},
    {"Send emails directly to a channel in Slack.yys":"שלח אימיילים ישירות לערוץ ב- Slack."},
    {"Last reply 2 days agoyys":"תשובה אחרונה לפני יומיים"},
    {"11:57 PMyys":"23:57"},
    {"Search: sadfyys":"חיפוש: Sadf"},
    {"צור קטע חדשyys":"צור קטע חדש"},
    {"9 repliesyys":"9 תשובות"},
    {"It looks like you don't have accessyys":"נראה שאין לך גישה"},
    {"Goyys":"ללכת"},
    {"1:34 PMyys":"13:34"},
    {"3:24 AMyys":"03:24"},
    {"6 apps in אאוטנטyys":"6 אפליקציות באאוטנט"},
    {" for your team to share their project updates.yys":"כדי שהצוות שלך יוכל לשתף את עדכוני הפרוייקט שלהם."},
    {"11:37 AMyys":"11:37"},
    {"Invited memberyys":"חבר מוזמן"},
    {"8:02 AMyys":"08:02"},
    {"Apps with unread messagesyys":"אפליקציות עם הודעות שלא נקראו"},
    {"Are you sure you want to delete this message? This cannot be undone.yys":"האם אתה בטוח שברצונך למחוק הודעה זו? אי אפשר לבטל את זה."},
    {"Closeyys":"סגור"},
    {" requested to invite yys":"ביקש להזמין"},
    {"Last reply 9 days agoyys":"תשובה אחרונה לפני 9 ימים"},
    {"Wednesday, June 24thyys":"יום רביעי, 24 ביוני"},
    {"Jun 17th at 10:38 AMyys":"17 ביוני בשעה 10:38"},
    {"3:46 AMyys":"03:46"},
    {"Search: ASyys":"חיפוש: AS"},
    {"Message אבי רוזנבלטyys":"הודעה אבי רוזנבלט"},
    {"Leave #יעוץyys":"לעזוב"},
    {"Search: asdfyys":"חיפוש: asdf"},
    {"Aubergineyys":"חציל"},
    {"4yys":"4"},
    {"HR & Team Cultureyys":"HR"},
    {"When people react to your messages or mention you or your keywords, you’ll see it here.yys":"כשאנשים מגיבים להודעות שלך או מזכירים אותך או את מילות המפתח שלך, אתה תראה אותם כאן."},
    {"Last reply 19 days agoyys":"תשובה אחרונה לפני 19 יום"},
    {"למד עודyys":"למד עוד"},
    {"Last reply 18 days agoyys":"תשובה אחרונה לפני 18 יום"},
    {"Start a new messageyys":"התחל הודעה חדשה"},
    {"Startyys":"הַתחָלָה"},
    {"Organize your team's conversationsyys":"ארגן את השיחות של הצוות שלך"},
    {"5 hours agoyys":"לפני 5 שעות"},
    {"תזכורת לשרשור - סלאקyys":"תזכורת לשרשור - סלאק"},
    {"Thursday, September 10thyys":"יום חמישי, 10 בספטמבר"},
    {"Mark a message as unreadyys":"סמן הודעה כלא נקראה"},
    {"1:46 AMyys":"01:46"},
    {"joined #כללי along with yys":"הצטרף"},
    {"Search messages, files, around corners, under rugs, etc.yys":"חפש הודעות, קבצים, מסביב לפינות, מתחת לשטיחים וכו "},
    {"IMG_20200629_225138.jpgyys":"IMG_20200629_225138.jpg"},
    {"Search: asyys":"חיפוש: כמו"},
    {"Jul 2ndyys":"2 ביולי"},
    {"Use different settings for my mobile devicesyys":"השתמש בהגדרות שונות עבור המכשירים הניידים שלי"},
    {"projyys":"פרוייקט"},
    {"1 reactionyys":"תגובה 1"},
    {"קבעו לוח זמנים להודעותyys":"קבעו לוח זמנים להודעות"},
    {"נטו לחוטים שלכםyys":"נטו לחוטים שלך"},
    {"18 days agoyys":"לפני 18 יום"},
    {"You look nice today.yys":"את נראית טוב היום."},
    {"2 resultsyys":"2 תוצאות"},
    {"Add peopleyys":"הוסף אנשים"},
    {"qsdyys":"qsd"},
    {"8:01 AMyys":"08:01"},
    {"הוסף מ- Google Directoryyys":"הוסף מ- Google Directory"},
    {"3:30 PMyys":"3:30 PM"},
    {"Warn me about potentially malicious linksyys":"הזהירו אותי לגבי קישורים שעלולים להיות זדוניים"},
    {"joined #ניתוק-פיזי along with yys":"הצטרף"},
    {"Set up a daily reminder using yys":"הגדר תזכורת יומית באמצעות"},
    {"Remove Preview?yys":"האם להסיר את התצוגה המקדימה?"},
    {"What’s up for discussion?yys":"מה עומד לדיון?"},
    {"Overrides normal browser search behavioryys":"עוקף את התנהגות החיפוש הרגילה בדפדפן"},
    {"לחץ על Ctrl Shift K כדי למצוא או לקרוא הודעה ישירה. לחץ על מחק כדי לכתוב הודעה ישירה מהסרגל עמודyys":"לחץ על Ctrl Shift K כדי למצוא או לקרוא הודעה ישירה. לחץ על מחק כדי לכתוב הודעה ישירה מהסרגל עמוד"},
    {"Set yourself as yys":"הגדירו את עצמכם כ"},
    {"Joinedyys":"הצטרף"},
    {" — yys":"-"},
    {"Jun 17th at 10:26:06 AMyys":"17 ביוני בשעה 10:26:06 בבוקר"},
    {"”yys":"\""},
    {"40 repliesyys":"40 תשובות"},
    {"11:33 AMyys":"11:33"},
    {"לחץ על Ctrl Shift כדי למצוא או ליצור ערוץyys":"לחץ על Ctrl Shift כדי למצוא או ליצור ערוץ"},
    {"4:01 PMyys":"16:01"},
    {"Email addressyys":"כתובת דוא\"ל"},
    {"Custom rules for this workspace:yys":"כללים מותאמים אישית עבור סביבת עבודה זו:"},
    {"6 days agoyys":"לפני 6 ימים"},
    {"New Messageyys":"הודעה חדשה"},
    {"לנובו TB7305F.pdfyys":"לנובו TB7305F.pdf"},
    {"פתח את האפליקציה Slack yys":"פתח את האפליקציה רפוי"},
    {"More optionsyys":"אפשרויות נוספות"},
    {"מדריך ASUS 203M.pdfyys":"מדריך ASUS 203M.pdf"},
    {"2:29 AMyys":"02:29"},
    {"כל הספר הקבציםyys":"כל הספר הקבצים"},
    {"View all 51 membersyys":"צפו בכל 51 החברים"},
    {"9:05 AMyys":"9:05 בבוקר"},
    {"Create a presentationyys":"צור מצגת"},
    {"Start a new line (use yys":"התחל קו חדש (השתמש"},
    {"4 repliesyys":"4 תשובות"},
    {"View Filesyys":"צפה בקבצים"},
    {"Even if they're larger than 2MByys":"גם אם הם גדולים מ- 2MB"},
    {"Createyys":"לִיצוֹר"},
    {"5:08 AMyys":"05:08"},
    {"2 othersyys":"2 אחרים"},
    {"Today at 8:01 AMyys":"היום בשעה 08:01"},
    {"1:47 AMyys":"01:47"},
    {"Monday, September 14thyys":"יום שני, 14 בספטמבר"},
    {"30 MByys":"30 מגה בייט"},
    {"Pollyyys":"פולי"},
    {"8:13 AMyys":"8:13 בבוקר"},
    {"Search: syys":"חיפוש: ש"},
    {"Message עקיבא שטרןyys":"הודעה עקיבא שטרן"},
    {"עובדאם אישית ...yys":"עובדאם אישית ..."},
    {"Add a yys":"הוסף"},
    {"5yys":"5"},
    {"Lyys":"ל"},
    {"Aug 17th at 10:48:00 PMyys":"17 באוגוסט בשעה 22:48:00"},
    {"Jul 3rd at 12:43:14 AMyys":"3 ביולי בשעה 12:43:14 בבוקר"},
    {"Do Not Disturb allows you to pause your Slack notificationsyys":"אל תפריע מאפשר לך להשהות את ההתראות שלך"},
    {"User groupsyys":"קבוצות משתמש"},
    {"Most relevantyys":"הכי רלוונטי"},
    {"4:04 PMyys":"16:04"},
    {"Nameyys":"שֵׁם"},
    {"People & user groupsyys":"אֲנָשִׁים"},
    {"מדריך היישומיםyys":"מדריך היישומים"},
    {"Type what you want to search for. Slack will do the rest.yys":"הקלד את מה שאתה רוצה לחפש. הרפוי יעשה את השאר."},
    {"joined #תוכנת-אאוטנט.yys":"הצטרף"},
    {"Search: aooyys":"חיפוש: aoo"},
    {"Thursday, July 16thyys":"יום חמישי ה- 16 ביולי"},
    {"51 members in yys":"51 חברים ב"},
    {"1:17 AMyys":"01:17"},
    {"Compose a custom messageyys":"כתוב הודעה בהתאמה אישית"},
    {"Search: אפליקציהayys":"חיפוש: אפליקציה א"},
    {"12:36 AMyys":"12:36"},
    {"חפש בערוצים שלי בלבדyys":"חפש בערוצים שלי בלבד"},
    {"Thursday, September 17thyys":"יום חמישי, 17 בספטמבר"},
    {"Iyys":"אני"},
    {"3:58 PMyys":"15:58"},
    {"sadfyys":"עצב"},
    {"3 othersyys":"3 אחרים"},
    {"38yys":"38"},
    {"See All 39 Membersyys":"ראה את כל 39 החברים"},
    {"Mute #יעוץyys":"לְהַשְׁתִיק"},
    {"Emailsyys":"מיילים"},
    {"July 2020yys":"יולי 2020"},
    {"Search: apyys":"חיפוש: ap"},
    {"Last reply 22 days agoyys":"תשובה אחרונה לפני 22 יום"},
    {"18 othersyys":"18 אחרים"},
    {"slackbotyys":"רפוי"},
    {"your profileyys":"הפרופיל שלך"},
    {"Add appsyys":"הוסף אפליקציות"},
    {"3 repliesyys":"3 תשובות"},
    {"Sunday, November 1styys":"יום ראשון, 1 בנובמבר"},
    {"Your Workflowsyys":"תזרימי העבודה שלך"},
    {"2:37 PMyys":"02:37"},
    {"יצחק יעקב הרשברגyys":"יצחק יעקב הרשברג"},
    {"רפויyys":"רפוי"},
    {"41 membersyys":"41 חברים"},
    {"נשמעyys":"נשמע"},
    {"Compactyys":"קוֹמפָּקטִי"},
    {"1:56 AMyys":"01:56"},
    {"Friday, July 24thyys":"יום שישי, 24 ביולי"},
    {"11 days agoyys":"לפני 11 יום"},
    {"Detailsyys":"פרטים"},
    {"Search: wyys":"חיפוש: w"},
    {"שלח לי מדי פעם סקרים דרך Slackbotyys":"שלח לי מדי פעם סקרים דרך Slackbot"},
    {"11yys":"11"},
    {"Draftsyys":"דַמקָה"},
    {"Show text previews of linked websitesyys":"הצג תצוגה מקדימה של טקסט של אתרים מקושרים"},
    {"Jun 4thyys":"4 ביוני"},
    {"Jul 7th at 5:10 AMyys":"7 ביולי בשעה 05:10"},
    {" — the problem may be on our end.yys":"- יתכן שהבעיה נמצאת בסוף."},
    {"47+ messagesyys":"47 הודעות"},
    {"Local timeyys":"זמן מקומי"},
    {"8:00 AMyys":"8:00 בבוקר"},
    {"כתובת דואyys":"כתובת דוא"},
    {"Mondrianyys":"מונדריאן"},
    {"Yossi Zahnyys":"יוסי זאן"},
    {"Megan Anneyys":"מייגן אן"},
    {"Mood Indigoyys":"מצב רוח אינדיגו"},
    {"28yys":"28"},
    {"60 repliesyys":"60 תשובות"},
    {"Sayys":"Sa"},
    {"Create simple polls and surveys in Slackyys":"צור סקרים וסקרים פשוטים ב- Slack"},
    {"14 repliesyys":"14 תשובות"},
    {"Remind me about thisyys":"תזכיר לי את זה"},
    {"Add a channelyys":"הוסף ערוץ"},
    {"20yys":"20"},
    {"שלי: הכי חדשyys":"שלי: הכי חדש"},
    {"Codeyys":"קוד"},
    {"Top Priorityyys":"חשיבות עליונה"},
    {"sl;dyys":"sl; ד"},
    {"Yesterday at 2:44 PMyys":"אתמול בשעה 14:44"},
    {"על התראותyys":"על הודעה"},
    {"asd'yys":"asd '"},
    {"10:07 PMyys":"10:07"},
    {"1yys":"1"},
    {"appyys":"אפליקציה"},
    {"לאורחים אלה תהיה גישה רק להודעות ולקבצים בערוץ יחיד.yys":"לאורחים אלה יהיו תגובה רק להודעות הקבצים בערוץ יחיד."},
    {"10:40 AMyys":"10:40 בבוקר"},
    {"Marcel Gherkinsyys":"מרסל גרקינס"},
    {"Jul 12th at 10:44:17 AMyys":"12 ביולי בשעה 10:44:17 בבוקר"},
    {"Monday, October 26thyys":"יום שני 26 באוקטובר"},
    {"Tried and trueyys":"ניסה ואמת"},
    {": Try yys":"נסה"},
    {"Open this window with yys":"פתח את החלון עם"},
    {"What do you want to build today?yys":"מה אתה רוצה לבנות היום?"},
    {"10:33 PMyys":"22:33"},
    {"12:58 PMyys":"12:58"},
    {"Add shortcuts from appsyys":"הוסף קיצורי דרך מאפליקציות"},
    {"7:34 AMyys":"07:34"},
    {"File typeyys":"סוג קובץ"},
    {"ערוציםyys":"ערוצים"},
    {"21 days agoyys":"לפני 21 יום"},
    {"Update your statusyys":"עדכן את הסטטוס שלך"},
    {"Shareyys":"לַחֲלוֹק"},
    {"Create a documentyys":"צור מסמך"},
    {"קיצורי דרך במקלדתyys":"קיצורי דרך במקלדת"},
    {"These guests will only have access to messages and files in a single channel.yys":"לאורחים אלה תהיה גישה רק להודעות ולקבצים בערוץ יחיד."},
    {"טאבלאט sansui דגם san-8487yys":"טאבלאט sansui דגם san-8487"},
    {"Saved 13 minutes agoyys":"נשמר לפני 13 דקות"},
    {" On a call…”yys":"בשיחה ... ”"},
    {"Follow threadyys":"עקוב אחר החוט"},
    {"Pyys":"ע"},
    {"14 days agoyys":"לפני 14 יום"},
    {"Search: dsf'yys":"חיפוש: dsf '"},
    {"6:05 AMyys":"6:05 בבוקר"},
    {"12:18 AMyys":"00:18"},
    {"למדו על האשכולותyys":"למדו על האשכולות"},
    {"aviyys":"אבי"},
    {"2:33 PMyys":"02:33"},
    {"Press Ctrl Shift K to find or create a direct message. Press delete to remove a direct message from the sidebaryys":"לחץ על Ctrl Shift K כדי למצוא או ליצור הודעה ישירה. לחץ על מחק כדי להסיר הודעה ישירה מהסרגל הצד"},
    {"Last weekyys":"שבוע שעבר"},
    {"Saturday, June 13thyys":"שבת, 13 ביוני"},
    {"Yesterday at 4:41:11 AMyys":"אתמול בשעה 04:41:11"},
    {"כתוב הודעה בהתאמה אישיתyys":"כתוב הודעה בהתאמה אישית"},
    {"Haberdasheryyys":"סִדְקִית"},
    {"2:27 PMyys":"2:27 אחר הצהריים"},
    {"Not in channelyys":"לא בערוץ"},
    {"Onyys":"עַל"},
    {"2:32 PMyys":"02:32"},
    {"Sunday, October 4thyys":"יום ראשון, 4 באוקטובר"},
    {"Jun 17th at 10:42:54 AMyys":"17 ביוני בשעה 10:42:54"},
    {"Callyys":"שִׂיחָה"},
    {"11:12 PMyys":"23:12"},
    {"כל הסוגיםyys":"כל הסוגים"},
    {"Tuesday, June 23rdyys":"יום שלישי, 23 ביוני"},
    {"(yys":"("},
    {"Friday, September 11thyys":"יום שישי 11 בספטמבר"},
    {"Search: אפליקציהapyys":"חיפוש: אפליקציה ap"},
    {"15 days agoyys":"לפני 15 יום"},
    {"אנו מצטערים על זה! לפני שתנסה לפתור בעיות, אנא בדוקyys":"אנו מצטערים על זה! לפני שתנסה לפתור בעיות, אנא בדוק"},
    {"vlc-for-android-3-3-0-beta-6.apkyys":"vlc-for-android-3-3-0-beta-6.apk"},
    {"–yys":"-"},
    {"Saved itemsyys":"פריטים שמורים"},
    {"Thursday, June 18thyys":"יום חמישי, 18 ביוני"},
    {"ראה הזמנת עברyys":"ראה הזמנת עבר"},
    {"Monday, October 19thyys":"יום שני 19 באוקטובר"},
    {"Thursday, July 23rdyys":"יום חמישי 23 ביולי"},
    {"Add from Google Directoryyys":"הוסף מ- Google Directory"},
    {"By priority, based on how you use Slackyys":"לפי עדיפות, על סמך אופן השימוש ב- Slack"},
    {"Prompt to confirmyys":"בקש לאשר"},
    {" yys":" "},
    {"שלחו לי התראות דוא\"ל על אזכורים והודעות ישירותyys":"שלחו לי הודעה דוא"},
    {"Weyys":"אָנוּ"},
    {"Thursday, November 26thyys":"יום חמישי, 26 בנובמבר"},
    {"לשלוח הזמנותyys":"לשלוח הזמנות"},
    {"ניתוק-פיזיyys":"ניתוק-פיזי"},
    {"טיפים לתחילת העבודהyys":"טיפים לתחילת העבודה"},
    {"Jun 4th at 5:35:05 AMyys":"4 ביוני בשעה 05:35:05"},
    {"3:00 AMyys":"3:00 לפנות בוקר"},
    {"Show deactivated accountsyys":"הצג חשבונות שבוטלו"},
    {"11:03 AMyys":"11:03"},
    {"חבר מוזמןyys":"חבר מוזמן"},
    {", וyys":", ו"},
    {"10 channelsyys":"10 ערוצים"},
    {"once an houryys":"פעם בשעה"},
    {"12:35 AMyys":"12:35"},
    {"Additional options…yys":"אפשרויות נוספות…"},
    {"מנתקyys":"מנתק"},
    {"Display emoji as plain textyys":"הצג אמוג'י כטקסט רגיל"},
    {"התראותyys":"להתכתב"},
    {":tears:yys":": דמעות:"},
    {"תזכורת לשרשור - כלליyys":"תזכורת לשרשור - כללי"},
    {"handy keyboard shortcutsyys":"קיצורי מקשים שימושיים"},
    {"Mar 3rd at 12:24:27 AMyys":"3 במרץ בשעה 12:24:27 בבוקר"},
    {"Enter a phone number.yys":"הזן מספר טלפון."},
    {"Single-Channel Guests can only access messages and files in a single channel. This account type is free.yys":"אורחים עם ערוץ יחיד יכולים לגשת להודעות וקבצים בערוץ יחיד בלבד. סוג חשבון זה אינו כרוך בתשלום."},
    {"Sign in to another workspaceyys":"היכנס לסביבת עבודה אחרת"},
    {"4:47 AMyys":"04:47"},
    {"Narrow your searchyys":"צמצם את החיפוש שלך"},
    {"11:52 PMyys":"23:52"},
    {"8:00 בבוקרyys":"8:00 בבוקר"},
    {"Jun 17th at 10:22 AMyys":"17 ביוני בשעה 10:22"},
    {"Last reply today at 3:50 AMyys":"תשובה אחרונה היום בשעה 03:50"},
    {"Messages & mediayys":"הודעות"},
    {"Manage membersyys":"נהל חברים"},
    {"File browseryys":"סייר קבצים"},
    {"Phone numberyys":"מספר טלפון"},
    {"Settings & administrationyys":"הגדרות"},
    {"You won’t be notified about new repliesyys":"לא תקבל הודעה על תשובות חדשות"},
    {"Change the appearance of Slack across all of your workspaces.yys":"שנה את המראה של Slack בכל סביבות העבודה שלך."},
    {"activeyys":"פָּעִיל"},
    {"bezalel hamburgeryys":"המבורגר בצלאל"},
    {"Saturday, July 18thyys":"שבת, 18 ביולי"},
    {"Add people to #כלליyys":"הוסף אנשים ל"},
    {"4:23 AMyys":"04:23"},
    {"Leaveyys":"לעזוב"},
    {"2 hoursyys":"שעתיים"},
    {"You’re set to yys":"אתה מוכן ל"},
    {"Shortcutsyys":"קיצורי דרך"},
    {"Share invite linkyys":"שתף קישור להזמנה"},
    {"Set a notification scheduleyys":"קבעו לוח זמנים להודעות"},
    {"“yys":"\""},
    {"Monday, July 6thyys":"יום שני, ה -6 ביולי"},
    {"כל הערוצים שלךyys":"כל הערוצים שלך"},
    {"להזמין אנשיםyys":"להזמין אנשים"},
    {"12:18 PMyys":"12:18"},
    {"37yys":"37"},
    {"December 2nd, 2019yys":"2 בדצמבר, 2019"},
    {"Members can access messages and files in any public channel and access the full directory.yys":"חברים יכולים לגשת להודעות וקבצים בכל ערוץ ציבורי ולגשת לספרייה המלאה."},
    {"Slackbotyys":"Slackbot"},
    {"Name (optional)yys":"שם: (לא חובה)"},
    {"Press yys":"ללחוץ"},
    {"שמואל ליכטנשטיין and דוד הורןyys":"שמואל ליכטנשטיין ודוד הורן"},
    {"Channels are where your team members communicate. They give each project, group, or initiative a space for its own messages, files, and tools.yys":"הערוצים הם המקום בו חברי הצוות שלך מתקשרים. הם נותנים לכל פרויקט, קבוצה או יוזמה מרחב להודעות, קבצים וכלים משלו."},
    {"10:43 AMyys":"10:43"},
    {"Hide channel detailsyys":"הסתר את פרטי הערוץ"},
    {"Create Channelyys":"צור ערוץ"},
    {"New Messageyys":"הודעה חדשה"},
    {"Handy Reactionsyys":"תגובות נוחות"},
    {"(UTC-08:00) Pacific Time (US and Canada)yys":"(UTC-08: 00) שעון האוקיאנוס השקט (ארה\"ב וקנדה)"},
    {"View filesyys":"צפה בקבצים"},
    {"Show all classic themesyys":"הצג את כל הנושאים הקלאסיים"},
    {"Jun 17th at 1:04 PMyys":"17 ביוני בשעה 13:04"},
    {"10:37 AMyys":"10:37"},
    {"Sunday, June 7thyys":"ראשון, 7 ביוני"},
    {"Deactivated accountsyys":"חשבונות מבוטלים"},
    {"Friday, July 10thyys":"יום שישי, 10 ביולי"},
    {"3:35 PMyys":"03:35"},
    {"Start from scratchyys":"להתחיל מאפס"},
    {"Open in new windowyys":"פתח בחלון חדש"},
    {"Onium - Inject hebrew support into a slack desktop yys":"Onium - הזרק תמיכה עברית לשולחן עבודה רפוי"},
    {"Test your connectionyys":"בדוק את הקשר שלך"},
    {"Show All Unreadsyys":"הצג את כל שלא נקראו"},
    {"Display information about who is currently typing a messageyys":"הצג מידע על מי מקליד כעת הודעה"},
    {" to selectyys":"לבחור"},
    {"Myys":"M"},
    {"פתח את האפליקציה Slackyys":"פתח את האפליקציה רפוי"},
    {"With this checked use yys":"עם שימוש בדוק זה"},
    {"Page Upyys":"גלול למעלה"},
    {"Search far and wideyys":"חפש רחוק"},
    {" or even restart your browseryys":"או אפילו להפעיל מחדש את הדפדפן"},
    {"29yys":"29"},
    {" edited 1 month agoyys":"נערך לפני חודש"},
    {"View messageyys":"הצג הודעה"},
    {"רוב החבריםyys":"רוב החברים"},
    {"(edited)yys":"(עָרוּך)"},
    {"Wednesday, July 22ndyys":"יום רביעי, 22 ביולי"},
    {"in:yys":"ב:"},
    {"Last reply 16 days agoyys":"תשובה אחרונה לפני 16 יום"},
    {"Press delete to remove messages from an app from the sidebaryys":"לחץ על מחק כדי להסיר הודעות מאפליקציה מהסרגל הצד"},
    {"5 apps in אאוטנטyys":"5 אפליקציות באאוטנט"},
    {"2:06 PMyys":"14:06"},
    {") ברשימת הערוצים שלי כאשר מישהו משתמש באחת ממילות המפתח שלי:yys":") ברשימה הערות שלי כאשר מישהו משתמש באחת ממילות המפתח שלי:"},
    {"The last visible message in the list will be selectedyys":"ההודעה האחרונה הנראית ברשימה תיבחר"},
    {"Ochinyys":"אוצ'ין"},
    {"Search discussions, directories, data, and moreyys":"חפש דיונים, ספריות, נתונים ועוד"},
    {"Yesterday at 12:43:14 AMyys":"אתמול בשעה 12:43:14 בבוקר"},
    {"Imagesyys":"תמונות"},
    {"Edityys":"לַעֲרוֹך"},
    {"27yys":"27"},
    {"Add Shortcutyys":"הוסף קיצור דרך"},
    {"5:10 AMyys":"5:10 לפנות בוקר"},
    {"Delete draftyys":"מחק טיוטה"},
    {"Mute channelyys":"השתק ערוץ"},
    {"Remove from yys":"הסר מ"},
    {"Rename channelyys":"שנה את שם הערוץ"},
    {"Smileys & Peopleyys":"סמיילים"},
    {"Last reply 21 days agoyys":"תשובה אחרונה לפני 21 יום"},
    {"authorize MailClark to post messages on your behalfyys":"לאשר ל- MailClark לפרסם הודעות בשמך"},
    {"4:14 AMyys":"04:14"},
    {"jskdjyys":"jskdj"},
    {"חיפושים אחרוניםyys":"חיפושים אחרונים"},
    {"Notification schedule NEWyys":"לוח זמנים להודעות חָדָשׁ"},
    {"awayyys":"רָחוֹק"},
    {"Browse appsyys":"עיין באפליקציות"},
    {"Aug 12th at 10:04:17 PMyys":"12 באוגוסט בשעה 22:04:17"},
    {"Code blockyys":"חסימת קוד"},
    {"6:13 AMyys":"6:13 בבוקר"},
    {"kanha ho tm logyys":"קינה הו tm יומן"},
    {"Tuesday, December 1styys":"יום שלישי, 1 בדצמבר"},
    {"Multi-Channel Guestsyys":"אורחים רב ערוציים"},
    {"Jul 1st at 5:42:01 PMyys":"1 ביולי בשעה 05:42:01"},
    {"No resultsyys":"אין תוצאות"},
    {"Thursday, July 2ndyys":"יום חמישי, 2 ביולי"},
    {"To change your full or display name, head to yys":"כדי לשנות את שם המלא או התצוגה שלך, עבור אל"},
    {"11:10 AMyys":"11:10 בבוקר"},
    {"Find another reactionyys":"מצא תגובה אחרת"},
    {"Question Conciergeyys":"קונסיירז 'שאלה"},
    {"Try out an easy-to-customize template and get inspired to build your own workflows.yys":"נסה תבנית קלה להתאמה אישית וקבל השראה לבנות זרימות עבודה משלך."},
    {"Notification scheduleyys":"לוח זמנים להודעות"},
    {"3 draftsyys":"3 טיוטות"},
    {"Never ask again on this computeryys":"לעולם אל תשאל שוב במחשב זה"},
    {"Friday, October 23rdyys":"יום שישי, 23 באוקטובר"},
    {"2:54 PMyys":"14:54"},
    {"There are no files to see here right now! But there could be — drag and drop any file into the message pane to add it to this conversation.yys":"אין כרגע קבצים שצפו כאן! אבל יכול להיות - גרור ושחרר כל קובץ בחלונית ההודעות כדי להוסיף אותו לשיחה זו."},
    {"ערכות נושאyys":"ערכות נושא"},
    {"33 filesyys":"33 קבצים"},
    {"Mark all messages in current channel as readyys":"סמן את כל ההודעות בערוץ הנוכחי כנקראו"},
    {"5 אפליקציות באאוטנטyys":"5 אפליקציות באאוטנט"},
    {"Mark as readyys":"סמן כנקרא"},
    {"Hide deactivated accountsyys":"הסתר חשבונות מבוטלים"},
    {"08:02yys":"08:02"},
    {"\"\"yys":"\"\""},
    {"2 filesyys":"2 קבצים"},
    {"Translate this messageyys":"תרגם הודעה זו"},
    {" to stick them here.yys":"לתקוע אותם כאן."},
    {"Templatesyys":"תבניות"},
    {"Get a Forwarding Addressyys":"קבל כתובת העברה"},
    {"עזרא שריםyys":"עזרא שרים"},
    {"(disable this for extra privacy)yys":"(השבת זאת לפרטיות נוספת)"},
    {"Find workspacesyys":"מצא סביבות עבודה"},
    {" to add a new lineyys":"להוסיף שורה חדשה"},
    {"Add a titleyys":"הוסף כותרת"},
    {"12:06 AMyys":"12:06 בבוקר"},
    {"8:57 AMyys":"8:57 בבוקר"},
    {"saffyys":"חריף"},
    {"joined test along with yys":"הצטרף למבחן יחד עם"},
    {"When a channel is set to private, it can only be viewed or joined by invitation.yys":"כאשר ערוץ מוגדר כפרטי, ניתן לצפות בו או להצטרף אליו רק בהזמנה."},
    {"Tuesday, July 28thyys":"יום שלישי, 28 ביולי"},
    {"הרגשה נהדרת!yys":"הרגשה נהדרת!"},
    {"For later readingyys":"לקריאה בהמשך"},
    {"כל סוגי הקבציםyys":"כל הספר הקבצים"},
    {"Today at 9:20 AMyys":"היום בשעה 9:20"},
    {"ז עד אyys":"ז עד א"},
    {"Wednesday, December 2ndyys":"יום רביעי, 2 בדצמבר"},
    {"For updates and work from a department or teamyys":"לקבלת עדכונים ועבודה ממחלקה או צוות"},
    {"Run Trivia gameyys":"הפעל משחק טריוויה"},
    {"Get more apps with shortcutsyys":"קבל יישומים נוספים עם קיצורי דרך"},
    {"Jun 29th at 4:17 AMyys":"29 ביוני בשעה 04:17"},
    {"12:52 AMyys":"12:52 בבוקר"},
    {"Jun 8th at 12:28 PMyys":"8 ביוני בשעה 12:28"},
    {"joined #אנדרואיד along with yys":"הצטרף"},
    {"Monday, September 7thyys":"יום שני, 7 בספטמבר"},
    {"Send a welcome message using yys":"שלח הודעת קבלת פנים באמצעות"},
    {"Topicyys":"נוֹשֵׂא"},
    {"הוסף סביבות עבודהyys":"הוסף סביבות עבודה"},
    {"אתה נראה נחמד הלילה.yys":"אתה נראה נחמד הלילה."},
    {"All your direct messagesyys":"כל ההודעות הישירות שלך"},
    {"Draft messages to send when you’re readyyys":"טיוטת הודעות לשליחה כשאתה מוכן"},
    {"Themeyys":"נושא"},
    {"Deleteyys":"לִמְחוֹק"},
    {"https://status.slack.comyys":"https://status.slack.com"},
    {" and click messageyys":"ולחץ על הודעה"},
    {"3:27 AMyys":"3:27 לפנות בוקר"},
    {"פּרוֹפִילyys":"פּרוֹפִיל"},
    {"With yys":"עם"},
    {"See All Filesyys":"ראה את כל הקבצים"},
    {"Wednesday, September 23rdyys":"יום רביעי 23 בספטמבר"},
    {"Save messages and files to come back to lateryys":"שמור הודעות וקבצים כדי לחזור אליהם אחר כך"},
    {"Filter byyys":"סנן לפי"},
    {"35 membersyys":"35 חברים"},
    {" for more details, or yys":"לפרטים נוספים, או"},
    {"שינוי גודל_ IMG_0849.jpgyys":"שינוי גודל_ IMG_0849.jpg"},
    {"PDF Filesyys":"קבצי PDF"},
    {"2:31 AMyys":"02:31"},
    {"לשרתים של Slack.yys":"סלתר."},

]

