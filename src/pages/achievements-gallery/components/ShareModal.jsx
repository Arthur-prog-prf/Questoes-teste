import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShareModal = ({ isOpen, onClose, achievement }) => {
  const [shareMessage, setShareMessage] = useState('');

  if (!isOpen || !achievement) return null;

  const defaultMessage = `🏆 Acabei de conquistar "${achievement?.title}" no Painel de Aprovação! \n\n${achievement?.description}\n\n#EstudosPublicos #Conquista #Aprovacao`;

  const handleShare = (platform) => {
    const message = shareMessage || defaultMessage;
    const encodedMessage = encodeURIComponent(message);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedMessage}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedMessage}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}`
    };

    if (shareUrls?.[platform]) {
      window.open(shareUrls?.[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    const message = shareMessage || defaultMessage;
    navigator.clipboard?.writeText(message)?.then(() => {
      alert('Mensagem copiada para a área de transferência!');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Compartilhar Conquista</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Achievement Preview */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name={achievement?.icon} size={24} color="white" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{achievement?.title}</h4>
              <p className="text-sm text-text-secondary">{achievement?.description}</p>
            </div>
          </div>
        </div>

        {/* Custom Message */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Personalizar mensagem (opcional)
          </label>
          <textarea
            value={shareMessage}
            onChange={(e) => setShareMessage(e?.target?.value)}
            placeholder={defaultMessage}
            className="w-full p-3 border border-border rounded-lg resize-none h-24 text-sm"
          />
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            iconName="Twitter"
            iconPosition="left"
            className="justify-center"
          >
            Twitter
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            iconName="Facebook"
            iconPosition="left"
            className="justify-center"
          >
            Facebook
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('linkedin')}
            iconName="Linkedin"
            iconPosition="left"
            className="justify-center"
          >
            LinkedIn
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('whatsapp')}
            iconName="MessageCircle"
            iconPosition="left"
            className="justify-center"
          >
            WhatsApp
          </Button>
        </div>

        {/* Copy Link */}
        <Button
          variant="secondary"
          onClick={copyToClipboard}
          iconName="Copy"
          iconPosition="left"
          fullWidth
        >
          Copiar Mensagem
        </Button>
      </div>
    </div>
  );
};

export default ShareModal;