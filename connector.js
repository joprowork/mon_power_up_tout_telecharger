var TRELLO_API_KEY = '28d80811d05a80d515472323f02aab53';

TrelloPowerUp.initialize({
    'card-back-section': function(t, options) {
        return {
            title: '📥 Télécharger les pièces jointes',
            icon: 'https://cdn-icons-png.flaticon.com/512/724/724933.png',
            content: {
                type: 'iframe',
                url: t.signUrl('./section.html'),
                height: 100
            }
        };
    }
}, {
    appKey: TRELLO_API_KEY,
    appName: 'Attachments Downloader'
});
