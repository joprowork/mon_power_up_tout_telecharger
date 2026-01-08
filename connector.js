// Attachments Downloader - Power-Up Trello
// Télécharge toutes les pièces jointes d'une carte

// ============================================
// CONFIGURATION
// ============================================
var TRELLO_API_KEY = '28d80811d05a80d515472323f02aab53';

// Initialisation du Power-Up
TrelloPowerUp.initialize({
    // Bouton sur la carte (dans le menu à droite quand on ouvre la carte)
    'card-buttons': function(t, options) {
        return [{
            icon: 'https://cdn-icons-png.flaticon.com/512/724/724933.png',
            text: 'Télécharger les pièces jointes',
            callback: function(t) {
                return t.popup({
                    title: 'Télécharger les pièces jointes',
                    url: 'popup.html',
                    height: 400
                });
            },
            condition: 'edit'
        }];
    },
    
    // Section dans le dos de la carte
    'card-back-section': function(t, options) {
        return {
            title: '📥 Pièces jointes',
            icon: 'https://cdn-icons-png.flaticon.com/512/724/724933.png',
            content: {
                type: 'iframe',
                url: t.signUrl('./section.html'),
                height: 60
            }
        };
    }
}, {
    appKey: TRELLO_API_KEY,
    appName: 'Attachments Downloader'
});
