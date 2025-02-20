import React, { useState, useEffect } from 'react';
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
  IonLoading,
  useIonViewWillEnter
} from '@ionic/react';
import { getDatabase, ref, onValue } from "firebase/database";

const MinistersSections: React.FC = () => {
  const [sections, setSections] = useState<{ [key: string]: any }>({});
  const [actives, setActives] = useState<any[]>([]);
  const [listKeys, setListKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useIonViewWillEnter(() => {
    loadVolunteers();
  });

  const loadVolunteers = () => {
    const sectionsData: { [key: string]: any } = {};
    const listKeysData: any[] = [];

    const db = getDatabase();
    const listRef = ref(db, `/lista-telefones`);
    onValue(listRef, (snapshot) => {
      snapshot.forEach((section: any) => {
        sectionsData[section.key] = { descricao: section.val()['descricao'], cargos: [] };
        listKeysData.push({ descricao: section.val()['descricao'], key: section.key });

        section.forEach((cargo: any) => {
          if (cargo.val() !== section.val()['descricao']) {
            sectionsData[section.key]['cargos'].push(cargo);
          }
        });
      });

      listKeysData.sort((a, b) => (a.descricao > b.descricao ? 1 : b.descricao > a.descricao ? -1 : 0));

      setSections(sectionsData);
      setListKeys(listKeysData);
      setLoading(false);
    });
  };

  const setActivesHandler = (cargo: string) => {
    setActives((prevActives) => {
      if (prevActives.includes(cargo)) {
        return prevActives.filter((active) => active !== cargo);
      } else {
        return [...prevActives, cargo];
      }
    });
  };

  const clickSection = (key: string) => {
    document.getElementById(`btn-${key}`)?.click();
  };

  const createList = () => {
    return listKeys.map((x) => {
      if (sections[x.key] !== undefined) {
        return (
          <IonItemGroup key={x.key}>
            <IonItemDivider onClick={() => clickSection(x.key)}>
              <IonLabel>{sections[x.key]['descricao']}</IonLabel>
              <IonItem id={`btn-${x.key}`} style={{ display: 'none' }} routerLink={`/ministers/${x.key}`} />
            </IonItemDivider>
          </IonItemGroup>
        );
      }
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista Telefônica</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} />
        <IonList>{createList()}</IonList>
      </IonContent>
    </IonPage>
  );
};

export default MinistersSections;
