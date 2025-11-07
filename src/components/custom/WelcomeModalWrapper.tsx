"use client";

import { useRef } from 'react';
import WelcomeModal, { WelcomeModalHandle } from './WelcomeModal';
import WelcomeModalTrigger from './WelcomeModalTrigger';

export default function WelcomeModalWrapper() {
  const modalRef = useRef<WelcomeModalHandle>(null);

  const handleOpenModal = () => {
    modalRef.current?.open();
  };

  return (
    <>
      <WelcomeModal ref={modalRef} />
      <WelcomeModalTrigger onOpen={handleOpenModal} />
    </>
  );
}
