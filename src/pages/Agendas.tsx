import React, { useState, useEffect, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItemGroup,
  IonItemDivider,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonLoading
} from '@ionic/react';
import { useIonViewWillEnter } from '@ionic/react';
import { getDatabase, ref, onValue } from "firebase/database";
import moment from 'moment';
import './Agendas.css';

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const monthsPtBr = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const Agendas: React.FC = () => {
  const [agendas, setAgendas] = useState<{ [index: string]: any }>({});
  const [activeMonths, setActiveMonths] = useState<string[]>([months[new Date().getMonth()]]);
  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<{ [index: string]: any }>({});
  const [open, setOpen] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    loadAgendas();
  });

  const loadAgendas = useCallback(() => {
    const db = getDatabase();
    const agendasRef = ref(db, '/agendas/ministeriais');
    onValue(agendasRef, (snapshot) => {
      addListAgendas(snapshot)
    });
  }, []);

  const addListAgendas = (entity: any) => {
    let agendasData: { [index: string]: any } = {};
    entity.forEach((element: any) => {
      agendasData[element.key] = element.val();
    });
    setAgendas(agendasData);
    setLoading(false);
  };

  const setActiveMonthsHandler = (month: string) => {
    setActiveMonths((prevActiveMonths) => {
      const newActiveMonths = [...prevActiveMonths];
      if (newActiveMonths.includes(month)) {
        const index = newActiveMonths.indexOf(month);
        if (index > -1) {
          newActiveMonths.splice(index, 1);
        }
      } else {
        newActiveMonths.push(month);
      }
      return newActiveMonths;
    });
  };

  const createListGroups = () => {
    return months.map((month, index) => (
      <IonItemGroup key={index}>
        <IonItemDivider onClick={() => setActiveMonthsHandler(month)}>
          <IonLabel className="capitalize">{monthsPtBr[index]}</IonLabel>
        </IonItemDivider>
        {createListItems(month)}
      </IonItemGroup>
    ));
  };

  const openModal = (agenda: any) => {
    setDetails(agenda);
    setOpen(true);
  };

  const createListItems = (month: string) => {
    const monthAgendas = Object.values(agendas[month] || {})
      .filter((agenda: any) => agenda !== 'description')
      .sort((a: any, b: any) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));

    return monthAgendas.map((agenda: any, index) => {
      const diff = moment(agenda.date).diff(moment(), 'days');
      const color = diff > -1 && diff < 4 ? 'danger' : '';
      return (
        <IonItem
          key={index}
          style={!activeMonths.includes(month) ? { display: 'none' } : { display: 'inherit' }}
          onClick={() => openModal(agenda)}
        >
          <IonLabel color={color}>
            {moment(agenda.date).format('DD/MM/YYYY')} - {agenda.time} - {agenda.name}
          </IonLabel>
        </IonItem>
      );
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendário {moment().year()}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} />
        <IonModal
          isOpen={open}
          className="my-custom-class"
          onDidDismiss={() => setOpen(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Detalhes da Reunião</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              Título: {details.name}
            </IonItem>
            <IonItem>
              Data e Horário: {moment(details.date).format('DD/MM/YYYY')} {details.time}
            </IonItem>
            <IonItem>
              Local: {details.place}
            </IonItem>
            <IonItem>
              Detalhes: {details.description}
            </IonItem>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonButton expand="block" onClick={() => setOpen(false)}>
                    Fechar
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
        <IonList lines="none">{createListGroups()}</IonList>
      </IonContent>
    </IonPage>
  );
};

export default Agendas;
