import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButton,
  IonModal,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';

interface MinisterDetailsProps {
  details: { [index: string]: any };
  open: boolean;
  close: () => void;
}

const MinisterDetails: React.FC<MinisterDetailsProps> = ({ details, open, close }) => {
  const createLinkPhone = (phone: any) => {
    let newPhone = phone ? phone : '';
    newPhone = newPhone.split('/');

    return newPhone.map((fone: any) => (
      <a style={{ marginRight: 10, color: 'black' }} href={`tel:${fone.trim()}`}>
        {fone.trim()}
      </a>
    ));
  };

  return (
    <IonModal isOpen={open} className='my-custom-class'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{details.nome}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {details.hasOwnProperty('comum') && (
          <IonItem>
            Comum Congregação: {details.comum}
          </IonItem>
        )}

        {details.hasOwnProperty('email') && (
          <IonItem>
            Email: {details.email}
          </IonItem>
        )}

        {details.hasOwnProperty('cargo') && (
          <IonItem>
            Cargo: {details.cargo}
          </IonItem>
        )}

        <IonGrid>
          <IonRow>
            <IonCol size='12'>
              <IonButton expand='block' onClick={close}>
                Fechar
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default MinisterDetails;
