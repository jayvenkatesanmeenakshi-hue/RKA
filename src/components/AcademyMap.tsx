import React from 'react';

export const AcademyMap = () => {
  return (
    <div className="w-full h-[450px] bg-slate-50 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4786.673657525807!2d80.1653174758559!3d12.835386717848445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267d1a752c85d%3A0x3f6ca3491dbad35c!2sRocking%20Kids%20Academy%20(Phonics%20and%20Abacus)!5e1!3m2!1sen!2sin!4v1782020327117!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
