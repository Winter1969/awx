import actions from './sections/actions.js';
import breadcrumb from './sections/breadcrumb.js';
import createFormSection from './sections/createFormSection.js';
import createTableSection from './sections/createTableSection.js';
import header from './sections/header.js';
import lookupModal from './sections/lookupModal.js';
import navigation from './sections/navigation.js';
import pagination from './sections/pagination.js';
import permissions from './sections/permissions.js';
import search from './sections/search.js';

const details = createFormSection({
    selector: 'form',
    props: {
        formElementSelectors: [
            '#user_form .Form-textInput',
            '#user_form select.Form-dropDown'
        ]
    }
});

module.exports = {
    url() {
        return `${this.api.globals.launch_url}/#/users`;
    },
    sections: {
        header,
        navigation,
        breadcrumb,
        lookupModal,
        add: {
            selector: 'div[ui-view="form"]',
            sections: {
                details
            },
            elements: {
                title: 'div[class^="Form-title"]'
            }
        },
        edit: {
            selector: 'div[ui-view="form"]',
            sections: {
                details,
                permissions
            },
            elements: {
                title: 'div[class^="Form-title"]'
            }
        },
        list: {
            selector: 'div[ui-view="list"]',
            elements: {
                badge: 'span[class~="badge"]',
                title: 'div[class="List-titleText"]',
                add: 'button[class~="List-buttonSubmit"]'
            },
            sections: {
                search,
                pagination,
                table: createTableSection({
                    elements: {
                        username: 'td[class~="username-column"]',
                        first_name: 'td[class~="first_name-column"]',
                        last_name: 'td[class~="last_name-column"]'
                    },
                    sections: {
                        actions
                    }
                })
            }
        }
    },
    elements: {
        cancel: 'button[class*="Form-cancelButton"]',
        save: 'button[class*="Form-saveButton"]'
    }
};
