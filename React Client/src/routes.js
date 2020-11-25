import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

// const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Default'));
const DocumentsPage = React.lazy(() => import('./Demo/Intelligence/documents'));
const ContactsPage = React.lazy(() => import('./Demo/Intelligence/contacts'));
const InsightsPage = React.lazy(() => import('./Demo/Intelligence/insights'));
const SettingTagManagerPage = React.lazy(() => import('./Demo/Settings/SettingTagManager'));
const MyTeamPage = React.lazy(() => import('./Demo/Account/MyTeam'));
const MyTeamInsightsPage = React.lazy(() => import('./Demo/Account/MyTeamInsights'));
const InvoicesPage = React.lazy(() => import('./Demo/Account/Invoices'));
const PlansPage = React.lazy(() => import('./Demo/Account/Subscription'));

// const SignInPage = React.lazy(()=> import('./App/Authentication/SignIn/SignIn1'))

const routes = [

    { path: '/Intelligence/documents', exact: true, name: 'Default', component: DocumentsPage },
    { path: '/Intelligence/contacts', exact: true, name: 'Basic', component: ContactsPage },
    { path: '/Intelligence/insights', exact: true, name: 'Basic', component: InsightsPage },
    { path: '/Settings/SettingTagManager', exact: true, name: 'Basic', component: SettingTagManagerPage },
    { path: '/Account/MyTeam', exact: true, name: 'Basic', component: MyTeamPage },
    { path: '/Account/MyTeamInsights', exact: true, name: 'Basic', component: MyTeamInsightsPage },
    { path: '/Account/Invoices', exact: true, name: 'Basic', component: InvoicesPage },
    { path: '/Account/prices', exact: true, name: 'Basic', component: PlansPage },

];

export default routes;