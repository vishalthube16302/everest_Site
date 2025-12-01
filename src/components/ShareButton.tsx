import { useState, useRef, useEffect } from 'react';
import { Share2, Mail, MessageCircle, X } from 'lucide-react';

interface ShareButtonProps {
    productName: string;
    url: string;
    description?: string;
    specifications?: Record<string, any>;
    imageUrl?: string;
}

export function ShareButton({ productName, url, description, specifications, imageUrl }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getFormattedText = () => {
        let text = `*${productName}*\n\n`;

        if (description) {
            text += `${description}\n\n`;
        }

        if (specifications && Object.keys(specifications).length > 0) {
            text += `Features:\n`;
            Object.entries(specifications).forEach(([key, value]) => {
                text += `- ${key}: ${value}\n`;
            });
            text += `\n`;
        }

        text += `Check it out: ${url}`;

        // Append image URL if available (for WhatsApp preview/text fallback)
        if (imageUrl) {
            text += `\n\nImage: ${imageUrl}`;
        }

        return text;
    };

    const handleNativeShare = async () => {
        const text = getFormattedText();
        const shareData: ShareData = {
            title: productName,
            text: text,
            url: url,
        };

        // Try to share image file if available and supported
        if (imageUrl && navigator.canShare && navigator.canShare({ files: [new File([], 'test.png')] })) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], 'product-image.jpg', { type: blob.type });
                if (navigator.canShare({ files: [file] })) {
                    shareData.files = [file];
                }
            } catch (e) {
                console.warn('Failed to fetch image for sharing', e);
            }
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Error sharing:', error);
                // Fallback to dropdown if user cancelled or share failed (but not if it's just a cancellation)
                // Usually AbortError is user cancellation.
                if ((error as Error).name !== 'AbortError') {
                    setIsOpen(true);
                }
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleWhatsAppShare = () => {
        const text = getFormattedText();
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
    };

    const handleEmailShare = () => {
        const subject = `Check out ${productName}`;
        const body = getFormattedText();
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => {
                    // Check if we should try native share first
                    // Note: navigator.share requires a secure context (HTTPS) or localhost
                    const hasShare = 'share' in navigator;

                    if (hasShare) {
                        handleNativeShare();
                    } else {
                        setIsOpen(!isOpen);
                    }
                }}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Share product"
                title="Share"
            >
                <Share2 size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-200">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 flex justify-between items-center">
                            <span>Share via</span>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        </div>
                        <button
                            onClick={handleWhatsAppShare}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                        >
                            <MessageCircle size={16} className="mr-3" />
                            WhatsApp
                        </button>
                        <button
                            onClick={handleEmailShare}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                            <Mail size={16} className="mr-3" />
                            Email
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
