export default {
    items: [
        {
            id: 'intelligence',
            title: 'Intelligence',
            type: 'group',
            icon: 'icon-other',
            children: [
                {
                    id: 'documents',
                    title: 'Documents',
                    type: 'item',
                    icon: 'feather icon-folder',
                    url: '/Intelligence/documents'
                },
                {
                    id: 'contacts',
                    title: 'Contacts',
                    type: 'item',
                    icon: 'feather icon-users',
                    url: '/Intelligence/contacts'
                },
                {
                    id: 'insights',
                    title: 'Insights',
                    type: 'item',
                    icon: 'feather icon-pie-chart',
                    url: '/Intelligence/insights'
                },
            ]
        },
        {
            id: 'others',
            title: 'Others',
            type: 'group',
            icon: 'icon-pages',
            children: [
                {
                    id: 'settings',
                    title: 'Settings',
                    type: 'collapse',
                    icon: 'feather icon-settings',
                    children: [
                        {
                            id: 'settingAndtagManager',
                            title: 'Setting & Tag Manager',
                            type: 'item',
                            url: '/Settings/SettingTagManager',
                            breadcrumbs: true
                        }
                    ]
                },
                {
                    id: 'account',
                    title: 'Account',
                    type: 'collapse',
                    icon: 'feather icon-user',
                    children: [
                        {
                            id: 'myTeam',
                            title: 'My Team ',
                            type: 'item',
                            url: '/Account/MyTeam',
                            breadcrumbs: false
                        },
                        {
                            id: 'myTeamInsights',
                            title: 'My Team Insights',
                            type: 'item',
                            url: '/Account/MyTeamInsights',
                            breadcrumbs: false
                        },
                        {
                            id: 'invoices',
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
