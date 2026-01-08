// Attachments Downloader - Power-Up Trello
// Clé API Trello
var TRELLO_API_KEY = '28d80811d05a80d515472323f02aab53';

// URL de base du Power-Up (GitHub Pages)
var BASE_URL = 'https://joprowork.github.io/mon_power_up_tout_telecharger';

TrelloPowerUp.initialize({
    // Section dans le dos de la carte
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
