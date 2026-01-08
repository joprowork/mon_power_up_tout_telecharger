// Attachments Downloader - Power-Up Trello
// Télécharge toutes les pièces jointes d'une carte en un seul ZIP

// ============================================
// CONFIGURATION - Remplace par ta clé API
// ============================================
var TRELLO_API_KEY = '28d80811d05a80d515472323f02aab53';

// Fonction pour nettoyer le nom de fichier (enlever les caractères interdits)
function sanitizeFileName(name) {
    return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
}

// Fonction pour télécharger un fichier et retourner son contenu en blob
async function fetchAttachment(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error('Erreur HTTP: ' + response.status);
        }
        
        return await response.blob();
    } catch (error) {
        console.error('Erreur téléchargement:', url, error);
        return null;
    }
}

// Fonction principale pour télécharger toutes les pièces jointes
async function downloadAllAttachments(t) {
    try {
        // Récupérer les infos de la carte
        const card = await t.card('id', 'name', 'attachments');
        const attachments = card.attachments;
        
        if (!attachments || attachments.length === 0) {
            t.alert({
                message: 'Aucune pièce jointe sur cette carte.',
                duration: 3
            });
            return;
        }
        
        // Filtrer uniquement les vrais fichiers (pas les liens)
        const fileAttachments = attachments.filter(function(att) {
            return att.isUpload === true || att.url.includes('trello-attachments');
        });
        
        if (fileAttachments.length === 0) {
            t.alert({
                message: 'Aucun fichier uploadé sur cette carte (seulement des liens).',
                duration: 3
            });
            return;
        }
        
        // Afficher un message de progression
        t.alert({
            message: '📥 Téléchargement de ' + fileAttachments.length + ' fichier(s) en cours...',
            duration: 10
        });
        
        // Créer le ZIP
        const zip = new JSZip();
        let successCount = 0;
        let errorCount = 0;
        
        // Télécharger chaque pièce jointe
        for (const attachment of fileAttachments) {
            // Utiliser l'URL de téléchargement directe
            const downloadUrl = attachment.url;
            
            const blob = await fetchAttachment(downloadUrl);
            
            if (blob && blob.size > 0) {
                // Utiliser le nom original du fichier
                let fileName = sanitizeFileName(attachment.name || 'fichier_' + successCount);
                
                // Éviter les doublons de noms
                let baseName = fileName;
                let counter = 1;
                while (zip.file(fileName)) {
                    const parts = baseName.split('.');
                    if (parts.length > 1) {
                        const ext = parts.pop();
                        fileName = parts.join('.') + '_' + counter + '.' + ext;
                    } else {
                        fileName = baseName + '_' + counter;
                    }
                    counter++;
                }
                
                zip.file(fileName, blob);
                successCount++;
            } else {
                errorCount++;
                console.log('Échec pour:', attachment.name, attachment.url);
            }
        }
        
        if (successCount === 0) {
            t.alert({
                message: '❌ Impossible de télécharger les pièces jointes. Vérifiez les permissions.',
                duration: 5
            });
            return;
        }
        
        // Générer et télécharger le ZIP
        const zipBlob = await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Nom du fichier ZIP basé sur le nom de la carte
        const cardName = sanitizeFileName(card.name || 'carte');
        const zipFileName = cardName + '_pieces_jointes.zip';
        
        // Déclencher le téléchargement
        saveAs(zipBlob, zipFileName);
        
        // Message de succès
        let message = '✅ ' + successCount + ' fichier(s) téléchargé(s) !';
        if (errorCount > 0) {
            message += ' (' + errorCount + ' non téléchargé(s))';
        }
        
        t.alert({
            message: message,
            duration: 5
        });
        
    } catch (error) {
        console.error('Erreur Power-Up:', error);
        t.alert({
            message: '❌ Erreur: ' + error.message,
            duration: 5
        });
    }
}

// Ouvrir la popup de téléchargement
function showDownloadPopup(t) {
    return t.popup({
        title: 'Télécharger les pièces jointes',
        url: 'popup.html',
        height: 200
    });
}

// Initialisation du Power-Up
TrelloPowerUp.initialize({
    // Bouton sur la carte (dans le menu à droite quand on ouvre la carte)
    'card-buttons': function(t, options) {
        return [{
            icon: 'https://cdn-icons-png.flaticon.com/512/724/724933.png',
            text: 'Télécharger les pièces jointes',
            callback: function(t) {
                return showDownloadPopup(t);
            },
            condition: 'edit'
        }];
    },
    
    // Action dans le menu contextuel de la carte (clic droit ou menu ...)
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
