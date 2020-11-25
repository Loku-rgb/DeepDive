export default {
    items: [
        {
            id: 'other',
            title: 'Intelligence',
            type: 'group',
            icon: 'icon-other',
            children: [
                {
                    id: 'test-page1',
                    title: 'Documents',
                    type: 'item',
                    icon: 'feather icon-folder',
                    url: '/Intelligence/documents'
                },
                {
                    id: 'test-page2',
                    title: 'Contacts',
                    type: 'item',
                    icon: 'feather icon-users',
                    url: '/Intelligence/contacts'
                },
                {
                    id: 'test-page3',
                    title: 'Insights',
                    type: 'item',
                    icon: 'feather icon-pie-chart',
                    url: '/Intelligence/insights'
                },
            ]
        },
        {
            id: 'pages',
            title: '',
            type: 'group',
            icon: 'icon-pages',
            children: [
                {
                    id: 'set',
                    title: 'Settings',
                    type: 'collapse',
                    icon: 'feather icon-settings',
                    children: [
                        {
                            id: 'sample-page',
                            title: 'Setting & Tag Manager',
                            type: 'item',
                            url: '/Settings/SettingTagManager',
                            breadcrumbs: false
                        }
                    ]
                },
                {
                    id: 'sample-page2',
                    title: 'Account',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'sample-page4',
                            title: 'Invoices ',
                            type: 'item',
                            url: '/Account/Invoices',
                            breadcrumbs: false
                        }
                    ]
                },
                {
                    id: 'disabled-menu',
                    title: 'SignOut',
                    type: 'item',
                    url: '#',
                    classes: 'nav-item ',
                    icon: 'feather icon-power'
                },

            ]
        }

    ]
}
