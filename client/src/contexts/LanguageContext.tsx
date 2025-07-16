import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Landing Page
    'landing.title': 'Proof of a Miracle',
    'landing.subtitle': 'Share your faith experiences and connect with believers worldwide',
    'landing.description': 'Join our Christian community to share testimonies, discover miracles, and strengthen your faith through the power of shared experiences.',
    'landing.login': 'Log In',
    'landing.getStarted': 'Get Started',
    'landing.languageSelector': 'Language',
    
    // Navigation
    'nav.feed': 'Feed',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.logout': 'Log Out',
    
    // Posts
    'post.createPost': 'Share Your Miracle',
    'post.pray': 'Pray',
    'post.love': 'Love',
    'post.comment': 'Comment',
    'post.editPost': 'Edit Post',
    'post.deletePost': 'Delete Post',
    'post.reportPost': 'Report Post',
    'post.blockUser': 'Block User',
    
    // Create Post Modal
    'createPost.title': 'Share Your Miracle',
    'createPost.content': 'Share your testimony or miracle experience...',
    'createPost.location': 'Location (optional)',
    'createPost.getLocation': 'Get Current Location',
    'createPost.uploadImage': 'Upload Image',
    'createPost.cancel': 'Cancel',
    'createPost.share': 'Share',
    'createPost.completeProfile': 'Complete Your Profile',
    'createPost.completeProfileDesc': 'Please complete your profile before creating posts. This helps build a trusted faith community.',
    'createPost.completeProfileBtn': 'Complete Profile',
    
    // Profile
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'profile.email': 'Email',
    'profile.age': 'Age',
    'profile.gender': 'Gender',
    'profile.city': 'City',
    'profile.state': 'State',
    'profile.country': 'Country',
    'profile.male': 'Male',
    'profile.female': 'Female',
    'profile.updateProfile': 'Update Profile',
    'profile.deleteAccount': 'Delete Account',
    'profile.adminPanel': 'Admin Panel',
    
    // Comments
    'comments.title': 'Comments',
    'comments.placeholder': 'Write a comment...',
    'comments.noComments': 'No comments yet. Be the first to comment!',
    'comments.completeProfile': 'Complete your profile to comment',
    'comments.completeProfileBtn': 'Complete Profile',
    
    // Messages
    'createPost.success': 'Your miracle has been shared with the community.',
    'profile.updated': 'Profile Updated! Your name changes will now appear on all your posts.',
    'comment.added': 'Comment Added: Your comment has been posted.',
    'prayer.added': 'Prayer Added: Your prayer has been added to this post.',
    'prayer.removed': 'Prayer Removed: Your prayer has been removed.',
    
    // Empty States
    'feed.noPosts': 'No posts yet',
    'feed.noPostsDesc': 'Be the first to share a miracle in our community!',
    'feed.loading': 'Loading posts...',
  },
  es: {
    // Landing Page
    'landing.title': 'Prueba de un Milagro',
    'landing.subtitle': 'Comparte tus experiencias de fe y conecta con creyentes de todo el mundo',
    'landing.description': 'Únete a nuestra comunidad cristiana para compartir testimonios, descubrir milagros y fortalecer tu fe a través del poder de las experiencias compartidas.',
    'landing.login': 'Iniciar Sesión',
    'landing.getStarted': 'Comenzar',
    'landing.languageSelector': 'Idioma',
    
    // Navigation
    'nav.feed': 'Inicio',
    'nav.profile': 'Perfil',
    'nav.admin': 'Admin',
    'nav.logout': 'Cerrar Sesión',
    
    // Posts
    'post.createPost': 'Comparte Tu Milagro',
    'post.pray': 'Orar',
    'post.love': 'Amor',
    'post.comment': 'Comentar',
    'post.editPost': 'Editar Publicación',
    'post.deletePost': 'Eliminar Publicación',
    'post.reportPost': 'Reportar Publicación',
    'post.blockUser': 'Bloquear Usuario',
    
    // Create Post Modal
    'createPost.title': 'Comparte Tu Milagro',
    'createPost.content': 'Comparte tu testimonio o experiencia milagrosa...',
    'createPost.location': 'Ubicación (opcional)',
    'createPost.getLocation': 'Obtener Ubicación Actual',
    'createPost.uploadImage': 'Subir Imagen',
    'createPost.cancel': 'Cancelar',
    'createPost.share': 'Compartir',
    'createPost.completeProfile': 'Completa Tu Perfil',
    'createPost.completeProfileDesc': 'Por favor completa tu perfil antes de crear publicaciones. Esto ayuda a construir una comunidad de fe confiable.',
    'createPost.completeProfileBtn': 'Completar Perfil',
    
    // Profile
    'profile.firstName': 'Nombre',
    'profile.lastName': 'Apellido',
    'profile.email': 'Correo Electrónico',
    'profile.age': 'Edad',
    'profile.gender': 'Género',
    'profile.city': 'Ciudad',
    'profile.state': 'Estado/Provincia',
    'profile.country': 'País',
    'profile.male': 'Masculino',
    'profile.female': 'Femenino',
    'profile.updateProfile': 'Actualizar Perfil',
    'profile.deleteAccount': 'Eliminar Cuenta',
    'profile.adminPanel': 'Panel de Administración',
    
    // Comments
    'comments.title': 'Comentarios',
    'comments.placeholder': 'Escribe un comentario...',
    'comments.noComments': '¡Aún no hay comentarios. Sé el primero en comentar!',
    'comments.completeProfile': 'Completa tu perfil para comentar',
    'comments.completeProfileBtn': 'Completar Perfil',
    
    // Messages
    'createPost.success': 'Tu milagro ha sido compartido con la comunidad.',
    'profile.updated': '¡Perfil Actualizado! Los cambios de tu nombre ahora aparecerán en todas tus publicaciones.',
    'comment.added': 'Comentario Agregado: Tu comentario ha sido publicado.',
    'prayer.added': 'Oración Agregada: Tu oración ha sido añadida a esta publicación.',
    'prayer.removed': 'Oración Removida: Tu oración ha sido removida.',
    
    // Empty States
    'feed.noPosts': 'Aún no hay publicaciones',
    'feed.noPostsDesc': '¡Sé el primero en compartir un milagro en nuestra comunidad!',
    'feed.loading': 'Cargando publicaciones...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.warn('Error setting localStorage:', error);
    }
  };

  const t = (key: string): string => {
    try {
      return translations[language]?.[key] || key;
    } catch (error) {
      console.warn('Translation error:', error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('useLanguage must be used within a LanguageProvider');
    // Return fallback to prevent white screen
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key
    };
  }
  return context;
}